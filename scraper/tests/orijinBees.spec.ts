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
import OrijinBees from '../src/lib/vendors/orijinBees';

chai.use(chaiAsPromised);
moment.tz.setDefault('Etc/UTC');

const TEST_DATA_URL = 'https://noted-scrape-test.s3.us-west-2.amazonaws.com/ORIJINBEES.json';

describe(`Orijin Bees`, () => {
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
    payload.internalDate = res.data.internalDate;
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
      const updatedPayload = Object.assign({}, payload);

      let updatedBody = updatedPayload.decodedBody;

      updatedPayload.decodedBody = updatedBody;

      const orderData = await OrijinBees.parse(VENDOR_CODES.ORIJINBEES, updatedPayload);
      expect(orderData).to.be.deep.equal({
        orderRef: '17018',
        orderDate: Number(payload.internalDate),
        products: [
          {
            name: 'Positively Puffy Bee Baby Doll',
            price: 49.99,
            thumbnail:
              'https://cdn.shopify.com/s/files/1/0081/6368/8515/products/image_82c5937e-500e-4f24-baa4-3c2ea5d44dd6_compact_cropped.jpg?v=1633109290'
          }
        ],
        vendor: VENDOR_CODES.ORIJINBEES,
        emailId: payload.id
      });
    });

    it('should return order data with quantity handled', async () => {
      const updatedPayload = Object.assign({}, payload);

      let updatedBody = updatedPayload.decodedBody;

      updatedBody = updatedBody.replace('1</span><br/>', '2</span><br/>');

      updatedPayload.decodedBody = updatedBody;

      const orderData = await OrijinBees.parse(VENDOR_CODES.ORIJINBEES, updatedPayload);
      expect(orderData).to.be.deep.equal({
        orderRef: '17018',
        orderDate: Number(payload.internalDate),
        products: [
          {
            name: 'Positively Puffy Bee Baby Doll (1)',
            price: 49.99,
            thumbnail:
              'https://cdn.shopify.com/s/files/1/0081/6368/8515/products/image_82c5937e-500e-4f24-baa4-3c2ea5d44dd6_compact_cropped.jpg?v=1633109290'
          },
          {
            name: 'Positively Puffy Bee Baby Doll (2)',
            price: 49.99,
            thumbnail:
              'https://cdn.shopify.com/s/files/1/0081/6368/8515/products/image_82c5937e-500e-4f24-baa4-3c2ea5d44dd6_compact_cropped.jpg?v=1633109290'
          }
        ],
        vendor: VENDOR_CODES.ORIJINBEES,
        emailId: payload.id
      });
    });

    it('should throw error if contains lacking data', () => {
      const updatedPayload = Object.assign({}, payload);
      updatedPayload.decodedBody = '<body>Invalid Body</body>';
      expect(OrijinBees.parse(VENDOR_CODES.ORIJINBEES, updatedPayload)).to.eventually.be.rejectedWith(Error);
    });
  });
});
