import * as chai from 'chai';
import * as sinon from 'sinon';
import * as chaiAsPromised from 'chai-as-promised';
import { expect } from 'chai';
import axios from 'axios';
import * as jsdom from 'jsdom';

import { IEmailPayload } from '../src/models';
import { VENDOR_CODES } from '../src/constants';
import * as helpers from '../src/lib/helpers';
import Zara from '../src/lib/vendors/zara';

chai.use(chaiAsPromised);

const TEST_DATA_URL = 'https://noted-scrape-test.s3-us-west-2.amazonaws.com/ZARA.json';

describe('ZARA', () => {
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
      const orderData = await Zara.parse(VENDOR_CODES.ZARA, payload);
      expect(orderData).to.be.deep.equal({
        orderRef: '52539009974',
        orderDate: 0,
        products: [
          {
            name: 'SOLID COLOR SHIRT',
            thumbnail:
              'https://static.zara.net/photos//2021/V/0/2/p/6987/430/526/2/w/400/6987430526_1_1_1.jpg?ts=1618238938527',
            price: 19.99
          },
          {
            name: 'SOLID COLOR SHIRT',
            thumbnail:
              'https://static.zara.net/photos//2021/V/0/2/p/6987/430/834/2/w/400/6987430834_1_1_1.jpg?ts=1614762819896',
            price: 19.99
          }
        ],
        vendor: VENDOR_CODES.ZARA,
        emailId: '179c8924b1bac44b'
      });
    });

    it('should return order data with quantity handled', async () => {
      const updatedPayload = Object.assign({}, payload);
      let updatedBody = updatedPayload.decodedBody;

      updatedBody = updatedBody.replace(
        `line-height: 17px; margin-top: 10px;"> 1`,
        `line-height: 17px; margin-top: 10px;"> 2`
      );

      updatedPayload.decodedBody = updatedBody;

      const orderData = await Zara.parse(VENDOR_CODES.ZARA, updatedPayload);
      expect(orderData).to.be.deep.equal({
        orderRef: '52539009974',
        orderDate: 0,
        products: [
          {
            name: 'SOLID COLOR SHIRT (1)',
            thumbnail:
              'https://static.zara.net/photos//2021/V/0/2/p/6987/430/526/2/w/400/6987430526_1_1_1.jpg?ts=1618238938527',
            price: 19.99
          },
          {
            name: 'SOLID COLOR SHIRT (2)',
            thumbnail:
              'https://static.zara.net/photos//2021/V/0/2/p/6987/430/526/2/w/400/6987430526_1_1_1.jpg?ts=1618238938527',
            price: 19.99
          },
          {
            name: 'SOLID COLOR SHIRT',
            thumbnail:
              'https://static.zara.net/photos//2021/V/0/2/p/6987/430/834/2/w/400/6987430834_1_1_1.jpg?ts=1614762819896',
            price: 19.99
          }
        ],
        vendor: VENDOR_CODES.ZARA,
        emailId: '179c8924b1bac44b'
      });
    });

    it('should throw error if contains lacking data', () => {
      const updatedPayload = Object.assign({}, payload);
      updatedPayload.decodedBody = '<body>Invalid Body</body>';
      expect(Zara.parse(VENDOR_CODES.ZARA, updatedPayload)).to.eventually.be.rejectedWith(Error);
    });
  });
});
