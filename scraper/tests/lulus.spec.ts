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
import Lulus from '../src/lib/vendors/lulus';

chai.use(chaiAsPromised);
moment.tz.setDefault('Etc/UTC');

const TEST_DATA_URL = 'https://noted-scrape-test.s3.us-west-2.amazonaws.com/LULUS.json';

describe(`Lulus`, () => {
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
      const orderData = await Lulus.parse(VENDOR_CODES.LULUS, payload);
      expect(orderData).to.be.deep.equal({
        orderRef: '332376776',
        orderDate: Number(payload.internalDate),
        products: [
          {
            name: 'Castana Light Blue Print Button-Up Dress',
            price: 62.0,
            thumbnail: 'https://www.lulus.com/images/product/xlarge/8922361_1758316.jpg?w=126'
          },
          {
            name: 'Annalisa Blue Multi Floral Print Halter Maxi Dress',
            price: 59.5,
            thumbnail: 'https://www.lulus.com/images/product/xlarge/5033691_627582.jpg?w=126'
          }
        ],
        vendor: VENDOR_CODES.LULUS,
        emailId: payload.id
      });
    });

    it('should return order data with quantity handled', async () => {
      const updatedPayload = Object.assign({}, payload);

      let updatedBody = updatedPayload.decodedBody;

      updatedBody = updatedBody.replace(`<b>Qty:</b> 1<br>`, `<b>Qty:</b> 2<br>`);

      updatedPayload.decodedBody = updatedBody;

      const orderData = await Lulus.parse(VENDOR_CODES.LULUS, updatedPayload);
      expect(orderData).to.be.deep.equal({
        orderRef: '332376776',
        orderDate: Number(payload.internalDate),
        products: [
          {
            name: 'Castana Light Blue Print Button-Up Dress (1)',
            price: 62.0,
            thumbnail: 'https://www.lulus.com/images/product/xlarge/8922361_1758316.jpg?w=126'
          },
          {
            name: 'Castana Light Blue Print Button-Up Dress (2)',
            price: 62.0,
            thumbnail: 'https://www.lulus.com/images/product/xlarge/8922361_1758316.jpg?w=126'
          },
          {
            name: 'Annalisa Blue Multi Floral Print Halter Maxi Dress',
            price: 59.5,
            thumbnail: 'https://www.lulus.com/images/product/xlarge/5033691_627582.jpg?w=126'
          }
        ],
        vendor: VENDOR_CODES.LULUS,
        emailId: payload.id
      });
    });

    it('should throw error if contains lacking data', () => {
      const updatedPayload = Object.assign({}, payload);
      updatedPayload.decodedBody = '<body>Invalid Body</body>';
      expect(Lulus.parse(VENDOR_CODES.LULUS, updatedPayload)).to.eventually.be.rejectedWith(Error);
    });
  });
});
