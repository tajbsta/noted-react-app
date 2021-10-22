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
import Dillards from '../src/lib/vendors/dillards';

chai.use(chaiAsPromised);
moment.tz.setDefault('Etc/UTC');

const TEST_DATA_URL = 'https://noted-scrape-test.s3.us-west-2.amazonaws.com/DILLARDS.json';

describe('Dillards', () => {
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
      const orderData = await Dillards.parse(VENDOR_CODES.DILLARDS, payload);
      expect(orderData).to.be.deep.equal({
        orderRef: '627652703',
        orderDate: 0,
        products: [
          {
            name: 'Free People FP Movement The Way Home Shorts',
            price: 30,
            thumbnail:
              'http://dimg.dillards.com/is/image/DillardsZoom/00000000_zi_73420d4a-3c5d-4d84-b57a-304c9d30c613?$itemThumb$'
          }
        ],
        vendor: VENDOR_CODES.DILLARDS,
        emailId: payload.id
      });
    });

    it('should return order data with quantity handled', async () => {
      const updatedPayload = Object.assign({}, payload);
      let updatedBody = updatedPayload.decodedBody;

      updatedBody = updatedBody.replace(`1</p>`, `2</p>`);

      updatedPayload.decodedBody = updatedBody;

      const orderData = await Dillards.parse(VENDOR_CODES.DILLARDS, updatedPayload);
      expect(orderData).to.be.deep.equal({
        orderRef: '627652703',
        orderDate: 0,
        products: [
          {
            name: 'Free People FP Movement The Way Home Shorts (1)',
            price: 30,
            thumbnail:
              'http://dimg.dillards.com/is/image/DillardsZoom/00000000_zi_73420d4a-3c5d-4d84-b57a-304c9d30c613?$itemThumb$'
          },
          {
            name: 'Free People FP Movement The Way Home Shorts (2)',
            price: 30,
            thumbnail:
              'http://dimg.dillards.com/is/image/DillardsZoom/00000000_zi_73420d4a-3c5d-4d84-b57a-304c9d30c613?$itemThumb$'
          }
        ],
        vendor: VENDOR_CODES.DILLARDS,
        emailId: payload.id
      });
    });

    it('should throw error if contains lacking data', () => {
      const updatedPayload = Object.assign({}, payload);
      updatedPayload.decodedBody = '<body>Invalid Body</body>';
      expect(Dillards.parse(VENDOR_CODES.DILLARDS, updatedPayload)).to.eventually.be.rejectedWith(Error);
    });
  });
});
