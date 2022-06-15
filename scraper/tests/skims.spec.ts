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
import Skims from '../src/lib/vendors/skims';

chai.use(chaiAsPromised);
moment.tz.setDefault('Etc/UTC');

const TEST_DATA_URL = 'https://noted-scrape-test.s3.us-west-2.amazonaws.com/SKIMS.json';

describe(`Skims`, () => {
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
      const orderData = await Skims.parse(VENDOR_CODES.SKIMS, payload);
      expect(orderData).to.be.deep.equal({
        orderRef: 'SB3702478',
        orderDate: Number(payload.internalDate),
        products: [
          {
            name: 'OUTDOOR FLEECE ZIP UP | PACIFIC',
            price: 68.0,
            thumbnail:
              'https://cdn.shopify.com/s/files/1/0259/5448/4284/products/SKIMS-LOUNGEWEAR-AP-ZIP-0838-PAC-FL_compact_cropped.jpg?v=1641239585'
          },
          {
            name: 'OUTDOOR MID THIGH BODYSUIT | PACIFIC',
            price: 78.0,
            thumbnail:
              'https://cdn.shopify.com/s/files/1/0259/5448/4284/products/SKIMS-BODYSUIT-AP-BSS-0844-PAC-FL_compact_cropped.jpg?v=1641239706'
          }
        ],
        vendor: VENDOR_CODES.SKIMS,
        emailId: payload.id
      });
    });

    it('should return order data with quantity handled', async () => {
      const updatedPayload = Object.assign({}, payload);
      let updatedBody = updatedPayload.decodedBody;

      updatedBody = updatedBody.replace('1</span><br/>', '2</span><br/>');

      updatedPayload.decodedBody = updatedBody;

      const orderData = await Skims.parse(VENDOR_CODES.SKIMS, updatedPayload);
      expect(orderData).to.be.deep.equal({
        orderRef: 'SB3702478',
        orderDate: Number(payload.internalDate),
        products: [
          {
            name: 'OUTDOOR FLEECE ZIP UP | PACIFIC (1)',
            price: 68.0,
            thumbnail:
              'https://cdn.shopify.com/s/files/1/0259/5448/4284/products/SKIMS-LOUNGEWEAR-AP-ZIP-0838-PAC-FL_compact_cropped.jpg?v=1641239585'
          },
          {
            name: 'OUTDOOR FLEECE ZIP UP | PACIFIC (2)',
            price: 68.0,
            thumbnail:
              'https://cdn.shopify.com/s/files/1/0259/5448/4284/products/SKIMS-LOUNGEWEAR-AP-ZIP-0838-PAC-FL_compact_cropped.jpg?v=1641239585'
          },
          {
            name: 'OUTDOOR MID THIGH BODYSUIT | PACIFIC',
            price: 78.0,
            thumbnail:
              'https://cdn.shopify.com/s/files/1/0259/5448/4284/products/SKIMS-BODYSUIT-AP-BSS-0844-PAC-FL_compact_cropped.jpg?v=1641239706'
          }
        ],
        vendor: VENDOR_CODES.SKIMS,
        emailId: payload.id
      });
    });

    it('should throw error if contains lacking data', () => {
      const updatedPayload = Object.assign({}, payload);
      updatedPayload.decodedBody = '<body>Invalid Body</body>';
      expect(Skims.parse(VENDOR_CODES.SKIMS, updatedPayload)).to.eventually.be.rejectedWith(Error);
    });
  });
});
