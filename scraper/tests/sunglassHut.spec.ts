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
import SunglassHut from '../src/lib/vendors/sunglassHut';

chai.use(chaiAsPromised);
moment.tz.setDefault('Etc/UTC');

const TEST_DATA_URL = 'https://noted-scrape-test.s3.us-west-2.amazonaws.com/SUNGLASSHUT.json';

describe('Sunglass Hut', () => {
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
      const orderData = await SunglassHut.parse(VENDOR_CODES.SUNGLASSHUT, payload);
      expect(orderData).to.be.deep.equal({
        orderRef: '29069354',
        orderDate: 1634601600000,
        products: [
          {
            name: 'RAY-BAN / RB2195 THALIA / Standard',
            price: 161.0,
            thumbnail:
              'https://assets.sunglasshut.com/is/image/LuxotticaRetail/8056597364065__001.png?SGH_bgtransparent&width=180'
          },
          {
            name: 'MICHAEL KORS / MK5004 CHELSEA / Standard',
            price: 99.0,
            thumbnail:
              'https://assets.sunglasshut.com/is/image/LuxotticaRetail/725125941938__001.png?SGH_bgtransparent&width=180'
          }
        ],
        vendor: VENDOR_CODES.SUNGLASSHUT,
        emailId: payload.id
      });
    });

    it('should return order data with quantity handled', async () => {
      const updatedPayload = Object.assign({}, payload);
      let updatedBody = updatedPayload.decodedBody;

      updatedBody = updatedBody.replace(`color: #555555;">1</span>`, `color: #555555;">2</span>`);

      updatedPayload.decodedBody = updatedBody;

      const orderData = await SunglassHut.parse(VENDOR_CODES.SUNGLASSHUT, updatedPayload);
      expect(orderData).to.be.deep.equal({
        orderRef: '29069354',
        orderDate: 1634601600000,
        products: [
          {
            name: 'RAY-BAN / RB2195 THALIA / Standard (1)',
            price: 161.0,
            thumbnail:
              'https://assets.sunglasshut.com/is/image/LuxotticaRetail/8056597364065__001.png?SGH_bgtransparent&width=180'
          },
          {
            name: 'RAY-BAN / RB2195 THALIA / Standard (2)',
            price: 161.0,
            thumbnail:
              'https://assets.sunglasshut.com/is/image/LuxotticaRetail/8056597364065__001.png?SGH_bgtransparent&width=180'
          },
          {
            name: 'MICHAEL KORS / MK5004 CHELSEA / Standard',
            price: 99.0,
            thumbnail:
              'https://assets.sunglasshut.com/is/image/LuxotticaRetail/725125941938__001.png?SGH_bgtransparent&width=180'
          }
        ],
        vendor: VENDOR_CODES.SUNGLASSHUT,
        emailId: payload.id
      });
    });

    it('should throw error if contains lacking data', () => {
      const updatedPayload = Object.assign({}, payload);
      updatedPayload.decodedBody = '<body>Invalid Body</body>';
      expect(SunglassHut.parse(VENDOR_CODES.SUNGLASSHUT, updatedPayload)).to.eventually.be.rejectedWith(Error);
    });
  });
});
