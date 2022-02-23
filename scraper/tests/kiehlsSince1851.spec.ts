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
import KiehlsSince1851 from '../src/lib/vendors/kiehlsSince1851';

chai.use(chaiAsPromised);
moment.tz.setDefault('Etc/UTC');

const TEST_DATA_URL = 'https://noted-scrape-test.s3.us-west-2.amazonaws.com/KIEHLSSINCE1851.json';

describe(`Kiehls Since 1851`, () => {
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
      const orderData = await KiehlsSince1851.parse(VENDOR_CODES.KIEHLSSINCE1851, payload);
      expect(orderData).to.be.deep.equal({
        orderRef: 'KLS_13457825',
        orderDate: 1634860800000,
        products: [
          {
            name: 'ULT STRNGTH HAND SLV',
            price: 24.0,
            thumbnail:
              'https://www.kiehls.com/dw/image/v2/AANG_PRD/on/demandware.static/-/Sites-kiehls-master-catalog/default/dwfddb80a0/nextgen/body/hand-care/ultimate-strength-hand-salve/kiehls-hand-cream-ultimate-strength-hand-salve-150ml-000-3700194708399-front.png?sw=100&sh=100&sm=fit&q=70'
          },
          {
            name: 'CREATIVE CRM WAX',
            price: 18.0,
            thumbnail:
              'https://www.kiehls.com/dw/image/v2/AANG_PRD/on/demandware.static/-/Sites-kiehls-master-catalog/default/dw2bf3bd5d/nextgen/men/hair-and-beard/grooming-solutions/creative-cream-wax/kiehls-men-hair-grooming-solutions-creative-cream-wax-000-3700194716622-whip.png?sw=100&sh=100&sm=fit&q=70'
          }
        ],
        vendor: VENDOR_CODES.KIEHLSSINCE1851,
        emailId: payload.id
      });
    });

    it('should return order data with quantity handled', async () => {
      const updatedPayload = Object.assign({}, payload);

      let updatedBody = updatedPayload.decodedBody;

      updatedBody = updatedBody.replace(`Quantity: 1`, `Quantity: 2`);

      updatedPayload.decodedBody = updatedBody;

      const orderData = await KiehlsSince1851.parse(VENDOR_CODES.KIEHLSSINCE1851, updatedPayload);
      expect(orderData).to.be.deep.equal({
        orderRef: 'KLS_13457825',
        orderDate: 1634860800000,
        products: [
          {
            name: 'ULT STRNGTH HAND SLV (1)',
            price: 24.0,
            thumbnail:
              'https://www.kiehls.com/dw/image/v2/AANG_PRD/on/demandware.static/-/Sites-kiehls-master-catalog/default/dwfddb80a0/nextgen/body/hand-care/ultimate-strength-hand-salve/kiehls-hand-cream-ultimate-strength-hand-salve-150ml-000-3700194708399-front.png?sw=100&sh=100&sm=fit&q=70'
          },
          {
            name: 'ULT STRNGTH HAND SLV (2)',
            price: 24.0,
            thumbnail:
              'https://www.kiehls.com/dw/image/v2/AANG_PRD/on/demandware.static/-/Sites-kiehls-master-catalog/default/dwfddb80a0/nextgen/body/hand-care/ultimate-strength-hand-salve/kiehls-hand-cream-ultimate-strength-hand-salve-150ml-000-3700194708399-front.png?sw=100&sh=100&sm=fit&q=70'
          },
          {
            name: 'CREATIVE CRM WAX',
            price: 18.0,
            thumbnail:
              'https://www.kiehls.com/dw/image/v2/AANG_PRD/on/demandware.static/-/Sites-kiehls-master-catalog/default/dw2bf3bd5d/nextgen/men/hair-and-beard/grooming-solutions/creative-cream-wax/kiehls-men-hair-grooming-solutions-creative-cream-wax-000-3700194716622-whip.png?sw=100&sh=100&sm=fit&q=70'
          }
        ],
        vendor: VENDOR_CODES.KIEHLSSINCE1851,
        emailId: payload.id
      });
    });

    it('should throw error if contains lacking data', () => {
      const updatedPayload = Object.assign({}, payload);
      updatedPayload.decodedBody = '<body>Invalid Body</body>';
      expect(KiehlsSince1851.parse(VENDOR_CODES.KIEHLSSINCE1851, updatedPayload)).to.eventually.be.rejectedWith(Error);
    });
  });
});
