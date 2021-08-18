import * as chai from 'chai';
import * as sinon from 'sinon';
import * as chaiAsPromised from 'chai-as-promised';
import { expect } from 'chai';
import axios from 'axios';
import * as jsdom from 'jsdom';

import { IEmailPayload } from '../src/models';
import { VENDOR_CODES } from '../src/constants';
import * as helpers from '../src/lib/helpers';
import VictoriaSecret from '../src/lib/vendors/victoriaSecret';

chai.use(chaiAsPromised);

const TEST_DATA_URL = 'https://noted-scrape-test.s3-us-west-2.amazonaws.com/VICTORIASECRET.json';

describe('VICTORIA SECRET', () => {
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
      const orderData = await VictoriaSecret.parse(VENDOR_CODES.VICTORIASECRET, payload);
      expect(orderData).to.be.deep.equal({
        orderRef: 'W008082814',
        orderDate: 0,
        products: [
          { name: 'Everyday Lounge Classic Pant - 4JJ4 Camo Green', thumbnail: '', price: 33.48 },
          { name: 'Everyday Lounge Classic Pant - 3XZT Pure Black', thumbnail: '', price: 32.48 },
          { name: 'Everyday Lounge Classic Pant - 48IZ Blue Oar with Graphic', thumbnail: '', price: 31.47 },
          { name: 'Cotton High Waist Bike Short - 4BAL Ensign', thumbnail: '', price: 5 },
          { name: 'Everyday Lounge Classic Pant - 4BLA Heather Deep Snow', thumbnail: '', price: 32.47 }
        ],
        vendor: VENDOR_CODES.VICTORIASECRET,
        emailId: '16c3e93355d5960b'
      });
    });

    it('should return order data with quantity handled', async () => {
      const updatedPayload = Object.assign({}, payload);
      let updatedBody = updatedPayload.decodedBody;

      updatedBody = updatedBody.replace(
        `font-size:24px; color:#000000;">1</td>`,
        `font-size:24px; color:#000000;">2</td>`
      );

      updatedPayload.decodedBody = updatedBody;

      const orderData = await VictoriaSecret.parse(VENDOR_CODES.VICTORIASECRET, updatedPayload);
      expect(orderData).to.be.deep.equal({
        orderRef: 'W008082814',
        orderDate: 0,
        products: [
          { name: 'Everyday Lounge Classic Pant - 4JJ4 Camo Green (1)', thumbnail: '', price: 33.48 },
          { name: 'Everyday Lounge Classic Pant - 4JJ4 Camo Green (2)', thumbnail: '', price: 33.48 },
          { name: 'Everyday Lounge Classic Pant - 3XZT Pure Black', thumbnail: '', price: 32.48 },
          { name: 'Everyday Lounge Classic Pant - 48IZ Blue Oar with Graphic', thumbnail: '', price: 31.47 },
          { name: 'Cotton High Waist Bike Short - 4BAL Ensign', thumbnail: '', price: 5 },
          { name: 'Everyday Lounge Classic Pant - 4BLA Heather Deep Snow', thumbnail: '', price: 32.47 }
        ],
        vendor: VENDOR_CODES.VICTORIASECRET,
        emailId: '16c3e93355d5960b'
      });
    });

    it('should throw error if contains lacking data', () => {
      const updatedPayload = Object.assign({}, payload);
      updatedPayload.decodedBody = '<body>Invalid Body</body>';
      expect(VictoriaSecret.parse(VENDOR_CODES.VICTORIASECRET, updatedPayload)).to.eventually.be.rejectedWith(Error);
    });
  });
});
