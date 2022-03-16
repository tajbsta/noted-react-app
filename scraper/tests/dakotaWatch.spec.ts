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
import DakotaWatch from '../src/lib/vendors/dakotaWatch';

chai.use(chaiAsPromised);
moment.tz.setDefault('Etc/UTC');

const TEST_DATA_URL = 'https://noted-scrape-test.s3.us-west-2.amazonaws.com/DAKOTAWATCH.json';

describe(`Dakota Watch`, () => {
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
      const orderData = await DakotaWatch.parse(VENDOR_CODES.DAKOTAWATCH, payload);
      expect(orderData).to.be.deep.equal({
        orderRef: '1037',
        orderDate: Number(payload.internalDate),
        products: [
          {
            name: 'Day/Date Wood - Zebrawood/Ebonywood Case/Band Black Dial',
            price: 79.95,
            thumbnail:
              'https://cdn11.bigcommerce.com/s-1ewq4rhics/products/124/images/392/36392__91567.1603903665.220.290.jpg?c=1'
          },
          {
            name: 'Wellness Plus Smart Watch',
            price: 79.95,
            thumbnail:
              'https://cdn11.bigcommerce.com/s-1ewq4rhics/products/169/images/448/837995133d89c2bd3058a6eb0f628157607b1761__92754.1605839077.220.290.jpg?c=1'
          }
        ],
        vendor: VENDOR_CODES.DAKOTAWATCH,
        emailId: payload.id
      });
    });

    it('should return order data with quantity handled', async () => {
      const updatedPayload = Object.assign({}, payload);
      let updatedBody = updatedPayload.decodedBody;

      updatedBody = updatedBody.replace('Qty:', 'Qty:\n\t\t\t\t\t\t\t\t\t2');

      updatedPayload.decodedBody = updatedBody;

      const orderData = await DakotaWatch.parse(VENDOR_CODES.DAKOTAWATCH, updatedPayload);
      expect(orderData).to.be.deep.equal({
        orderRef: '1037',
        orderDate: Number(payload.internalDate),
        products: [
          {
            name: 'Day/Date Wood - Zebrawood/Ebonywood Case/Band Black Dial (1)',
            price: 79.95,
            thumbnail:
              'https://cdn11.bigcommerce.com/s-1ewq4rhics/products/124/images/392/36392__91567.1603903665.220.290.jpg?c=1'
          },
          {
            name: 'Day/Date Wood - Zebrawood/Ebonywood Case/Band Black Dial (2)',
            price: 79.95,
            thumbnail:
              'https://cdn11.bigcommerce.com/s-1ewq4rhics/products/124/images/392/36392__91567.1603903665.220.290.jpg?c=1'
          },
          {
            name: 'Wellness Plus Smart Watch',
            price: 79.95,
            thumbnail:
              'https://cdn11.bigcommerce.com/s-1ewq4rhics/products/169/images/448/837995133d89c2bd3058a6eb0f628157607b1761__92754.1605839077.220.290.jpg?c=1'
          }
        ],
        vendor: VENDOR_CODES.DAKOTAWATCH,
        emailId: payload.id
      });
    });

    it('should throw error if contains lacking data', () => {
      const updatedPayload = Object.assign({}, payload);
      updatedPayload.decodedBody = '<body>Invalid Body</body>';
      expect(DakotaWatch.parse(VENDOR_CODES.DAKOTAWATCH, updatedPayload)).to.eventually.be.rejectedWith(Error);
    });
  });
});
