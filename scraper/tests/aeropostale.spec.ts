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
import Aeropostale from '../src/lib/vendors/aeropostale';

chai.use(chaiAsPromised);
moment.tz.setDefault('Etc/UTC');

const TEST_DATA_URL = 'https://noted-scrape-test.s3.us-west-2.amazonaws.com/AEROPOSTALE.json';

describe(`Aeropostale`, () => {
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
      const orderData = await Aeropostale.parse(VENDOR_CODES.AEROPOSTALE, payload);
      expect(orderData).to.be.deep.equal({
        orderRef: '23353436',
        orderDate: Number(payload.internalDate),
        products: [
          {
            name: 'Vertical Aero Floral Cinched Sweatpants, TEAL 163, SMALL',
            price: 18.0,
            thumbnail:
              'http://image.em.aeropostale.com/lib/fe3111717064057d7c1c71/m/1/d954f92f-d670-40a2-b103-48f595f7a2dd.gif'
          },
          {
            name: 'Aero 1987 Floral Pullover Hoodie, TEAL 163, SMALL',
            price: 20.0,
            thumbnail:
              'http://image.em.aeropostale.com/lib/fe3111717064057d7c1c71/m/1/d954f92f-d670-40a2-b103-48f595f7a2dd.gif'
          }
        ],
        vendor: VENDOR_CODES.AEROPOSTALE,
        emailId: payload.id
      });
    });

    it('should return order data with quantity handled', async () => {
      const updatedPayload = Object.assign({}, payload);
      let updatedBody = updatedPayload.decodedBody;

      updatedBody = updatedBody.replace('Quantity: 1', 'Quantity: 2');

      updatedPayload.decodedBody = updatedBody;

      const orderData = await Aeropostale.parse(VENDOR_CODES.AEROPOSTALE, updatedPayload);
      expect(orderData).to.be.deep.equal({
        orderRef: '23353436',
        orderDate: Number(payload.internalDate),
        products: [
          {
            name: 'Vertical Aero Floral Cinched Sweatpants, TEAL 163, SMALL (1)',
            price: 18.0,
            thumbnail:
              'http://image.em.aeropostale.com/lib/fe3111717064057d7c1c71/m/1/d954f92f-d670-40a2-b103-48f595f7a2dd.gif'
          },
          {
            name: 'Vertical Aero Floral Cinched Sweatpants, TEAL 163, SMALL (2)',
            price: 18.0,
            thumbnail:
              'http://image.em.aeropostale.com/lib/fe3111717064057d7c1c71/m/1/d954f92f-d670-40a2-b103-48f595f7a2dd.gif'
          },
          {
            name: 'Aero 1987 Floral Pullover Hoodie, TEAL 163, SMALL',
            price: 20.0,
            thumbnail:
              'http://image.em.aeropostale.com/lib/fe3111717064057d7c1c71/m/1/d954f92f-d670-40a2-b103-48f595f7a2dd.gif'
          }
        ],
        vendor: VENDOR_CODES.AEROPOSTALE,
        emailId: payload.id
      });
    });

    it('should throw error if contains lacking data', () => {
      const updatedPayload = Object.assign({}, payload);
      updatedPayload.decodedBody = '<body>Invalid Body</body>';
      expect(Aeropostale.parse(VENDOR_CODES.AEROPOSTALE, updatedPayload)).to.eventually.be.rejectedWith(Error);
    });
  });
});
