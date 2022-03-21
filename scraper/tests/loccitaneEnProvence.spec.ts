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
import LoccitaneEnProvence from '../src/lib/vendors/loccitaneEnProvence';

chai.use(chaiAsPromised);
moment.tz.setDefault('Etc/UTC');

const TEST_DATA_URL = 'https://noted-scrape-test.s3.us-west-2.amazonaws.com/LOCCITANEENPROVENCE.json';

describe(`L'Occitane En Provence`, () => {
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
      const orderData = await LoccitaneEnProvence.parse(VENDOR_CODES.LOCCITANEENPROVENCE, payload);
      expect(orderData).to.be.deep.equal({
        orderRef: 'EC003163966',
        orderDate: Number(payload.internalDate),
        products: [
          {
            name: 'Immortelle Overnight Reset Oil-in-Serum',
            price: 65.0,
            thumbnail:
              'https://transform.disstg.commercecloud.salesforce.com/transform/BDQL_STG/on/demandware.static/-/Sites-occ_master/default/dwfcac4d5f/large/27OR030I21.png?sw=120&sh=120'
          },
          {
            name: 'Organic-Certified* Pure Shea Butter',
            price: 40.0,
            thumbnail:
              'https://transform.disstg.commercecloud.salesforce.com/transform/BDQL_STG/on/demandware.static/-/Sites-occ_master/default/dwfcac4d5f/large/01BK150K0.png?sw=120&sh=120'
          },
          {
            name: 'Smoothing Body Care Routine',
            price: 0.0,
            thumbnail:
              'https://transform.disstg.commercecloud.salesforce.com/transform/BDQL_STG/on/demandware.static/-/Sites-occ_master/default/dwfcac4d5f/large/NAOCVE4000023.png?sw=120&sh=120'
          }
        ],
        vendor: VENDOR_CODES.LOCCITANEENPROVENCE,
        emailId: payload.id
      });
    });

    it('should return order data with quantity handled', async () => {
      const updatedPayload = Object.assign({}, payload);
      let updatedBody = updatedPayload.decodedBody;

      updatedBody = updatedBody.replace(
        "<td style='text-align:center; font-family: arial; font-size:10px;'>1</td>",
        "<td style='text-align:center; font-family: arial; font-size:10px;'>2</td>"
      );

      updatedPayload.decodedBody = updatedBody;

      const orderData = await LoccitaneEnProvence.parse(VENDOR_CODES.LOCCITANEENPROVENCE, updatedPayload);
      expect(orderData).to.be.deep.equal({
        orderRef: 'EC003163966',
        orderDate: Number(payload.internalDate),
        products: [
          {
            name: 'Immortelle Overnight Reset Oil-in-Serum (1)',
            price: 65.0,
            thumbnail:
              'https://transform.disstg.commercecloud.salesforce.com/transform/BDQL_STG/on/demandware.static/-/Sites-occ_master/default/dwfcac4d5f/large/27OR030I21.png?sw=120&sh=120'
          },
          {
            name: 'Immortelle Overnight Reset Oil-in-Serum (2)',
            price: 65.0,
            thumbnail:
              'https://transform.disstg.commercecloud.salesforce.com/transform/BDQL_STG/on/demandware.static/-/Sites-occ_master/default/dwfcac4d5f/large/27OR030I21.png?sw=120&sh=120'
          },
          {
            name: 'Organic-Certified* Pure Shea Butter',
            price: 40.0,
            thumbnail:
              'https://transform.disstg.commercecloud.salesforce.com/transform/BDQL_STG/on/demandware.static/-/Sites-occ_master/default/dwfcac4d5f/large/01BK150K0.png?sw=120&sh=120'
          },
          {
            name: 'Smoothing Body Care Routine',
            price: 0.0,
            thumbnail:
              'https://transform.disstg.commercecloud.salesforce.com/transform/BDQL_STG/on/demandware.static/-/Sites-occ_master/default/dwfcac4d5f/large/NAOCVE4000023.png?sw=120&sh=120'
          }
        ],
        vendor: VENDOR_CODES.LOCCITANEENPROVENCE,
        emailId: payload.id
      });
    });

    it('should throw error if contains lacking data', () => {
      const updatedPayload = Object.assign({}, payload);
      updatedPayload.decodedBody = '<body>Invalid Body</body>';
      expect(LoccitaneEnProvence.parse(VENDOR_CODES.LOCCITANEENPROVENCE, updatedPayload)).to.eventually.be.rejectedWith(
        Error
      );
    });
  });
});
