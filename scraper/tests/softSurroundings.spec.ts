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
import SoftSurroundings from '../src/lib/vendors/softSurroundings';

chai.use(chaiAsPromised);
moment.tz.setDefault('Etc/UTC');

const TEST_DATA_URL = 'https://noted-scrape-test.s3.us-west-2.amazonaws.com/SOFTSURROUNDINGS.json';

describe('Soft Surroundings', () => {
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
      const orderData = await SoftSurroundings.parse(VENDOR_CODES.SOFTSURROUNDINGS, payload);
      expect(orderData).to.be.deep.equal({
        orderRef: '215047718',
        orderDate: Number(payload.internalDate),
        products: [
          {
            name: 'BEAD AND WOOD STRETCH BELT',
            price: 49.95,
            thumbnail: 'https://images.softsurroundings.com/products/70x105/1CL5810.jpg'
          },
          {
            name: 'CHIC SNEAKERS',
            price: 84.0,
            thumbnail: 'https://images.softsurroundings.com/products/70x105/1BE4821.jpg'
          }
        ],
        vendor: VENDOR_CODES.SOFTSURROUNDINGS,
        emailId: payload.id
      });
    });

    it('should return order data with quantity handled', async () => {
      const updatedPayload = Object.assign({}, payload);
      let updatedBody = updatedPayload.decodedBody;

      updatedBody = updatedBody.replace(`line-height:20px;">1</td>`, `line-height:20px;">2</td>`);

      updatedPayload.decodedBody = updatedBody;

      const orderData = await SoftSurroundings.parse(VENDOR_CODES.SOFTSURROUNDINGS, updatedPayload);
      expect(orderData).to.be.deep.equal({
        orderRef: '215047718',
        orderDate: Number(payload.internalDate),
        products: [
          {
            name: 'BEAD AND WOOD STRETCH BELT (1)',
            price: 49.95,
            thumbnail: 'https://images.softsurroundings.com/products/70x105/1CL5810.jpg'
          },
          {
            name: 'BEAD AND WOOD STRETCH BELT (2)',
            price: 49.95,
            thumbnail: 'https://images.softsurroundings.com/products/70x105/1CL5810.jpg'
          },
          {
            name: 'CHIC SNEAKERS',
            price: 84.0,
            thumbnail: 'https://images.softsurroundings.com/products/70x105/1BE4821.jpg'
          }
        ],
        vendor: VENDOR_CODES.SOFTSURROUNDINGS,
        emailId: payload.id
      });
    });

    it('should throw error if contains lacking data', () => {
      const updatedPayload = Object.assign({}, payload);
      updatedPayload.decodedBody = '<body>Invalid Body</body>';
      expect(SoftSurroundings.parse(VENDOR_CODES.SOFTSURROUNDINGS, updatedPayload)).to.eventually.be.rejectedWith(
        Error
      );
    });
  });
});
