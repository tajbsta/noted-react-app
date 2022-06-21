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
import UrbanOutfitters from '../src/lib/vendors/urbanOutfitters';

chai.use(chaiAsPromised);
moment.tz.setDefault('Etc/UTC');

const TEST_DATA_URL = 'https://noted-scrape-test.s3.us-west-2.amazonaws.com/URBANOUTFITTERS.json';

describe(`Urban Outfitters`, () => {
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
      const updatedPayload = Object.assign({}, payload);

      let updatedBody = updatedPayload.decodedBody;

      updatedPayload.decodedBody = updatedBody;

      const orderData = await UrbanOutfitters.parse(VENDOR_CODES.URBANOUTFITTERS, updatedPayload);
      expect(orderData).to.be.deep.equal({
        orderRef: 'TP25696905',
        orderDate: Number(payload.internalDate),
        products: [
          {
            name: 'UO Thea Cardigan',
            price: 69.0,
            thumbnail: 'https://images.urbanoutfitters.com/is/image/UrbanOutfitters/64233190_045_b'
          },
          {
            name: 'BDG High & Wide Jean - Cow Print',
            price: 79.0,
            thumbnail: 'https://images.urbanoutfitters.com/is/image/UrbanOutfitters/64421381_029_b'
          }
        ],
        vendor: VENDOR_CODES.URBANOUTFITTERS,
        emailId: payload.id
      });
    });

    it('should return order data with quantity handled', async () => {
      const updatedPayload = Object.assign({}, payload);

      let updatedBody = updatedPayload.decodedBody;

      updatedBody = updatedBody.replace(
        '<td class="item-price-large" style="text-align:center;">',
        '<td class="item-price-large" style="text-align:center;">\r\n\t\t\t\t2'
      );

      updatedPayload.decodedBody = updatedBody;

      const orderData = await UrbanOutfitters.parse(VENDOR_CODES.URBANOUTFITTERS, updatedPayload);
      expect(orderData).to.be.deep.equal({
        orderRef: 'TP25696905',
        orderDate: Number(payload.internalDate),
        products: [
          {
            name: 'UO Thea Cardigan (1)',
            price: 69.0,
            thumbnail: 'https://images.urbanoutfitters.com/is/image/UrbanOutfitters/64233190_045_b'
          },
          {
            name: 'UO Thea Cardigan (2)',
            price: 69.0,
            thumbnail: 'https://images.urbanoutfitters.com/is/image/UrbanOutfitters/64233190_045_b'
          },
          {
            name: 'BDG High & Wide Jean - Cow Print',
            price: 79.0,
            thumbnail: 'https://images.urbanoutfitters.com/is/image/UrbanOutfitters/64421381_029_b'
          }
        ],
        vendor: VENDOR_CODES.URBANOUTFITTERS,
        emailId: payload.id
      });
    });

    it('should throw error if contains lacking data', () => {
      const updatedPayload = Object.assign({}, payload);
      updatedPayload.decodedBody = '<body>Invalid Body</body>';
      expect(UrbanOutfitters.parse(VENDOR_CODES.URBANOUTFITTERS, updatedPayload)).to.eventually.be.rejectedWith(Error);
    });
  });
});
