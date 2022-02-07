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
import DavidYurman from '../src/lib/vendors/davidYurman';

chai.use(chaiAsPromised);
moment.tz.setDefault('Etc/UTC');

const TEST_DATA_URL = 'https://noted-scrape-test.s3.us-west-2.amazonaws.com/DAVIDYURMAN.json';

describe('David Yurman', () => {
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
      const orderData = await DavidYurman.parse(VENDOR_CODES.DAVIDYURMAN, payload);
      expect(orderData).to.be.deep.equal({
        orderRef: 'Y8484984',
        orderDate: 1635120000000,
        products: [
          {
            name: 'Petite X Ring with 18K Yellow Gold',
            price: 275.0,
            thumbnail: 'https://img.davidyurman.com/is/image/DavidYurmanNew/R16895-S8?$email_product_thumb$'
          },
          {
            name: 'Cable Classic Collection® Money Clip',
            price: 295.0,
            thumbnail: 'https://img.davidyurman.com/is/image/DavidYurmanNew/M0Y218-SS?$email_product_thumb$'
          }
        ],
        vendor: VENDOR_CODES.DAVIDYURMAN,
        emailId: payload.id
      });
    });

    it('should return order data with quantity handled', async () => {
      const updatedPayload = Object.assign({}, payload);
      let updatedBody = updatedPayload.decodedBody;

      updatedBody = updatedBody.replace(`QTY:</span> 1`, `QTY:</span> 2`);

      updatedPayload.decodedBody = updatedBody;

      const orderData = await DavidYurman.parse(VENDOR_CODES.DAVIDYURMAN, updatedPayload);
      expect(orderData).to.be.deep.equal({
        orderRef: 'Y8484984',
        orderDate: 1635120000000,
        products: [
          {
            name: 'Petite X Ring with 18K Yellow Gold (1)',
            price: 275.0,
            thumbnail: 'https://img.davidyurman.com/is/image/DavidYurmanNew/R16895-S8?$email_product_thumb$'
          },
          {
            name: 'Petite X Ring with 18K Yellow Gold (2)',
            price: 275.0,
            thumbnail: 'https://img.davidyurman.com/is/image/DavidYurmanNew/R16895-S8?$email_product_thumb$'
          },
          {
            name: 'Cable Classic Collection® Money Clip',
            price: 295.0,
            thumbnail: 'https://img.davidyurman.com/is/image/DavidYurmanNew/M0Y218-SS?$email_product_thumb$'
          }
        ],
        vendor: VENDOR_CODES.DAVIDYURMAN,
        emailId: payload.id
      });
    });

    it('should throw error if contains lacking data', () => {
      const updatedPayload = Object.assign({}, payload);
      updatedPayload.decodedBody = '<body>Invalid Body</body>';
      expect(DavidYurman.parse(VENDOR_CODES.DAVIDYURMAN, updatedPayload)).to.eventually.be.rejectedWith(Error);
    });
  });
});
