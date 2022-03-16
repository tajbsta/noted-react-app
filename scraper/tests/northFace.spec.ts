import * as chai from 'chai';
import * as sinon from 'sinon';
import * as chaiAsPromised from 'chai-as-promised';
import { expect } from 'chai';
import axios from 'axios';
import * as jsdom from 'jsdom';

import { IEmailPayload } from '../src/models';
import { VENDOR_CODES } from '../src/constants';
import * as helpers from '../src/lib/helpers';
import NorthFace from '../src/lib/vendors/northFace';

chai.use(chaiAsPromised);

const TEST_DATA_URL = 'https://noted-scrape-test.s3-us-west-2.amazonaws.com/NORTHFACE.json';

describe('NORTHFACE', () => {
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
      const orderData = await NorthFace.parse(VENDOR_CODES.NORTHFACE, payload);
      expect(orderData).to.be.deep.equal({
        orderRef: '47287322',
        orderDate: Number(payload.internalDate),
        products: [
          {
            name: 'Men’s Short Sleeve Half Dome Tee',
            thumbnail: 'https://images.thenorthface.com/is/image/TheNorthFace/NF0A4M4P_PKH_hero?$108x108$',
            price: 18.75
          },
          {
            name: 'Men’s Short Sleeve Half Dome Tee',
            thumbnail: 'https://images.thenorthface.com/is/image/TheNorthFace/NF0A4M4P_DYX_hero?$108x108$',
            price: 18.75
          }
        ],
        vendor: VENDOR_CODES.NORTHFACE,
        emailId: '179c8908487d181a'
      });
    });

    it('should return order data with quantity handled', async () => {
      const updatedPayload = Object.assign({}, payload);
      let updatedBody = updatedPayload.decodedBody;

      updatedBody = updatedBody.replace(
        `                                                            1`,
        `                                                            2`
      );

      updatedPayload.decodedBody = updatedBody;

      const orderData = await NorthFace.parse(VENDOR_CODES.NORTHFACE, updatedPayload);
      expect(orderData).to.be.deep.equal({
        orderRef: '47287322',
        orderDate: Number(payload.internalDate),
        products: [
          {
            name: 'Men’s Short Sleeve Half Dome Tee (1)',
            thumbnail: 'https://images.thenorthface.com/is/image/TheNorthFace/NF0A4M4P_PKH_hero?$108x108$',
            price: 18.75
          },
          {
            name: 'Men’s Short Sleeve Half Dome Tee (2)',
            thumbnail: 'https://images.thenorthface.com/is/image/TheNorthFace/NF0A4M4P_PKH_hero?$108x108$',
            price: 18.75
          },
          {
            name: 'Men’s Short Sleeve Half Dome Tee',
            thumbnail: 'https://images.thenorthface.com/is/image/TheNorthFace/NF0A4M4P_DYX_hero?$108x108$',
            price: 18.75
          }
        ],
        vendor: VENDOR_CODES.NORTHFACE,
        emailId: '179c8908487d181a'
      });
    });

    it('should throw error if contains lacking data', () => {
      const updatedPayload = Object.assign({}, payload);
      updatedPayload.decodedBody = '<body>Invalid Body</body>';
      expect(NorthFace.parse(VENDOR_CODES.NORTHFACE, updatedPayload)).to.eventually.be.rejectedWith(Error);
    });
  });
});
