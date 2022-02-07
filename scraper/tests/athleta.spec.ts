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
import Athleta from '../src/lib/vendors/athleta';

chai.use(chaiAsPromised);
moment.tz.setDefault('Etc/UTC');

const TEST_DATA_URL = 'https://noted-scrape-test.s3.us-west-2.amazonaws.com/ATHLETA.json';

describe('Athleta', () => {
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
      const orderData = await Athleta.parse(VENDOR_CODES.ATHLETA, payload);
      expect(orderData).to.be.deep.equal({
        orderRef: '16R8K1G',
        orderDate: 1634860800000,
        products: [
          {
            name: 'Aromatherapy Mist Mini by Asutra',
            price: 2.99,
            thumbnail:
              'https://image.email.athleta.com/lib/fe9f13707564037d77/m/19/1f6d01e5-d300-4e83-83f8-90004691e298.jpg'
          }
        ],
        vendor: VENDOR_CODES.ATHLETA,
        emailId: payload.id
      });
    });

    it('should return order data with quantity handled', async () => {
      const updatedPayload = Object.assign({}, payload);
      let updatedBody = updatedPayload.decodedBody;

      updatedBody = updatedBody.replace(
        `<td style="font-family:'Source Sans Pro',Helvetica,Arial,sans-serif;font-size:15px;line-height:22.5px;color:#666666;">1</td>`,
        `<td style="font-family:'Source Sans Pro',Helvetica,Arial,sans-serif;font-size:15px;line-height:22.5px;color:#666666;">2</td>`
      );

      updatedPayload.decodedBody = updatedBody;

      const orderData = await Athleta.parse(VENDOR_CODES.ATHLETA, updatedPayload);
      expect(orderData).to.be.deep.equal({
        orderRef: '16R8K1G',
        orderDate: 1634860800000,
        products: [
          {
            name: 'Aromatherapy Mist Mini by Asutra (1)',
            price: 2.99,
            thumbnail:
              'https://image.email.athleta.com/lib/fe9f13707564037d77/m/19/1f6d01e5-d300-4e83-83f8-90004691e298.jpg'
          },
          {
            name: 'Aromatherapy Mist Mini by Asutra (2)',
            price: 2.99,
            thumbnail:
              'https://image.email.athleta.com/lib/fe9f13707564037d77/m/19/1f6d01e5-d300-4e83-83f8-90004691e298.jpg'
          }
        ],
        vendor: VENDOR_CODES.ATHLETA,
        emailId: payload.id
      });
    });

    it('should throw error if contains lacking data', () => {
      const updatedPayload = Object.assign({}, payload);
      updatedPayload.decodedBody = '<body>Invalid Body</body>';
      expect(Athleta.parse(VENDOR_CODES.ATHLETA, updatedPayload)).to.eventually.be.rejectedWith(Error);
    });
  });
});
