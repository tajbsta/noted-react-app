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
import Target from '../src/lib/vendors/target';

chai.use(chaiAsPromised);
moment.tz.setDefault('Etc/UTC');

const TEST_DATA_URL = 'https://noted-scrape-test.s3-us-west-2.amazonaws.com/TARGET.json';

describe('TARGET', () => {
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
      const orderData = await Target.parse(VENDOR_CODES.TARGET, payload);
      expect(orderData).to.be.deep.equal({
        orderRef: '9162987356508',
        orderDate: 1577404800000,
        products: [
          {
            name: 'Bormioli Rocco Fido 50.75oz Square Jar - Clear (1)',
            thumbnail: 'http://target.scene7.com/is/image/Target/GUEST_31fdee05-6033-4d4a-9768-41cf5a08b1ef',
            price: 7.99
          },
          {
            name: 'Bormioli Rocco Fido 50.75oz Square Jar - Clear (2)',
            thumbnail: 'http://target.scene7.com/is/image/Target/GUEST_31fdee05-6033-4d4a-9768-41cf5a08b1ef',
            price: 7.99
          },
          {
            name: "16oz Stoneware I'm Not Feeling Very Worky Today Mug Teal - Opalhouse™",
            thumbnail: 'http://target.scene7.com/is/image/Target/GUEST_8b80a977-64be-4bfe-9a68-ccc9f23b3951',
            price: 4.99
          },
          {
            name: "16oz Porcelain Today's Goal Mug White - Threshold™",
            thumbnail: 'http://target.scene7.com/is/image/Target/GUEST_590baf1b-efcc-4bde-9258-d78f0a564e49',
            price: 5.99
          },
          {
            name: '15oz Stoneware Good Morning Diner Mug Light Pink - Opalhouse™',
            thumbnail: 'http://target.scene7.com/is/image/Target/GUEST_63f5f8f6-7b61-4485-bfab-5737a110bb23',
            price: 5.99
          },
          {
            name: '16oz Porcelain Papa Bear Mug White - Threshold™',
            thumbnail: 'http://target.scene7.com/is/image/Target/GUEST_76091cfe-3a54-44e6-b661-bc7f7c016a71',
            price: 5.99
          },
          {
            name: "16oz Porcelain Don't Stress Do Your Best Mug Cream - Threshold™",
            thumbnail: 'http://target.scene7.com/is/image/Target/GUEST_22847501-5424-4672-b18a-054215fec675',
            price: 5.99
          }
        ],
        vendor: VENDOR_CODES.TARGET,
        emailId: '16f44fe656871a0f'
      });
    });

    it('should return order data with quantity handled', async () => {
      const updatedPayload = Object.assign({}, payload);
      let updatedBody = updatedPayload.decodedBody;

      updatedBody = updatedBody.replace(
        `14px; line-height: 22px;"> Qty: 1 </p>`,
        `14px; line-height: 22px;"> Qty: 2 </p>`
      );

      updatedPayload.decodedBody = updatedBody;

      const orderData = await Target.parse(VENDOR_CODES.TARGET, updatedPayload);
      expect(orderData).to.be.deep.equal({
        orderRef: '9162987356508',
        orderDate: 1577404800000,
        products: [
          {
            name: 'Bormioli Rocco Fido 50.75oz Square Jar - Clear (1)',
            thumbnail: 'http://target.scene7.com/is/image/Target/GUEST_31fdee05-6033-4d4a-9768-41cf5a08b1ef',
            price: 7.99
          },
          {
            name: 'Bormioli Rocco Fido 50.75oz Square Jar - Clear (2)',
            thumbnail: 'http://target.scene7.com/is/image/Target/GUEST_31fdee05-6033-4d4a-9768-41cf5a08b1ef',
            price: 7.99
          },
          {
            name: "16oz Stoneware I'm Not Feeling Very Worky Today Mug Teal - Opalhouse™ (1)",
            thumbnail: 'http://target.scene7.com/is/image/Target/GUEST_8b80a977-64be-4bfe-9a68-ccc9f23b3951',
            price: 4.99
          },
          {
            name: "16oz Stoneware I'm Not Feeling Very Worky Today Mug Teal - Opalhouse™ (2)",
            thumbnail: 'http://target.scene7.com/is/image/Target/GUEST_8b80a977-64be-4bfe-9a68-ccc9f23b3951',
            price: 4.99
          },
          {
            name: "16oz Porcelain Today's Goal Mug White - Threshold™",
            thumbnail: 'http://target.scene7.com/is/image/Target/GUEST_590baf1b-efcc-4bde-9258-d78f0a564e49',
            price: 5.99
          },
          {
            name: '15oz Stoneware Good Morning Diner Mug Light Pink - Opalhouse™',
            thumbnail: 'http://target.scene7.com/is/image/Target/GUEST_63f5f8f6-7b61-4485-bfab-5737a110bb23',
            price: 5.99
          },
          {
            name: '16oz Porcelain Papa Bear Mug White - Threshold™',
            thumbnail: 'http://target.scene7.com/is/image/Target/GUEST_76091cfe-3a54-44e6-b661-bc7f7c016a71',
            price: 5.99
          },
          {
            name: "16oz Porcelain Don't Stress Do Your Best Mug Cream - Threshold™",
            thumbnail: 'http://target.scene7.com/is/image/Target/GUEST_22847501-5424-4672-b18a-054215fec675',
            price: 5.99
          }
        ],
        vendor: VENDOR_CODES.TARGET,
        emailId: '16f44fe656871a0f'
      });
    });

    it('should throw error if contains lacking data', () => {
      const updatedPayload = Object.assign({}, payload);
      updatedPayload.decodedBody = '<body>Invalid Body</body>';
      expect(Target.parse(VENDOR_CODES.TARGET, updatedPayload)).to.eventually.be.rejectedWith(Error);
    });
  });
});
