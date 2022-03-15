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
import EileenFisher from '../src/lib/vendors/eileenFisher';

chai.use(chaiAsPromised);
moment.tz.setDefault('Etc/UTC');

const TEST_DATA_URL = 'https://noted-scrape-test.s3.us-west-2.amazonaws.com/EILEENFISHER.json';

describe('Eileen Fisher', () => {
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
      const orderData = await EileenFisher.parse(VENDOR_CODES.EILEENFISHER, payload);
      expect(orderData).to.be.deep.equal({
        orderRef: '001199724574',
        orderDate: 1646870400000,
        products: [
          {
            name: 'Cozy Organic Cotton Interlock Lantern Pant',
            price: 88.0,
            thumbnail: 'https://s7ondemand5.scene7.com/is/image/EileenFisher/SLANF-B911M-030?$STANDARD_X_87$'
          },
          {
            name: 'Organic Cotton Low-Profile Sock 3-Pack',
            price: 18.0,
            thumbnail: 'https://s7ondemand5.scene7.com/is/image/EileenFisher/S2YRN-L0311M-001?$STANDARD_X_87$'
          }
        ],
        vendor: VENDOR_CODES.EILEENFISHER,
        emailId: payload.id
      });
    });

    it('should return order data with quantity handled', async () => {
      const updatedPayload = Object.assign({}, payload);
      let updatedBody = updatedPayload.decodedBody;

      updatedBody = updatedBody.replace(
        'border-top: 0; padding-top: 0;">1</td>',
        'border-top: 0; padding-top: 0;">2</td>'
      );

      updatedPayload.decodedBody = updatedBody;

      const orderData = await EileenFisher.parse(VENDOR_CODES.EILEENFISHER, updatedPayload);
      expect(orderData).to.be.deep.equal({
        orderRef: '001199724574',
        orderDate: 1646870400000,
        products: [
          {
            name: 'Cozy Organic Cotton Interlock Lantern Pant (1)',
            price: 88.0,
            thumbnail: 'https://s7ondemand5.scene7.com/is/image/EileenFisher/SLANF-B911M-030?$STANDARD_X_87$'
          },
          {
            name: 'Cozy Organic Cotton Interlock Lantern Pant (2)',
            price: 88.0,
            thumbnail: 'https://s7ondemand5.scene7.com/is/image/EileenFisher/SLANF-B911M-030?$STANDARD_X_87$'
          },
          {
            name: 'Organic Cotton Low-Profile Sock 3-Pack',
            price: 18.0,
            thumbnail: 'https://s7ondemand5.scene7.com/is/image/EileenFisher/S2YRN-L0311M-001?$STANDARD_X_87$'
          }
        ],
        vendor: VENDOR_CODES.EILEENFISHER,
        emailId: payload.id
      });
    });

    it('should throw error if contains lacking data', () => {
      const updatedPayload = Object.assign({}, payload);
      updatedPayload.decodedBody = '<body>Invalid Body</body>';
      expect(EileenFisher.parse(VENDOR_CODES.EILEENFISHER, updatedPayload)).to.eventually.be.rejectedWith(Error);
    });
  });
});
