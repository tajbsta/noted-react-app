import * as chai from 'chai';
import * as sinon from 'sinon';
import * as chaiAsPromised from 'chai-as-promised';
import { expect } from 'chai';
import axios from 'axios';
import * as jsdom from 'jsdom';

import { IEmailPayload } from '../src/models';
import { VENDOR_CODES } from '../src/constants';
import * as helpers from '../src/lib/helpers';
import Adidas from '../src/lib/vendors/adidas';

chai.use(chaiAsPromised);

const TEST_DATA_URL = 'https://noted-scrape-test.s3-us-west-2.amazonaws.com/ADIDAS.json';

describe('Adidas', () => {
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
      const orderData = await Adidas.parse(VENDOR_CODES.ADIDAS, payload);
      expect(orderData).to.be.deep.equal({
        orderRef: 'AD056597079',
        orderDate: 0,
        products: [
          {
            name: 'Ultraboost Summer.RDY Shoes',
            thumbnail:
              'https://assets.adidas.com/images/w_142,h_142,f_auto,q_auto:sensitive/dabc43612c334f5cb1aeab3b012bec10_9366/EG0746_580_01_standard.jpg',
            price: 180
          }
        ],
        vendor: VENDOR_CODES.ADIDAS,
        emailId: '172d9f1e2694dab0'
      });
    });

    it('should return order data with quantity handled', async () => {
      const updatedPayload = Object.assign({}, payload);
      let updatedBody = updatedPayload.decodedBody;

      updatedBody = updatedBody.replace(`Quantity: 1`, `Quantity: 3`);

      updatedPayload.decodedBody = updatedBody;

      const orderData = await Adidas.parse(VENDOR_CODES.ADIDAS, updatedPayload);
      expect(orderData).to.be.deep.equal({
        orderRef: 'AD056597079',
        orderDate: 0,
        products: [
          {
            name: 'Ultraboost Summer.RDY Shoes (1)',
            thumbnail:
              'https://assets.adidas.com/images/w_142,h_142,f_auto,q_auto:sensitive/dabc43612c334f5cb1aeab3b012bec10_9366/EG0746_580_01_standard.jpg',
            price: 180
          },
          {
            name: 'Ultraboost Summer.RDY Shoes (2)',
            thumbnail:
              'https://assets.adidas.com/images/w_142,h_142,f_auto,q_auto:sensitive/dabc43612c334f5cb1aeab3b012bec10_9366/EG0746_580_01_standard.jpg',
            price: 180
          },
          {
            name: 'Ultraboost Summer.RDY Shoes (3)',
            thumbnail:
              'https://assets.adidas.com/images/w_142,h_142,f_auto,q_auto:sensitive/dabc43612c334f5cb1aeab3b012bec10_9366/EG0746_580_01_standard.jpg',
            price: 180
          }
        ],
        vendor: VENDOR_CODES.ADIDAS,
        emailId: '172d9f1e2694dab0'
      });
    });

    it('should throw error if contains lacking data', () => {
      const updatedPayload = Object.assign({}, payload);
      updatedPayload.decodedBody = '<body>Invalid Body</body>';
      expect(Adidas.parse(VENDOR_CODES.ADIDAS, updatedPayload)).to.eventually.be.rejectedWith(Error);
    });
  });
});
