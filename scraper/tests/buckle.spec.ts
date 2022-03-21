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
import Buckle from '../src/lib/vendors/buckle';

chai.use(chaiAsPromised);
moment.tz.setDefault('Etc/UTC');

const TEST_DATA_URL = 'https://noted-scrape-test.s3.us-west-2.amazonaws.com/BUCKLE.json';

describe(`Buckle`, () => {
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
      const orderData = await Buckle.parse(VENDOR_CODES.BUCKLE, payload);
      expect(orderData).to.be.deep.equal({
        orderRef: '207640995',
        orderDate: 1639008000000,
        products: [
          {
            name: 'NIA Cropped Sweater Knit Tank Top',
            price: 17.51,
            thumbnail:
              'https://pimg.bucklecontent.com/images/products/88697NS388/DVE/f/d383d6984d9b5a9762aac04ef1402fdev3?cropW=1424&cropH=1671'
          }
        ],
        vendor: VENDOR_CODES.BUCKLE,
        emailId: payload.id
      });
    });

    it('should return order data with quantity handled', async () => {
      const updatedPayload = Object.assign({}, payload);
      let updatedBody = updatedPayload.decodedBody;

      //   no qty
      //   updatedBody = updatedBody.replace('Qty 1', 'Qty 2');

      updatedPayload.decodedBody = updatedBody;

      const orderData = await Buckle.parse(VENDOR_CODES.BUCKLE, updatedPayload);
      expect(orderData).to.be.deep.equal({
        orderRef: '207640995',
        orderDate: 1639008000000,
        products: [
          {
            name: 'NIA Cropped Sweater Knit Tank Top',
            price: 17.51,
            thumbnail:
              'https://pimg.bucklecontent.com/images/products/88697NS388/DVE/f/d383d6984d9b5a9762aac04ef1402fdev3?cropW=1424&cropH=1671'
          }
        ],
        vendor: VENDOR_CODES.BUCKLE,
        emailId: payload.id
      });
    });

    it('should throw error if contains lacking data', () => {
      const updatedPayload = Object.assign({}, payload);
      updatedPayload.decodedBody = '<body>Invalid Body</body>';
      expect(Buckle.parse(VENDOR_CODES.BUCKLE, updatedPayload)).to.eventually.be.rejectedWith(Error);
    });
  });
});
