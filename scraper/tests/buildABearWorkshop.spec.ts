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
import BuildABearWorkshop from '../src/lib/vendors/buildABearWorkshop';

chai.use(chaiAsPromised);
moment.tz.setDefault('Etc/UTC');

const TEST_DATA_URL = 'https://noted-scrape-test.s3.us-west-2.amazonaws.com/BUILDABEARWORKSHOP.json';

describe(`Build A Bear Workshop`, () => {
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

      const orderData = await BuildABearWorkshop.parse(VENDOR_CODES.BUILDABEARWORKSHOP, updatedPayload);
      expect(orderData).to.be.deep.equal({
        orderRef: 'W4197735',
        orderDate: Number(payload.internalDate),
        products: [
          {
            name: 'White Graduation Set 4 pc. Undressed',
            price: 13.5,
            thumbnail:
              'https://www.buildabear.com/on/demandware.static/-/Sites-buildabear-master/default/dw0ffaa71e/20530x.jpg'
          },
          {
            name: 'Pawlette™ Stuffed',
            price: 20.0,
            thumbnail:
              'https://www.buildabear.com/on/demandware.static/-/Sites-buildabear-master/default/dwb968e299/22601x.jpg'
          }
        ],
        vendor: VENDOR_CODES.BUILDABEARWORKSHOP,
        emailId: payload.id
      });
    });

    it('should return order data with quantity handled', async () => {
      const updatedPayload = Object.assign({}, payload);

      let updatedBody = updatedPayload.decodedBody;

      updatedBody = updatedBody.replace(
        '<span style="font-size: 8.5pt; font-family: &quot;Arial&quot;, sans-serif; color: #666666">1</span>',
        '<span style="font-size: 8.5pt; font-family: &quot;Arial&quot;, sans-serif; color: #666666">2</span>'
      );

      updatedPayload.decodedBody = updatedBody;

      const orderData = await BuildABearWorkshop.parse(VENDOR_CODES.BUILDABEARWORKSHOP, updatedPayload);
      expect(orderData).to.be.deep.equal({
        orderRef: 'W4197735',
        orderDate: Number(payload.internalDate),
        products: [
          {
            name: 'White Graduation Set 4 pc. Undressed (1)',
            price: 13.5,
            thumbnail:
              'https://www.buildabear.com/on/demandware.static/-/Sites-buildabear-master/default/dw0ffaa71e/20530x.jpg'
          },
          {
            name: 'White Graduation Set 4 pc. Undressed (2)',
            price: 13.5,
            thumbnail:
              'https://www.buildabear.com/on/demandware.static/-/Sites-buildabear-master/default/dw0ffaa71e/20530x.jpg'
          },
          {
            name: 'Pawlette™ Stuffed',
            price: 20.0,
            thumbnail:
              'https://www.buildabear.com/on/demandware.static/-/Sites-buildabear-master/default/dwb968e299/22601x.jpg'
          }
        ],
        vendor: VENDOR_CODES.BUILDABEARWORKSHOP,
        emailId: payload.id
      });
    });

    it('should throw error if contains lacking data', () => {
      const updatedPayload = Object.assign({}, payload);
      updatedPayload.decodedBody = '<body>Invalid Body</body>';
      expect(BuildABearWorkshop.parse(VENDOR_CODES.BUILDABEARWORKSHOP, updatedPayload)).to.eventually.be.rejectedWith(
        Error
      );
    });
  });
});
