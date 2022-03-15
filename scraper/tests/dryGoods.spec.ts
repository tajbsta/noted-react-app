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
import DryGoods from '../src/lib/vendors/dryGoods';

chai.use(chaiAsPromised);
moment.tz.setDefault('Etc/UTC');

const TEST_DATA_URL = 'https://noted-scrape-test.s3.us-west-2.amazonaws.com/DRYGOODS.json';

describe(`Dry Goods`, () => {
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
      const orderData = await DryGoods.parse(VENDOR_CODES.DRYGOODS, payload);
      expect(orderData).to.be.deep.equal({
        orderRef: '300448514',
        orderDate: 0,
        products: [
          {
            name: 'Jealous Tomato Seamed Front Flare Jean',
            price: 0,
            thumbnail: ''
          },
          {
            name: 'Moa Moa Halter Bodysuit  (Extended Sizes Available)',
            price: 0,
            thumbnail: ''
          }
        ],
        vendor: VENDOR_CODES.DRYGOODS,
        emailId: payload.id
      });
    });

    it('should return order data with quantity handled', async () => {
      const updatedPayload = Object.assign({}, payload);

      let updatedBody = updatedPayload.decodedBody;

      updatedBody = updatedBody.replace(
        `<td style="text-align: center; width: 75px; ">1</td></tr>`,
        `<td style="text-align: center; width: 75px; ">2</td></tr>`
      );

      updatedPayload.decodedBody = updatedBody;

      const orderData = await DryGoods.parse(VENDOR_CODES.DRYGOODS, updatedPayload);
      expect(orderData).to.be.deep.equal({
        orderRef: '300448514',
        orderDate: 0,
        products: [
          {
            name: 'Jealous Tomato Seamed Front Flare Jean (1)',
            price: 0,
            thumbnail: ''
          },
          {
            name: 'Jealous Tomato Seamed Front Flare Jean (2)',
            price: 0,
            thumbnail: ''
          },
          {
            name: 'Moa Moa Halter Bodysuit  (Extended Sizes Available)',
            price: 0,
            thumbnail: ''
          }
        ],
        vendor: VENDOR_CODES.DRYGOODS,
        emailId: payload.id
      });
    });

    it('should throw error if contains lacking data', () => {
      const updatedPayload = Object.assign({}, payload);
      updatedPayload.decodedBody = '<body>Invalid Body</body>';
      expect(DryGoods.parse(VENDOR_CODES.DRYGOODS, updatedPayload)).to.eventually.be.rejectedWith(Error);
    });
  });
});
