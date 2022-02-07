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
import KateSpade from '../src/lib/vendors/katespade';

chai.use(chaiAsPromised);
moment.tz.setDefault('Etc/UTC');

const TEST_DATA_URL = 'https://noted-scrape-test.s3.us-west-2.amazonaws.com/KATESPADE.json';

describe('Kate Spade', () => {
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
      const orderData = await KateSpade.parse(VENDOR_CODES.KATESPADE, payload);
      expect(orderData).to.be.deep.equal({
        orderRef: '20974058',
        orderDate: 1634860800000,
        products: [
          {
            name: 'small square studs',
            price: 38.0,
            thumbnail: 'http://s7d4.scene7.com/is/image/KateSpade/WBRU9356_986?$medium$'
          },
          {
            name: 'set in stone hinged bangle',
            price: 48.0,
            thumbnail: 'http://s7d4.scene7.com/is/image/KateSpade/WBRUB744_921?$medium$'
          }
        ],
        vendor: VENDOR_CODES.KATESPADE,
        emailId: payload.id
      });
    });

    it('should return order data with quantity handled', async () => {
      const updatedPayload = Object.assign({}, payload);
      let updatedBody = updatedPayload.decodedBody;

      updatedBody = updatedBody.replace(`\n1`, `\n2`);

      updatedPayload.decodedBody = updatedBody;

      const orderData = await KateSpade.parse(VENDOR_CODES.KATESPADE, updatedPayload);
      expect(orderData).to.be.deep.equal({
        orderRef: '20974058',
        orderDate: 1634860800000,
        products: [
          {
            name: 'small square studs (1)',
            price: 38.0,
            thumbnail: 'http://s7d4.scene7.com/is/image/KateSpade/WBRU9356_986?$medium$'
          },
          {
            name: 'small square studs (2)',
            price: 38.0,
            thumbnail: 'http://s7d4.scene7.com/is/image/KateSpade/WBRU9356_986?$medium$'
          },
          {
            name: 'set in stone hinged bangle',
            price: 48.0,
            thumbnail: 'http://s7d4.scene7.com/is/image/KateSpade/WBRUB744_921?$medium$'
          }
        ],
        vendor: VENDOR_CODES.KATESPADE,
        emailId: payload.id
      });
    });

    it('should throw error if contains lacking data', () => {
      const updatedPayload = Object.assign({}, payload);
      updatedPayload.decodedBody = '<body>Invalid Body</body>';
      expect(KateSpade.parse(VENDOR_CODES.KATESPADE, updatedPayload)).to.eventually.be.rejectedWith(Error);
    });
  });
});
