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
import Abercrombie from '../src/lib/vendors/abercrombie';

chai.use(chaiAsPromised);
moment.tz.setDefault('Etc/UTC');

const TEST_DATA_URL = 'https://noted-scrape-test.s3-us-west-2.amazonaws.com/ABERCROMBIE.json';

describe('Abercrombie', () => {
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
      const orderData = await Abercrombie.parse(VENDOR_CODES.ABERCROMBIE, payload);
      expect(orderData).to.be.deep.equal({
        orderRef: '20418441083',
        orderDate: 1618358400000,
        products: [
          {
            name: 'Cutoff Hoodie',
            thumbnail: 'https://img.abercrombie.com/is/image/anf/KIC_152-1064-0984-178_prod1?policy=product-small',
            price: 33
          }
        ],
        vendor: VENDOR_CODES.ABERCROMBIE,
        emailId: '178d0c27340f5b20'
      });
    });

    it('should return order data with quantity handled', async () => {
      const updatedPayload = Object.assign({}, payload);
      let updatedBody = updatedPayload.decodedBody;

      const regexToSearchFor = new RegExp('Qty: 1', 'g');
      updatedBody = updatedBody.replace(regexToSearchFor, 'Qty: 2');

      updatedPayload.decodedBody = updatedBody;

      const orderData = await Abercrombie.parse(VENDOR_CODES.ABERCROMBIE, updatedPayload);
      expect(orderData).to.be.deep.equal({
        orderRef: '20418441083',
        orderDate: 1618358400000,
        products: [
          {
            name: 'Cutoff Hoodie (1)',
            thumbnail: 'https://img.abercrombie.com/is/image/anf/KIC_152-1064-0984-178_prod1?policy=product-small',
            price: 33
          },
          {
            name: 'Cutoff Hoodie (2)',
            thumbnail: 'https://img.abercrombie.com/is/image/anf/KIC_152-1064-0984-178_prod1?policy=product-small',
            price: 33
          }
        ],
        vendor: VENDOR_CODES.ABERCROMBIE,
        emailId: '178d0c27340f5b20'
      });
    });

    it('should throw error if contains lacking data', () => {
      const updatedPayload = Object.assign({}, payload);
      updatedPayload.decodedBody = '<body>Invalid Body</body>';
      expect(Abercrombie.parse(VENDOR_CODES.ABERCROMBIE, updatedPayload)).to.eventually.be.rejectedWith(Error);
    });
  });
});
