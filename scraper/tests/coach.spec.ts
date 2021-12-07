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
import Coach from '../src/lib/vendors/coach';

chai.use(chaiAsPromised);
moment.tz.setDefault('Etc/UTC');

const TEST_DATA_URL = 'https://noted-scrape-test.s3.us-west-2.amazonaws.com/COACH.json';

describe.only(`Coach`, () => {
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
      const orderData = await Coach.parse(VENDOR_CODES.COACH, payload);
      expect(orderData).to.be.deep.equal({
        orderRef: 'CUP00191939',
        orderDate: 0,
        products: [
          {
            name: 'Hoop Earrings',
            price: 45.0,
            thumbnail: 'https://images.coach.com/is/image/Coach/c5730_gld_a0?$desktopProduct$'
          },
          {
            name: 'Eau De Toilette 30 Ml',
            price: 58.0,
            thumbnail: 'https://images.coach.com/is/image/Coach/b2006_l38_a0?$desktopProduct$'
          }
        ],
        vendor: VENDOR_CODES.COACH,
        emailId: payload.id
      });
    });

    it('should return order data with quantity handled', async () => {
      const updatedPayload = Object.assign({}, payload);
      let updatedBody = updatedPayload.decodedBody;

      updatedBody = updatedBody.replace(
        'class="product_section_productquantity" style="padding-top:4px; padding-bottom: 8px;"> QTY: 1</td>',
        'class="product_section_productquantity" style="padding-top:4px; padding-bottom: 8px;"> QTY: 2</td>'
      );

      updatedPayload.decodedBody = updatedBody;

      const orderData = await Coach.parse(VENDOR_CODES.COACH, updatedPayload);
      expect(orderData).to.be.deep.equal({
        orderRef: 'CUP00191939',
        orderDate: 0,
        products: [
          {
            name: 'Hoop Earrings (1)',
            price: 45.0,
            thumbnail: 'https://images.coach.com/is/image/Coach/c5730_gld_a0?$desktopProduct$'
          },
          {
            name: 'Hoop Earrings (2)',
            price: 45.0,
            thumbnail: 'https://images.coach.com/is/image/Coach/c5730_gld_a0?$desktopProduct$'
          },
          {
            name: 'Eau De Toilette 30 Ml',
            price: 58.0,
            thumbnail: 'https://images.coach.com/is/image/Coach/b2006_l38_a0?$desktopProduct$'
          }
        ],
        vendor: VENDOR_CODES.COACH,
        emailId: payload.id
      });
    });

    it('should throw error if contains lacking data', () => {
      const updatedPayload = Object.assign({}, payload);
      updatedPayload.decodedBody = '<body>Invalid Body</body>';
      expect(Coach.parse(VENDOR_CODES.COACH, updatedPayload)).to.eventually.be.rejectedWith(Error);
    });
  });
});
