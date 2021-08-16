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
import Aerie from '../src/lib/vendors/aerie';

chai.use(chaiAsPromised);
moment.tz.setDefault('Etc/UTC');

const TEST_DATA_URL = 'https://noted-scrape-test.s3-us-west-2.amazonaws.com/AERIE.json';

describe('Aerie', () => {
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
      const orderData = await Aerie.parse(VENDOR_CODES.AERIE, payload);
      expect(orderData).to.be.deep.equal({
        orderRef: '889837',
        orderDate: 1570233600000,
        products: [
          { name: 'OVERSIZED SPRING S', price: 29.97, thumbnail: '' },
          { name: 'SOFTEST UTILITY OV', price: 35.97, thumbnail: '' },
          { name: 'SOFTEST UTILITY RO', price: 26.97, thumbnail: '' },
          { name: 'SOFTEST UTILITY RO', price: 26.97, thumbnail: '' }
        ],
        vendor: VENDOR_CODES.AERIE,
        emailId: '16d9e0dc8ea15d83'
      });
    });

    it('should return order data with quantity handled', async () => {
      const updatedPayload = Object.assign({}, payload);
      let updatedBody = updatedPayload.decodedBody;

      updatedBody = updatedBody.replace(/1 @/g, '2 @');

      updatedPayload.decodedBody = updatedBody;

      const orderData = await Aerie.parse(VENDOR_CODES.AERIE, updatedPayload);
      expect(orderData).to.be.deep.equal({
        orderRef: '889837',
        orderDate: 1570233600000,
        products: [
          { name: 'OVERSIZED SPRING S (1)', price: 29.97, thumbnail: '' },
          { name: 'OVERSIZED SPRING S (2)', price: 29.97, thumbnail: '' },
          { name: 'SOFTEST UTILITY OV (1)', price: 35.97, thumbnail: '' },
          { name: 'SOFTEST UTILITY OV (2)', price: 35.97, thumbnail: '' },
          { name: 'SOFTEST UTILITY RO (1)', price: 26.97, thumbnail: '' },
          { name: 'SOFTEST UTILITY RO (2)', price: 26.97, thumbnail: '' },
          { name: 'SOFTEST UTILITY RO (1)', price: 26.97, thumbnail: '' },
          { name: 'SOFTEST UTILITY RO (2)', price: 26.97, thumbnail: '' }
        ],
        vendor: VENDOR_CODES.AERIE,
        emailId: '16d9e0dc8ea15d83'
      });
    });

    it('should throw error if contains lacking data', () => {
      const updatedPayload = Object.assign({}, payload);
      updatedPayload.decodedBody = '<body>Invalid Body</body>';
      expect(Aerie.parse(VENDOR_CODES.AERIE, updatedPayload)).to.eventually.be.rejectedWith(Error);
    });
  });
});
