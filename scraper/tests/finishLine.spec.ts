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
import FinishLine from '../src/lib/vendors/finishLine';

chai.use(chaiAsPromised);
moment.tz.setDefault('Etc/UTC');

const TEST_DATA_URL = 'https://noted-scrape-test.s3-us-west-2.amazonaws.com/FINISHLINE.json';

describe('Finish Line', () => {
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
      const orderData = await FinishLine.parse(VENDOR_CODES.FINISHLINE, payload);
      expect(orderData).to.be.deep.equal({
        orderRef: '6782323170',
        orderDate: 1612137600000,
        products: [
          {
            name: "Big Kids' Nike Air Force 1 Low Casual Shoes",
            thumbnail: 'https://media.finishline.com/s/finishline/314192_117?$default$&hei=170&wid=170',
            price: 80
          }
        ],
        vendor: VENDOR_CODES.FINISHLINE,
        emailId: '177604614df32f03'
      });
    });

    it('should return order data with quantity handled', async () => {
      const updatedPayload = Object.assign({}, payload);
      let updatedBody = updatedPayload.decodedBody;

      updatedBody = updatedBody.replace(`Quantity: 1`, `Quantity: 3`);

      updatedPayload.decodedBody = updatedBody;

      const orderData = await FinishLine.parse(VENDOR_CODES.FINISHLINE, updatedPayload);
      expect(orderData).to.be.deep.equal({
        orderRef: '6782323170',
        orderDate: 1612137600000,
        products: [
          {
            name: "Big Kids' Nike Air Force 1 Low Casual Shoes (1)",
            thumbnail: 'https://media.finishline.com/s/finishline/314192_117?$default$&hei=170&wid=170',
            price: 80
          },
          {
            name: "Big Kids' Nike Air Force 1 Low Casual Shoes (2)",
            thumbnail: 'https://media.finishline.com/s/finishline/314192_117?$default$&hei=170&wid=170',
            price: 80
          },
          {
            name: "Big Kids' Nike Air Force 1 Low Casual Shoes (3)",
            thumbnail: 'https://media.finishline.com/s/finishline/314192_117?$default$&hei=170&wid=170',
            price: 80
          }
        ],
        vendor: VENDOR_CODES.FINISHLINE,
        emailId: '177604614df32f03'
      });
    });

    it('should throw error if contains lacking data', () => {
      const updatedPayload = Object.assign({}, payload);
      updatedPayload.decodedBody = '<body>Invalid Body</body>';
      expect(FinishLine.parse(VENDOR_CODES.BELK, updatedPayload)).to.eventually.be.rejectedWith(Error);
    });
  });
});
