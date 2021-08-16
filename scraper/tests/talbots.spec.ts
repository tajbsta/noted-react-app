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
import Talbots from '../src/lib/vendors/talbots';

chai.use(chaiAsPromised);
moment.tz.setDefault('Etc/UTC');

const TEST_DATA_URL = 'https://noted-scrape-test.s3-us-west-2.amazonaws.com/TALBOTS.json';

describe('TALBOTS', () => {
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
      const orderData = await Talbots.parse(VENDOR_CODES.TALBOTS, payload);
      expect(orderData).to.be.deep.equal({
        orderRef: '210528IE20380',
        orderDate: 1622160000000,
        products: [
          {
            name: 'Three Strand Bracelet',
            thumbnail:
              'https://www.talbots.com/dw/image/v2/BCMM_PRD/on/demandware.static/-/Sites-master-catalog-talbots/default/dw4374114a/images/202065285/202065285_2048.jpg?sw=97&sh=127&sm=fit&sfrm=jpg',
            price: 27.65
          },
          {
            name: 'Basket Hoop Earrings',
            thumbnail:
              'https://www.talbots.com/dw/image/v2/BCMM_PRD/on/demandware.static/-/Sites-master-catalog-talbots/default/dw05be4794/images/212065053/212065053_2048.jpg?sw=97&sh=127&sm=fit&sfrm=jpg',
            price: 20.65
          }
        ],
        vendor: VENDOR_CODES.TALBOTS,
        emailId: '179b4b2ebb7879f3'
      });
    });

    it('should return order data with quantity handled', async () => {
      const updatedPayload = Object.assign({}, payload);
      let updatedBody = updatedPayload.decodedBody;

      updatedBody = updatedBody.replace(
        `!important; line-height: 16px;">1</span>`,
        `!important; line-height: 16px;">2</span>`
      );

      updatedPayload.decodedBody = updatedBody;

      const orderData = await Talbots.parse(VENDOR_CODES.TALBOTS, updatedPayload);
      expect(orderData).to.be.deep.equal({
        orderRef: '210528IE20380',
        orderDate: 1622160000000,
        products: [
          {
            name: 'Three Strand Bracelet (1)',
            thumbnail:
              'https://www.talbots.com/dw/image/v2/BCMM_PRD/on/demandware.static/-/Sites-master-catalog-talbots/default/dw4374114a/images/202065285/202065285_2048.jpg?sw=97&sh=127&sm=fit&sfrm=jpg',
            price: 27.65
          },
          {
            name: 'Three Strand Bracelet (2)',
            thumbnail:
              'https://www.talbots.com/dw/image/v2/BCMM_PRD/on/demandware.static/-/Sites-master-catalog-talbots/default/dw4374114a/images/202065285/202065285_2048.jpg?sw=97&sh=127&sm=fit&sfrm=jpg',
            price: 27.65
          },
          {
            name: 'Basket Hoop Earrings',
            thumbnail:
              'https://www.talbots.com/dw/image/v2/BCMM_PRD/on/demandware.static/-/Sites-master-catalog-talbots/default/dw05be4794/images/212065053/212065053_2048.jpg?sw=97&sh=127&sm=fit&sfrm=jpg',
            price: 20.65
          }
        ],
        vendor: VENDOR_CODES.TALBOTS,
        emailId: '179b4b2ebb7879f3'
      });
    });

    it('should throw error if contains lacking data', () => {
      const updatedPayload = Object.assign({}, payload);
      updatedPayload.decodedBody = '<body>Invalid Body</body>';
      expect(Talbots.parse(VENDOR_CODES.TALBOTS, updatedPayload)).to.eventually.be.rejectedWith(Error);
    });
  });
});
