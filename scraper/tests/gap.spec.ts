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
import GAP from '../src/lib/vendors/gap';

chai.use(chaiAsPromised);
moment.tz.setDefault('Etc/UTC');

const TEST_DATA_URL = 'https://noted-scrape-test.s3-us-west-2.amazonaws.com/GAP.json';

describe('GAP', () => {
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
      const orderData = await GAP.parse(VENDOR_CODES.GAP, payload);
      expect(orderData).to.be.deep.equal({
        orderRef: '14HHDWB',
        orderDate: 1618531200000,
        products: [
          {
            name: 'Tie-Back Cami Mini Dress',
            price: 44,
            thumbnail: ''
          },
          {
            name: 'High Rise Universal Jegging with Secret Smoothing Pockets With Washwell&#153',
            price: 58,
            thumbnail: ''
          },
          {
            name: 'Scrunchie',
            price: 7,
            thumbnail: ''
          },
          {
            name: 'Button-Front Midi Skirt',
            price: 50.99,
            thumbnail: ''
          }
        ],
        vendor: VENDOR_CODES.GAP,
        emailId: '178dcfaa538338c8'
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

      const orderData = await GAP.parse(VENDOR_CODES.GAP, updatedPayload);
      expect(orderData).to.be.deep.equal({
        orderRef: '14HHDWB',
        orderDate: 1618531200000,
        products: [
          {
            name: 'Tie-Back Cami Mini Dress (1)',
            price: 44,
            thumbnail: ''
          },
          {
            name: 'Tie-Back Cami Mini Dress (2)',
            price: 44,
            thumbnail: ''
          },
          {
            name: 'High Rise Universal Jegging with Secret Smoothing Pockets With Washwell&#153',
            price: 58,
            thumbnail: ''
          },
          {
            name: 'Scrunchie',
            price: 7,
            thumbnail: ''
          },
          {
            name: 'Button-Front Midi Skirt',
            price: 50.99,
            thumbnail: ''
          }
        ],
        vendor: VENDOR_CODES.GAP,
        emailId: '178dcfaa538338c8'
      });
    });

    it('should throw error if contains lacking data', () => {
      const updatedPayload = Object.assign({}, payload);
      updatedPayload.decodedBody = '<body>Invalid Body</body>';
      expect(GAP.parse(VENDOR_CODES.GAP, updatedPayload)).to.eventually.be.rejectedWith(Error);
    });
  });
});
