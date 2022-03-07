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
import TheContainerStore from '../src/lib/vendors/theContainerStore';

chai.use(chaiAsPromised);
moment.tz.setDefault('Etc/UTC');

const TEST_DATA_URL = 'https://noted-scrape-test.s3.us-west-2.amazonaws.com/THECONTAINERSTORE.json';

describe('The Container Store', () => {
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
      const orderData = await TheContainerStore.parse(VENDOR_CODES.THECONTAINERSTORE, payload);
      expect(orderData).to.be.deep.equal({
        orderRef: '899112508622',
        orderDate: 0,
        products: [
          {
            name: 'iDESIGN Fridge Bins Soda Can Organizer Clear',
            price: 14.99,
            thumbnail: ''
          },
          {
            name: 'iDESIGN Fridge Bins Wine Holder Clear',
            price: 9.99,
            thumbnail: ''
          }
        ],
        vendor: VENDOR_CODES.THECONTAINERSTORE,
        emailId: payload.id
      });
    });

    it('should return order data with quantity handled', async () => {
      const updatedPayload = Object.assign({}, payload);
      let updatedBody = updatedPayload.decodedBody;

      updatedBody = updatedBody.replace(`border-bottom">1</td>`, `border-bottom">2</td>`);

      updatedPayload.decodedBody = updatedBody;

      const orderData = await TheContainerStore.parse(VENDOR_CODES.THECONTAINERSTORE, updatedPayload);
      expect(orderData).to.be.deep.equal({
        orderRef: '899112508622',
        orderDate: 0,
        products: [
          {
            name: 'iDESIGN Fridge Bins Soda Can Organizer Clear (1)',
            price: 14.99,
            thumbnail: ''
          },
          {
            name: 'iDESIGN Fridge Bins Soda Can Organizer Clear (2)',
            price: 14.99,
            thumbnail: ''
          },
          {
            name: 'iDESIGN Fridge Bins Wine Holder Clear',
            price: 9.99,
            thumbnail: ''
          }
        ],
        vendor: VENDOR_CODES.THECONTAINERSTORE,
        emailId: payload.id
      });
    });

    it('should throw error if contains lacking data', () => {
      const updatedPayload = Object.assign({}, payload);
      updatedPayload.decodedBody = '<body>Invalid Body</body>';
      expect(TheContainerStore.parse(VENDOR_CODES.THECONTAINERSTORE, updatedPayload)).to.eventually.be.rejectedWith(
        Error
      );
    });
  });
});
