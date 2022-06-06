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
import PotteryBarn from '../src/lib/vendors/potteryBarn';

chai.use(chaiAsPromised);
moment.tz.setDefault('Etc/UTC');

const TEST_DATA_URL = 'https://noted-scrape-test.s3.us-west-2.amazonaws.com/POTTERYBARN.json';

describe.only(`Pottery Barn`, () => {
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

      updatedBody = updatedBody.replace(`QTY: 2`, `QTY: 1`);

      updatedPayload.decodedBody = updatedBody;

      const orderData = await PotteryBarn.parse(VENDOR_CODES.POTTERYBARN, updatedPayload);
      expect(orderData).to.be.deep.equal({
        orderRef: '321443951876',
        orderDate: Number(payload.internalDate),
        products: [
          {
            name: 'Recycled Microfiber Pintuck Comforter Standard Sham White',
            price: 65.0,
            thumbnail: 'https://www.pbteen.com/ptimgs/ab/images/dp/wcm/202141/0392/img72l.jpg'
          },
          {
            name: 'Recycled Microfiber Pintuck Comforter, Full/Queen, White',
            price: 129,
            thumbnail: 'https://www.pbteen.com/ptimgs/ab/images/dp/wcm/202143/0014/img19l.jpg'
          },
          {
            name: 'Cozy Huggable Recycled Sherpa Pillow, One Size, Powdered Blush',
            price: 47.99,
            thumbnail: 'https://www.pbteen.com/ptimgs/ab/images/dp/wcm/202141/0259/img61l.jpg'
          },
          {
            name: 'Sherpa Bean Bag Chair Cover + Insert, Large, Ivory/White',
            price: 179,
            thumbnail: 'https://www.pbteen.com/ptimgs/ab/images/dp/wcm/202141/0275/img42l.jpg'
          }
        ],
        vendor: VENDOR_CODES.POTTERYBARN,
        emailId: payload.id
      });
    });

    it('should return order data with quantity handled', async () => {
      const updatedPayload = Object.assign({}, payload);

      let updatedBody = updatedPayload.decodedBody;

      updatedPayload.decodedBody = updatedBody;

      const orderData = await PotteryBarn.parse(VENDOR_CODES.POTTERYBARN, updatedPayload);
      expect(orderData).to.be.deep.equal({
        orderRef: '321443951876',
        orderDate: Number(payload.internalDate),
        products: [
          {
            name: 'Recycled Microfiber Pintuck Comforter Standard Sham White (1)',
            price: 65.0,
            thumbnail: 'https://www.pbteen.com/ptimgs/ab/images/dp/wcm/202141/0392/img72l.jpg'
          },
          {
            name: 'Recycled Microfiber Pintuck Comforter Standard Sham White (2)',
            price: 65.0,
            thumbnail: 'https://www.pbteen.com/ptimgs/ab/images/dp/wcm/202141/0392/img72l.jpg'
          },
          {
            name: 'Recycled Microfiber Pintuck Comforter, Full/Queen, White',
            price: 129,
            thumbnail: 'https://www.pbteen.com/ptimgs/ab/images/dp/wcm/202143/0014/img19l.jpg'
          },
          {
            name: 'Cozy Huggable Recycled Sherpa Pillow, One Size, Powdered Blush',
            price: 47.99,
            thumbnail: 'https://www.pbteen.com/ptimgs/ab/images/dp/wcm/202141/0259/img61l.jpg'
          },
          {
            name: 'Sherpa Bean Bag Chair Cover + Insert, Large, Ivory/White',
            price: 179,
            thumbnail: 'https://www.pbteen.com/ptimgs/ab/images/dp/wcm/202141/0275/img42l.jpg'
          }
        ],
        vendor: VENDOR_CODES.POTTERYBARN,
        emailId: payload.id
      });
    });

    it('should throw error if contains lacking data', () => {
      const updatedPayload = Object.assign({}, payload);
      updatedPayload.decodedBody = '<body>Invalid Body</body>';
      expect(PotteryBarn.parse(VENDOR_CODES.POTTERYBARN, updatedPayload)).to.eventually.be.rejectedWith(Error);
    });
  });
});
