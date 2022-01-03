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
import Burberry from '../src/lib/vendors/burberry';

chai.use(chaiAsPromised);
moment.tz.setDefault('Etc/UTC');

const TEST_DATA_URL = 'https://noted-scrape-test.s3.us-west-2.amazonaws.com/BURBERRY.json';

describe(`Burberry`, () => {
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
      const orderData = await Burberry.parse(VENDOR_CODES.BURBERRY, payload);
      expect(orderData).to.be.deep.equal({
        orderRef: '20012864',
        orderDate: 0,
        products: [
          {
            name: 'Burberry Brit Sheer Eau de Toilette 30ml',
            price: 60,
            thumbnail:
              'https://assets.burberry.com/is/image/Burberryltd/AE256A42-7595-43AD-85DF-81830EB22B6A.jpg?$BBY_V2_SL_9X16$&wid=141&hei=250&wid=141&hei=250'
          },
          {
            name: 'Her London Dream Hair Mist 30ml',
            price: 47,
            thumbnail:
              'https://assets.burberry.com/is/image/Burberryltd/988B2260-8BBB-445D-A1A8-FBEDC0C2D3B1.jpg?$BBY_V2_B_9X16$&wid=141&hei=250&wid=141&hei=250'
          }
        ],
        vendor: VENDOR_CODES.BURBERRY,
        emailId: payload.id
      });
    });

    it('should return order data with quantity handled', async () => {
      const updatedPayload = Object.assign({}, payload);
      let updatedBody = updatedPayload.decodedBody;

      updatedBody = updatedBody.replace('class="quantity">1', 'class="quantity">2');

      updatedPayload.decodedBody = updatedBody;

      const orderData = await Burberry.parse(VENDOR_CODES.BURBERRY, updatedPayload);
      expect(orderData).to.be.deep.equal({
        orderRef: '20012864',
        orderDate: 0,
        products: [
          {
            name: 'Burberry Brit Sheer Eau de Toilette 30ml (1)',
            price: 60,
            thumbnail:
              'https://assets.burberry.com/is/image/Burberryltd/AE256A42-7595-43AD-85DF-81830EB22B6A.jpg?$BBY_V2_SL_9X16$&wid=141&hei=250&wid=141&hei=250'
          },
          {
            name: 'Burberry Brit Sheer Eau de Toilette 30ml (2)',
            price: 60,
            thumbnail:
              'https://assets.burberry.com/is/image/Burberryltd/AE256A42-7595-43AD-85DF-81830EB22B6A.jpg?$BBY_V2_SL_9X16$&wid=141&hei=250&wid=141&hei=250'
          },
          {
            name: 'Her London Dream Hair Mist 30ml',
            price: 47,
            thumbnail:
              'https://assets.burberry.com/is/image/Burberryltd/988B2260-8BBB-445D-A1A8-FBEDC0C2D3B1.jpg?$BBY_V2_B_9X16$&wid=141&hei=250&wid=141&hei=250'
          }
        ],
        vendor: VENDOR_CODES.BURBERRY,
        emailId: payload.id
      });
    });

    it('should throw error if contains lacking data', () => {
      const updatedPayload = Object.assign({}, payload);
      updatedPayload.decodedBody = '<body>Invalid Body</body>';
      expect(Burberry.parse(VENDOR_CODES.BURBERRY, updatedPayload)).to.eventually.be.rejectedWith(Error);
    });
  });
});
