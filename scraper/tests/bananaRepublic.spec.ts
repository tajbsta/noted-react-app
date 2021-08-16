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
import BananaRepublic from '../src/lib/vendors/bananaRepublic';

chai.use(chaiAsPromised);
moment.tz.setDefault('Etc/UTC');

const TEST_DATA_URL = 'https://noted-scrape-test.s3-us-west-2.amazonaws.com/BANANAREPUBLIC.json';

describe('Banana Republic', () => {
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
      const orderData = await BananaRepublic.parse(VENDOR_CODES.BANANAREPUBLIC, payload);
      expect(orderData).to.be.deep.equal({
        orderRef: '14G0MX2',
        orderDate: 1618358400000,
        products: [
          {
            name: 'Ribbed Sweater Dress',
            price: 77.4,
            thumbnail: ''
          }
        ],
        vendor: VENDOR_CODES.BANANAREPUBLIC,
        emailId: '178d0c8dfcc354ee'
      });
    });

    it('should return order data with quantity handled', async () => {
      const updatedPayload = Object.assign({}, payload);
      let updatedBody = updatedPayload.decodedBody;

      updatedBody = updatedBody.replace(
        '<td style="font-family:\'Source Sans Pro\',Helvetica,Arial,sans-serif;font-size:15px;line-height:22.5px;color:#666666;">1</td>',
        '<td style="font-family:\'Source Sans Pro\',Helvetica,Arial,sans-serif;font-size:15px;line-height:22.5px;color:#666666;">2</td>'
      );

      updatedPayload.decodedBody = updatedBody;

      const orderData = await BananaRepublic.parse(VENDOR_CODES.BANANAREPUBLIC, updatedPayload);
      expect(orderData).to.be.deep.equal({
        orderRef: '14G0MX2',
        orderDate: 1618358400000,
        products: [
          {
            name: 'Ribbed Sweater Dress (1)',
            price: 77.4,
            thumbnail: ''
          },
          {
            name: 'Ribbed Sweater Dress (2)',
            price: 77.4,
            thumbnail: ''
          }
        ],
        vendor: VENDOR_CODES.BANANAREPUBLIC,
        emailId: '178d0c8dfcc354ee'
      });
    });

    it('should throw error if contains lacking data', () => {
      const updatedPayload = Object.assign({}, payload);
      updatedPayload.decodedBody = '<body>Invalid Body</body>';
      expect(BananaRepublic.parse(VENDOR_CODES.BANANAREPUBLIC, updatedPayload)).to.eventually.be.rejectedWith(Error);
    });
  });
});
