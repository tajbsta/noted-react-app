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
import MichaelKors from '../src/lib/vendors/michaelKors';

chai.use(chaiAsPromised);
moment.tz.setDefault('Etc/UTC');

const TEST_DATA_URL = 'https://noted-scrape-test.s3.us-west-2.amazonaws.com/MICHAELKORS.json';

describe('Michael Kors', () => {
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
      const orderData = await MichaelKors.parse(VENDOR_CODES.MICHAELKORS, payload);
      expect(orderData).to.be.deep.equal({
        orderRef: 'wd62592559',
        orderDate: 1622592000000,
        products: [
          {
            name: 'Corey Leather Cutout Ankle Boot',
            price: 195,
            thumbnail: 'https://michaelkors.scene7.com/is/image/MichaelKors/40T1COMB5L-2171_IS?$pdpRelatedProducts$'
          },
          {
            name: 'Snake Georgette Mini Dress',
            price: 175,
            thumbnail: 'https://michaelkors.scene7.com/is/image/MichaelKors/MU1806Y2DR-0178_IS?$pdpRelatedProducts$'
          }
        ],
        vendor: VENDOR_CODES.MICHAELKORS,
        emailId: payload.id
      });
    });

    it('should return order data with quantity handled', async () => {
      const updatedPayload = Object.assign({}, payload);
      let updatedBody = updatedPayload.decodedBody;

      updatedBody = updatedBody.replace(
        `<span style="font-weight: bold;">1</span>`,
        `<span style="font-weight: bold;">2</span>`
      );

      updatedPayload.decodedBody = updatedBody;

      const orderData = await MichaelKors.parse(VENDOR_CODES.MICHAELKORS, updatedPayload);
      expect(orderData).to.be.deep.equal({
        orderRef: 'wd62592559',
        orderDate: 1622592000000,
        products: [
          {
            name: 'Corey Leather Cutout Ankle Boot (1)',
            price: 195,
            thumbnail: 'https://michaelkors.scene7.com/is/image/MichaelKors/40T1COMB5L-2171_IS?$pdpRelatedProducts$'
          },
          {
            name: 'Corey Leather Cutout Ankle Boot (2)',
            price: 195,
            thumbnail: 'https://michaelkors.scene7.com/is/image/MichaelKors/40T1COMB5L-2171_IS?$pdpRelatedProducts$'
          },
          {
            name: 'Snake Georgette Mini Dress',
            price: 175,
            thumbnail: 'https://michaelkors.scene7.com/is/image/MichaelKors/MU1806Y2DR-0178_IS?$pdpRelatedProducts$'
          }
        ],
        vendor: VENDOR_CODES.MICHAELKORS,
        emailId: payload.id
      });
    });

    it('should throw error if contains lacking data', () => {
      const updatedPayload = Object.assign({}, payload);
      updatedPayload.decodedBody = '<body>Invalid Body</body>';
      expect(MichaelKors.parse(VENDOR_CODES.MICHAELKORS, updatedPayload)).to.eventually.be.rejectedWith(Error);
    });
  });
});
