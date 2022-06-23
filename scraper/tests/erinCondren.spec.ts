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
import ErinCondren from '../src/lib/vendors/erinCondren';

chai.use(chaiAsPromised);
moment.tz.setDefault('Etc/UTC');

const TEST_DATA_URL = 'https://noted-scrape-test.s3.us-west-2.amazonaws.com/ERINCONDREN.json';

describe(`Erin Condren`, () => {
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

      const orderData = await ErinCondren.parse(VENDOR_CODES.ERINCONDREN, updatedPayload);
      expect(orderData).to.be.deep.equal({
        orderRef: '6732914',
        orderDate: Number(payload.internalDate),
        products: [
          {
            name: 'Blush A5 Softbound Focused Weekly Planner™',
            price: 35.0,
            thumbnail: 'https://media.erincondren.com/catalog/Focused_Collection/Planner/A5/thumb/SBFP_A5_BSH_1.jpg'
          }
        ],
        vendor: VENDOR_CODES.ERINCONDREN,
        emailId: payload.id
      });
    });

    it('should return order data with quantity handled', async () => {
      const updatedPayload = Object.assign({}, payload);

      let updatedBody = updatedPayload.decodedBody;

      updatedBody = updatedBody.replace('<strong>1</strong>', '<strong>2</strong>');

      updatedPayload.decodedBody = updatedBody;

      const orderData = await ErinCondren.parse(VENDOR_CODES.ERINCONDREN, updatedPayload);
      expect(orderData).to.be.deep.equal({
        orderRef: '6732914',
        orderDate: Number(payload.internalDate),
        products: [
          {
            name: 'Blush A5 Softbound Focused Weekly Planner™ (1)',
            price: 35.0,
            thumbnail: 'https://media.erincondren.com/catalog/Focused_Collection/Planner/A5/thumb/SBFP_A5_BSH_1.jpg'
          },
          {
            name: 'Blush A5 Softbound Focused Weekly Planner™ (2)',
            price: 35.0,
            thumbnail: 'https://media.erincondren.com/catalog/Focused_Collection/Planner/A5/thumb/SBFP_A5_BSH_1.jpg'
          }
        ],
        vendor: VENDOR_CODES.ERINCONDREN,
        emailId: payload.id
      });
    });

    it('should throw error if contains lacking data', () => {
      const updatedPayload = Object.assign({}, payload);
      updatedPayload.decodedBody = '<body>Invalid Body</body>';
      expect(ErinCondren.parse(VENDOR_CODES.ERINCONDREN, updatedPayload)).to.eventually.be.rejectedWith(Error);
    });
  });
});
