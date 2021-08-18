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
import JCPENNEY from '../src/lib/vendors/jcPenney';

chai.use(chaiAsPromised);
moment.tz.setDefault('Etc/UTC');

const TEST_DATA_URL = 'https://noted-scrape-test.s3-us-west-2.amazonaws.com/JCPENNEY.json';

describe('JCPENNEY', () => {
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
      const orderData = await JCPENNEY.parse(VENDOR_CODES.JCPENNEY, payload);
      expect(orderData).to.be.deep.equal({
        orderRef: '2021-1104-1026-7750',
        orderDate: 1618876800000,
        products: [
          {
            name: 'Nike Womens Round Neck Short Sleeve TShirt Plus',
            price: 25,
            thumbnail:
              'https://s7d9.scene7.com/is/image/JCPenney/DP0309202015005033M?hei=380&wid=380&op_usm=.4,.8,0,0&resmode=sharp2'
          },
          {
            name: 'Nike Womens Round Neck Sleeveless Tank Top',
            price: 40,
            thumbnail:
              'https://s7d9.scene7.com/is/image/JCPenney/DP0309202015004090M?hei=380&wid=380&op_usm=.4,.8,0,0&resmode=sharp2'
          }
        ],
        vendor: VENDOR_CODES.JCPENNEY,
        emailId: '178f0254ae4608b4'
      });
    });

    it('should return order data with quantity handled', async () => {
      const updatedPayload = Object.assign({}, payload);
      let updatedBody = updatedPayload.decodedBody;

      updatedBody = updatedBody.replace('Qty:&#160; 1', 'Qty:&#160; 3');

      updatedPayload.decodedBody = updatedBody;

      const orderData = await JCPENNEY.parse(VENDOR_CODES.JCPENNEY, updatedPayload);
      expect(orderData).to.be.deep.equal({
        orderRef: '2021-1104-1026-7750',
        orderDate: 1618876800000,
        products: [
          {
            name: 'Nike Womens Round Neck Short Sleeve TShirt Plus (1)',
            price: 25,
            thumbnail:
              'https://s7d9.scene7.com/is/image/JCPenney/DP0309202015005033M?hei=380&wid=380&op_usm=.4,.8,0,0&resmode=sharp2'
          },
          {
            name: 'Nike Womens Round Neck Short Sleeve TShirt Plus (2)',
            price: 25,
            thumbnail:
              'https://s7d9.scene7.com/is/image/JCPenney/DP0309202015005033M?hei=380&wid=380&op_usm=.4,.8,0,0&resmode=sharp2'
          },
          {
            name: 'Nike Womens Round Neck Short Sleeve TShirt Plus (3)',
            price: 25,
            thumbnail:
              'https://s7d9.scene7.com/is/image/JCPenney/DP0309202015005033M?hei=380&wid=380&op_usm=.4,.8,0,0&resmode=sharp2'
          },
          {
            name: 'Nike Womens Round Neck Sleeveless Tank Top',
            thumbnail:
              'https://s7d9.scene7.com/is/image/JCPenney/DP0309202015004090M?hei=380&wid=380&op_usm=.4,.8,0,0&resmode=sharp2',
            price: 40
          }
        ],
        vendor: VENDOR_CODES.JCPENNEY,
        emailId: '178f0254ae4608b4'
      });
    });

    it('should throw error if contains lacking data', () => {
      const updatedPayload = Object.assign({}, payload);
      updatedPayload.decodedBody = '<body>Invalid Body</body>';
      expect(JCPENNEY.parse(VENDOR_CODES.JCPENNEY, updatedPayload)).to.eventually.be.rejectedWith(Error);
    });
  });
});
