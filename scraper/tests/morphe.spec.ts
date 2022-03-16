import * as chai from 'chai';
import * as sinon from 'sinon';
import * as chaiAsPromised from 'chai-as-promised';
import { expect } from 'chai';
import axios from 'axios';
import * as moment from 'moment-timezone';
import * as jsdom from 'jsdom';

import { IEmailPayload } from '../src/models';
import { VENDOR_CODES } from '../src/constants';
import * as helpers from '../src/lib/helpers';
import Morphe from '../src/lib/vendors/morphe';

chai.use(chaiAsPromised);
moment.tz.setDefault('Etc/UTC');

const TEST_DATA_URL = 'https://noted-scrape-test.s3.us-west-2.amazonaws.com/MORPHE.json';

describe(`Morphe`, () => {
  let sandbox: sinon.SinonSandbox;
  let payload: IEmailPayload = {
    raw: '',
    id: '',
    internalDate: '',
    decodedBody: ''
  };

  before(async () => {
    const res = await axios.get(TEST_DATA_URL);

    payload.decodedBody = Buffer.from(res.data.raw, 'base64').toString('utf-8');
    payload.id = res.data.id;
    payload.internalDate = res.data.internalDate;
  });

  beforeEach(() => {
    sandbox = sinon.createSandbox();
    sandbox.stub(helpers, 'parseHtmlString').callsFake((body: string) => {
      const dom = new jsdom.JSDOM(body);

      return dom.window.document;
    });
  });

  afterEach(() => {
    sandbox.restore();
  });

  describe('parse', () => {
    it('should return order data', async () => {
      const orderData = await Morphe.parse(VENDOR_CODES.MORPHE, payload);

      expect(orderData).to.be.deep.equal({
        orderRef: '10612140',
        orderDate: Number(payload.internalDate),
        products: [
          {
            name: 'THE BEST OF BLENDS 7-PIECE BRUSH SET',
            price: 0,
            thumbnail:
              'https://cdn.shopify.com/s/files/1/0737/8455/products/MORPHE_MxHoliday_BrushSet_Group_WithBag_130x.jpg?v=1633970536'
          },
          {
            name: 'JUMBO CONTINUOUS SETTING MIST',
            price: 0,
            thumbnail:
              'https://cdn.shopify.com/s/files/1/0737/8455/products/MORPHE_MxHoliday_JumboCSM_Closed_PDP_130x.jpg?v=1633970528'
          },
          {
            name: "35X BIG PRIMPIN' ARTISTRY PALETTE",
            price: 0,
            thumbnail:
              'https://cdn.shopify.com/s/files/1/0737/8455/products/MORPHE_MxHoliday_35X_Palette_Open_PDP_130x.jpg?v=1633970530'
          }
        ],
        vendor: VENDOR_CODES.MORPHE,
        emailId: payload.id
      });
    });

    it('should return order data with quantity handled', async () => {
      const updatedPayload = Object.assign({}, payload);

      let updatedBody = updatedPayload.decodedBody;

      updatedBody = updatedBody.replace(`<br/>x 1`, `<br/>x 2`);

      updatedPayload.decodedBody = updatedBody;

      const orderData = await Morphe.parse(VENDOR_CODES.MORPHE, updatedPayload);

      expect(orderData).to.be.deep.equal({
        orderRef: '10612140',
        orderDate: Number(payload.internalDate),
        products: [
          {
            name: 'THE BEST OF BLENDS 7-PIECE BRUSH SET (1)',
            price: 0,
            thumbnail:
              'https://cdn.shopify.com/s/files/1/0737/8455/products/MORPHE_MxHoliday_BrushSet_Group_WithBag_130x.jpg?v=1633970536'
          },
          {
            name: 'THE BEST OF BLENDS 7-PIECE BRUSH SET (2)',
            price: 0,
            thumbnail:
              'https://cdn.shopify.com/s/files/1/0737/8455/products/MORPHE_MxHoliday_BrushSet_Group_WithBag_130x.jpg?v=1633970536'
          },
          {
            name: 'JUMBO CONTINUOUS SETTING MIST',
            price: 0,
            thumbnail:
              'https://cdn.shopify.com/s/files/1/0737/8455/products/MORPHE_MxHoliday_JumboCSM_Closed_PDP_130x.jpg?v=1633970528'
          },
          {
            name: "35X BIG PRIMPIN' ARTISTRY PALETTE",
            price: 0,
            thumbnail:
              'https://cdn.shopify.com/s/files/1/0737/8455/products/MORPHE_MxHoliday_35X_Palette_Open_PDP_130x.jpg?v=1633970530'
          }
        ],
        vendor: VENDOR_CODES.MORPHE,
        emailId: payload.id
      });
    });

    it('should throw error if contains lacking data', () => {
      const updatedPayload = Object.assign({}, payload);
      updatedPayload.decodedBody = '<body>Invalid Body</body>';
      expect(Morphe.parse(VENDOR_CODES.MORPHE, updatedPayload)).to.eventually.be.rejectedWith(Error);
    });
  });
});
