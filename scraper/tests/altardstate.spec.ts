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
import AltardState from '../src/lib/vendors/altardstate';

chai.use(chaiAsPromised);
moment.tz.setDefault('Etc/UTC');

const TEST_DATA_URL = 'https://noted-scrape-test.s3.us-west-2.amazonaws.com/ALTARDSTATE.json';

describe(`Altar'd State`, () => {
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
      const orderData = await AltardState.parse(VENDOR_CODES.ALTARDSTATE, payload);
      expect(orderData).to.be.deep.equal({
        orderRef: '500980355',
        orderDate: 1634515200000,
        products: [
          {
            name: 'Praying Hands Sticker',
            price: 1.99,
            thumbnail:
              'https://www.altardstate.com/dw/image/v2/BDDX_PRD/on/demandware.static/-/Sites-as_catalog/default/dwca764051/image/002040_BM-0001-2611_GREEN_01.JPG?sw=197&sh=266'
          }
        ],
        vendor: VENDOR_CODES.ALTARDSTATE,
        emailId: payload.id
      });
    });

    it('should return order data with quantity handled', async () => {
      const updatedPayload = Object.assign({}, payload);
      let updatedBody = updatedPayload.decodedBody;

      updatedBody = updatedBody.replace(`Quantity : 1`, `Quantity : 2`);

      updatedPayload.decodedBody = updatedBody;

      const orderData = await AltardState.parse(VENDOR_CODES.ALTARDSTATE, updatedPayload);
      expect(orderData).to.be.deep.equal({
        orderRef: '500980355',
        orderDate: 1634515200000,
        products: [
          {
            name: 'Praying Hands Sticker (1)',
            price: 1.99,
            thumbnail:
              'https://www.altardstate.com/dw/image/v2/BDDX_PRD/on/demandware.static/-/Sites-as_catalog/default/dwca764051/image/002040_BM-0001-2611_GREEN_01.JPG?sw=197&sh=266'
          },
          {
            name: 'Praying Hands Sticker (2)',
            price: 1.99,
            thumbnail:
              'https://www.altardstate.com/dw/image/v2/BDDX_PRD/on/demandware.static/-/Sites-as_catalog/default/dwca764051/image/002040_BM-0001-2611_GREEN_01.JPG?sw=197&sh=266'
          }
        ],
        vendor: VENDOR_CODES.ALTARDSTATE,
        emailId: payload.id
      });
    });

    it('should throw error if contains lacking data', () => {
      const updatedPayload = Object.assign({}, payload);
      updatedPayload.decodedBody = '<body>Invalid Body</body>';
      expect(AltardState.parse(VENDOR_CODES.ALTARDSTATE, updatedPayload)).to.eventually.be.rejectedWith(Error);
    });
  });
});
