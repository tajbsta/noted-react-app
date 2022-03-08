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
import WilliamsSonoma from '../src/lib/vendors/williamsSonoma';

chai.use(chaiAsPromised);
moment.tz.setDefault('Etc/UTC');

const TEST_DATA_URL = 'https://noted-scrape-test.s3.us-west-2.amazonaws.com/WILLIAMSSONOMA.json';

describe('Williams Sonoma', () => {
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
      const orderData = await WilliamsSonoma.parse(VENDOR_CODES.WILLIAMSSONOMA, payload);
      expect(orderData).to.be.deep.equal({
        orderRef: '312952384377',
        orderDate: 1634860800000,
        products: [
          {
            name: 'Williams Sonoma Fall Pie Punches, Set of 6',
            price: 19.95,
            thumbnail: 'https://www.williams-sonoma.com/wsimgs/ab/images/dp/wcm/202131/0020/img42m.jpg'
          },
          {
            name: 'Williams Sonoma Fall Rolling Impression Pie Crust Cutter',
            price: 19.95,
            thumbnail: 'https://www.williams-sonoma.com/wsimgs/ab/images/dp/wcm/202125/0045/img5m.jpg'
          }
        ],
        vendor: VENDOR_CODES.WILLIAMSSONOMA,
        emailId: payload.id
      });
    });

    it('should return order data with quantity handled', async () => {
      const updatedPayload = Object.assign({}, payload);
      let updatedBody = updatedPayload.decodedBody;

      updatedBody = updatedBody.replace('QTY: 1', 'QTY: 2');

      updatedPayload.decodedBody = updatedBody;

      const orderData = await WilliamsSonoma.parse(VENDOR_CODES.WILLIAMSSONOMA, updatedPayload);
      expect(orderData).to.be.deep.equal({
        orderRef: '312952384377',
        orderDate: 1634860800000,
        products: [
          {
            name: 'Williams Sonoma Fall Pie Punches, Set of 6 (2)',
            price: 19.95,
            thumbnail: 'https://www.williams-sonoma.com/wsimgs/ab/images/dp/wcm/202131/0020/img42m.jpg'
          },
          {
            name: 'Williams Sonoma Fall Pie Punches, Set of 6 (1)',
            price: 19.95,
            thumbnail: 'https://www.williams-sonoma.com/wsimgs/ab/images/dp/wcm/202131/0020/img42m.jpg'
          },
          {
            name: 'Williams Sonoma Fall Rolling Impression Pie Crust Cutter',
            price: 19.95,
            thumbnail: 'https://www.williams-sonoma.com/wsimgs/ab/images/dp/wcm/202125/0045/img5m.jpg'
          }
        ],
        vendor: VENDOR_CODES.WILLIAMSSONOMA,
        emailId: payload.id
      });
    });

    it('should throw error if contains lacking data', () => {
      const updatedPayload = Object.assign({}, payload);
      updatedPayload.decodedBody = '<body>Invalid Body</body>';
      expect(WilliamsSonoma.parse(VENDOR_CODES.WILLIAMSSONOMA, updatedPayload)).to.eventually.be.rejectedWith(Error);
    });
  });
});
