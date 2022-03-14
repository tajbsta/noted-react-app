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
import BognarAndPiccolini from '../src/lib/vendors/bognarAndPiccolini';

chai.use(chaiAsPromised);
moment.tz.setDefault('Etc/UTC');

const TEST_DATA_URL = 'https://noted-scrape-test.s3.us-west-2.amazonaws.com/BOGNARANDPICCOLINI.json';

describe('Bognar and Piccolini', () => {
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
      const orderData = await BognarAndPiccolini.parse(VENDOR_CODES.BOGNARANDPICCOLINI, payload);
      expect(orderData).to.be.deep.equal({
        orderRef: '590',
        orderDate: 1646870400000,
        products: [
          {
            name: 'Bike Shorts',
            price: 29.0,
            thumbnail:
              'https://images.squarespace-cdn.com/content/v1/5ac82191697a9886599bcea6/1603484256199-RWG0F9IUSHAMQ6Y19XQR/pinkbike.jpg?format=300w'
          },
          {
            name: 'Short Sleeves Shirts',
            price: 29.0,
            thumbnail:
              'https://images.squarespace-cdn.com/content/v1/5ac82191697a9886599bcea6/1603483735024-ZQK5MVG5Q3DYSHDHUQA2/PinkBallerinagirl.jpg?format=300w'
          }
        ],
        vendor: VENDOR_CODES.BOGNARANDPICCOLINI,
        emailId: payload.id
      });
    });

    it('should return order data with quantity handled', async () => {
      const updatedPayload = Object.assign({}, payload);
      let updatedBody = updatedPayload.decodedBody;

      updatedBody = updatedBody.replace('Qty: 1', 'Qty: 2');

      updatedPayload.decodedBody = updatedBody;

      const orderData = await BognarAndPiccolini.parse(VENDOR_CODES.BOGNARANDPICCOLINI, updatedPayload);
      expect(orderData).to.be.deep.equal({
        orderRef: '590',
        orderDate: 1646870400000,
        products: [
          {
            name: 'Bike Shorts (1)',
            price: 29.0,
            thumbnail:
              'https://images.squarespace-cdn.com/content/v1/5ac82191697a9886599bcea6/1603484256199-RWG0F9IUSHAMQ6Y19XQR/pinkbike.jpg?format=300w'
          },
          {
            name: 'Bike Shorts (2)',
            price: 29.0,
            thumbnail:
              'https://images.squarespace-cdn.com/content/v1/5ac82191697a9886599bcea6/1603484256199-RWG0F9IUSHAMQ6Y19XQR/pinkbike.jpg?format=300w'
          },
          {
            name: 'Short Sleeves Shirts',
            price: 29.0,
            thumbnail:
              'https://images.squarespace-cdn.com/content/v1/5ac82191697a9886599bcea6/1603483735024-ZQK5MVG5Q3DYSHDHUQA2/PinkBallerinagirl.jpg?format=300w'
          }
        ],
        vendor: VENDOR_CODES.BOGNARANDPICCOLINI,
        emailId: payload.id
      });
    });

    it('should throw error if contains lacking data', () => {
      const updatedPayload = Object.assign({}, payload);
      updatedPayload.decodedBody = '<body>Invalid Body</body>';
      expect(BognarAndPiccolini.parse(VENDOR_CODES.BOGNARANDPICCOLINI, updatedPayload)).to.eventually.be.rejectedWith(
        Error
      );
    });
  });
});
