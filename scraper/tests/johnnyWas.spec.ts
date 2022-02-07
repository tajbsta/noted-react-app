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
import JohnnyWas from '../src/lib/vendors/johnnyWas';

chai.use(chaiAsPromised);
moment.tz.setDefault('Etc/UTC');

const TEST_DATA_URL = 'https://noted-scrape-test.s3.us-west-2.amazonaws.com/JOHNNYWAS.json';

describe.only(`Johnny Was`, () => {
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
      const orderData = await JohnnyWas.parse(VENDOR_CODES.JOHNNYWAS, payload);
      expect(orderData).to.be.deep.equal({
        orderRef: '12052801',
        orderDate: 1634860800000,
        products: [
          {
            name: 'STONE AND PEARL MULTI STRAND BRACELET',
            price: 88.0,
            thumbnail:
              'https://www.johnnywas.com/media/catalog/product/cache/348e6be5e21a19dad99561e82abea322/n/a/nak0061_mti_1.jpg'
          },
          {
            name: 'AGATE TASSEL HOOP EARRING',
            price: 68.0,
            thumbnail:
              'https://www.johnnywas.com/media/catalog/product/cache/348e6be5e21a19dad99561e82abea322/n/a/nak0064_mti_1.jpg'
          }
        ],
        vendor: VENDOR_CODES.JOHNNYWAS,
        emailId: payload.id
      });
    });

    it('should return order data with quantity handled', async () => {
      const updatedPayload = Object.assign({}, payload);

      let updatedBody = updatedPayload.decodedBody;

      updatedBody = updatedBody.replace(`class="item-qty">1</td>`, `class="item-qty">2</td>`);

      updatedPayload.decodedBody = updatedBody;

      const orderData = await JohnnyWas.parse(VENDOR_CODES.JOHNNYWAS, updatedPayload);
      expect(orderData).to.be.deep.equal({
        orderRef: '12052801',
        orderDate: 1634860800000,
        products: [
          {
            name: 'STONE AND PEARL MULTI STRAND BRACELET (1)',
            price: 88.0,
            thumbnail:
              'https://www.johnnywas.com/media/catalog/product/cache/348e6be5e21a19dad99561e82abea322/n/a/nak0061_mti_1.jpg'
          },
          {
            name: 'STONE AND PEARL MULTI STRAND BRACELET (2)',
            price: 88.0,
            thumbnail:
              'https://www.johnnywas.com/media/catalog/product/cache/348e6be5e21a19dad99561e82abea322/n/a/nak0061_mti_1.jpg'
          },
          {
            name: 'AGATE TASSEL HOOP EARRING',
            price: 68.0,
            thumbnail:
              'https://www.johnnywas.com/media/catalog/product/cache/348e6be5e21a19dad99561e82abea322/n/a/nak0064_mti_1.jpg'
          }
        ],
        vendor: VENDOR_CODES.JOHNNYWAS,
        emailId: payload.id
      });
    });

    it('should throw error if contains lacking data', () => {
      const updatedPayload = Object.assign({}, payload);
      updatedPayload.decodedBody = '<body>Invalid Body</body>';
      expect(JohnnyWas.parse(VENDOR_CODES.JOHNNYWAS, updatedPayload)).to.eventually.be.rejectedWith(Error);
    });
  });
});
