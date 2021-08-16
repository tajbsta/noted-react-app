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
import FashionNova from '../src/lib/vendors/fashionNova';

chai.use(chaiAsPromised);
moment.tz.setDefault('Etc/UTC');

const TEST_DATA_URL = 'https://noted-scrape-test.s3-us-west-2.amazonaws.com/FASHIONNOVA.json';

describe('FashionNova', () => {
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
      const orderData = await FashionNova.parse(VENDOR_CODES.FASHIONNOVA, payload);
      expect(orderData).to.be.deep.equal({
        orderRef: '66945365',
        orderDate: 1610841600000,
        products: [
          {
            name: 'Dawson Short Sleeve Woven Top - Pink',
            price: 19.99,
            thumbnail:
              'https://cdn.shopify.com/s/files/1/0293/9277/products/11-30-20Studio4_SR_SD_10-32-18_59_VNF20_Pink_P_53677_NT_compact_cropped.jpg?v=1606784512'
          },
          {
            name: 'Dawson Short Sleeve Woven Top - Red',
            price: 19.99,
            thumbnail:
              'https://cdn.shopify.com/s/files/1/0293/9277/products/10-26-20Studio4_RT_DJ_13-28-32_12_VNF20_Red_53219_WG_compact_cropped.jpg?v=1603756521'
          },
          {
            name: 'Dawson Short Sleeve Woven Top - Black',
            price: 19.99,
            thumbnail:
              'https://cdn.shopify.com/s/files/1/0293/9277/products/10-26-20Studio4_RT_DJ_14-59-00_45_VNF20_Black_53151_NT_compact_cropped.jpg?v=1603838924'
          },
          {
            name: 'Shawn Short Sleeve Woven Top - White/Black',
            price: 19.99,
            thumbnail:
              'https://cdn.shopify.com/s/files/1/0293/9277/products/01-23-20_Studio_4_DM_ES_11-03-55_39__D2122DOT_White_P_1393_WG_compact_cropped.jpg?v=1579908576'
          },
          {
            name: 'Derrick Curved Hem Pocket Tee - White',
            price: 19.98,
            thumbnail:
              'https://cdn.shopify.com/s/files/1/0293/9277/products/06-03-20Studio1_RM_BJ_10-30-03_88_D11024_White_5422_RA_compact_cropped.jpg?v=1591228710'
          },
          {
            name: 'Faded Hoodie - Black',
            price: 42.99,
            thumbnail:
              'https://cdn.shopify.com/s/files/1/0293/9277/products/01-07-21Studio1_SN_TB_14-40-53_97_21101211_Black_3971_WG_compact_cropped.jpg?v=1610130796'
          },
          {
            name: 'FN Essential V Neck Tees 3 Pack - Black',
            price: 29.99,
            thumbnail:
              'https://cdn.shopify.com/s/files/1/0293/9277/products/11-30-20Studio4_SR_SD_10-11-43_52_NMKT304183PK_Black_53560_KL_compact_cropped.jpg?v=1606772014'
          },
          {
            name: 'Dawson Long Sleeve Woven Top - White',
            price: 19.99,
            thumbnail:
              'https://cdn.shopify.com/s/files/1/0293/9277/products/10-26-20Studio4_RT_DJ_13-11-31_3_VLFN30_White_16564_WG_compact_cropped.jpg?v=1603754335'
          },
          {
            name: 'Number One Short Sleeve Tee - Royal Blue',
            price: 12.99,
            thumbnail:
              'https://cdn.shopify.com/s/files/1/0293/9277/products/01-07-21Studio1_SN_TB_13-12-11_64_CKTS3576_Royal_4461_JK_compact_cropped.jpg?v=1610127442'
          }
        ],
        vendor: VENDOR_CODES.FASHIONNOVA,
        emailId: '1771301e0ec24633'
      });
    });

    it('should throw error if contains lacking data', () => {
      const updatedPayload = Object.assign({}, payload);
      updatedPayload.decodedBody = '<body>Invalid Body</body>';
      expect(FashionNova.parse(VENDOR_CODES.FASHIONNOVA, updatedPayload)).to.eventually.be.rejectedWith(Error);
    });
  });
});
