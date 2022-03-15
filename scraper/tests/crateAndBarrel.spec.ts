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
import CrateAndBarrel from '../src/lib/vendors/crateandbarrel';

chai.use(chaiAsPromised);
moment.tz.setDefault('Etc/UTC');

const TEST_DATA_URL = 'https://noted-scrape-test.s3.us-west-2.amazonaws.com/CRATEANDBARREL.json';

describe('Crate And Barrel', () => {
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
      const orderData = await CrateAndBarrel.parse(VENDOR_CODES.CRATEANDBARREL, payload);
      expect(orderData).to.be.deep.equal({
        orderRef: '336471472',
        orderDate: 1634515200000,
        products: [
          {
            name: 'CandleCoasterRoundLargeAVSHF16?$lg$',
            price: 4.97,
            thumbnail: 'https://images.crateandbarrel.com/is/image/Crate/CandleCoasterRoundLargeAVSHF16?$lg$'
          },
          {
            name: 'OliveWoodHoneyDipperSHF19?$lg$',
            price: 3.99,
            thumbnail: 'https://images.crateandbarrel.com/is/image/Crate/OliveWoodHoneyDipperSHF19?$lg$'
          }
        ],
        vendor: VENDOR_CODES.CRATEANDBARREL,
        emailId: payload.id
      });
    });

    it('should return order data with quantity handled', async () => {
      const updatedPayload = Object.assign({}, payload);
      let updatedBody = updatedPayload.decodedBody;

      updatedBody = updatedBody.replace('Quantity: 1', 'Quantity: 2');

      updatedPayload.decodedBody = updatedBody;

      const orderData = await CrateAndBarrel.parse(VENDOR_CODES.CRATEANDBARREL, updatedPayload);
      expect(orderData).to.be.deep.equal({
        orderRef: '336471472',
        orderDate: 1634515200000,
        products: [
          {
            name: 'CandleCoasterRoundLargeAVSHF16?$lg$ (1)',
            price: 4.97,
            thumbnail: 'https://images.crateandbarrel.com/is/image/Crate/CandleCoasterRoundLargeAVSHF16?$lg$'
          },
          {
            name: 'CandleCoasterRoundLargeAVSHF16?$lg$ (2)',
            price: 4.97,
            thumbnail: 'https://images.crateandbarrel.com/is/image/Crate/CandleCoasterRoundLargeAVSHF16?$lg$'
          },
          {
            name: 'OliveWoodHoneyDipperSHF19?$lg$',
            price: 3.99,
            thumbnail: 'https://images.crateandbarrel.com/is/image/Crate/OliveWoodHoneyDipperSHF19?$lg$'
          }
        ],
        vendor: VENDOR_CODES.CRATEANDBARREL,
        emailId: payload.id
      });
    });

    it('should throw error if contains lacking data', () => {
      const updatedPayload = Object.assign({}, payload);
      updatedPayload.decodedBody = '<body>Invalid Body</body>';
      expect(CrateAndBarrel.parse(VENDOR_CODES.CRATEANDBARREL, updatedPayload)).to.eventually.be.rejectedWith(Error);
    });
  });
});
