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
import TJMaxx from '../src/lib/vendors/tjMaxx';

chai.use(chaiAsPromised);
moment.tz.setDefault('Etc/UTC');

const TEST_DATA_URL = 'https://noted-scrape-test.s3-us-west-2.amazonaws.com/TJMAXX.json';

describe('TJMAXX', () => {
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
      const orderData = await TJMaxx.parse(VENDOR_CODES.TJMAXX, payload);
      expect(orderData).to.be.deep.equal({
        orderRef: '5062378302',
        orderDate: 1610668800000,
        products: [
          {
            name: 'LA BLANCA - Island Goddess Tummy Control One-piece Swimsuit',
            thumbnail:
              'http://img.tjmaxx.com/tjx?set=DisplayName[a6],prd[1000660178_NS1003516],ag[no]&call=url[file:tjxrPRD2.chain]',
            price: 29.99
          },
          {
            name: 'UNION BAY - Double Buckle Camo Sandals',
            thumbnail:
              'http://img.tjmaxx.com/tjx?set=DisplayName[a6],prd[1000650901_NS1931351],ag[no]&call=url[file:tjxrPRD2.chain]',
            price: 19.99
          },
          {
            name: 'ADRIANNA PAPELL - Scalloped Lace Sheath Dress',
            thumbnail:
              'http://img.tjmaxx.com/tjx?set=DisplayName[a6],prd[1000655235_NS1178688],ag[no]&call=url[file:tjxrPRD2.chain]',
            price: 29.99
          },
          {
            name: 'YOGALICIOUS - Heathered Front Cross Cropped Tank',
            thumbnail:
              'http://img.tjmaxx.com/tjx?set=DisplayName[a6],prd[1000620289_NS1204934],ag[no]&call=url[file:tjxrPRD2.chain]',
            price: 9.99
          }
        ],
        vendor: VENDOR_CODES.TJMAXX,
        emailId: '178d5accf15b6365'
      });
    });

    it('should return order data with quantity handled', async () => {
      const updatedPayload = Object.assign({}, payload);
      let updatedBody = updatedPayload.decodedBody;

      updatedBody = updatedBody.replace('\t\t\t\t\t\t\t\t\t\t1\r\n', '\t\t\t\t\t\t\t\t\t\t3\r\n');

      updatedPayload.decodedBody = updatedBody;

      const orderData = await TJMaxx.parse(VENDOR_CODES.TJMAXX, updatedPayload);
      expect(orderData).to.be.deep.equal({
        orderRef: '5062378302',
        orderDate: 1610668800000,
        products: [
          {
            name: 'LA BLANCA - Island Goddess Tummy Control One-piece Swimsuit (1)',
            thumbnail:
              'http://img.tjmaxx.com/tjx?set=DisplayName[a6],prd[1000660178_NS1003516],ag[no]&call=url[file:tjxrPRD2.chain]',
            price: 29.99
          },
          {
            name: 'LA BLANCA - Island Goddess Tummy Control One-piece Swimsuit (2)',
            thumbnail:
              'http://img.tjmaxx.com/tjx?set=DisplayName[a6],prd[1000660178_NS1003516],ag[no]&call=url[file:tjxrPRD2.chain]',
            price: 29.99
          },
          {
            name: 'LA BLANCA - Island Goddess Tummy Control One-piece Swimsuit (3)',
            thumbnail:
              'http://img.tjmaxx.com/tjx?set=DisplayName[a6],prd[1000660178_NS1003516],ag[no]&call=url[file:tjxrPRD2.chain]',
            price: 29.99
          },
          {
            name: 'UNION BAY - Double Buckle Camo Sandals',
            thumbnail:
              'http://img.tjmaxx.com/tjx?set=DisplayName[a6],prd[1000650901_NS1931351],ag[no]&call=url[file:tjxrPRD2.chain]',
            price: 19.99
          },
          {
            name: 'ADRIANNA PAPELL - Scalloped Lace Sheath Dress',
            thumbnail:
              'http://img.tjmaxx.com/tjx?set=DisplayName[a6],prd[1000655235_NS1178688],ag[no]&call=url[file:tjxrPRD2.chain]',
            price: 29.99
          },
          {
            name: 'YOGALICIOUS - Heathered Front Cross Cropped Tank',
            thumbnail:
              'http://img.tjmaxx.com/tjx?set=DisplayName[a6],prd[1000620289_NS1204934],ag[no]&call=url[file:tjxrPRD2.chain]',
            price: 9.99
          }
        ],
        vendor: VENDOR_CODES.TJMAXX,
        emailId: '178d5accf15b6365'
      });
    });

    it('should throw error if contains lacking data', () => {
      const updatedPayload = Object.assign({}, payload);
      updatedPayload.decodedBody = '<body>Invalid Body</body>';
      expect(TJMaxx.parse(VENDOR_CODES.TJMAXX, updatedPayload)).to.eventually.be.rejectedWith(Error);
    });
  });
});
