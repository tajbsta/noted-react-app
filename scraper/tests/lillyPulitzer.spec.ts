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
import LillyPulitzer from '../src/lib/vendors/lillyPulitzer';

chai.use(chaiAsPromised);
moment.tz.setDefault('Etc/UTC');

const TEST_DATA_URL = 'https://noted-scrape-test.s3.us-west-2.amazonaws.com/LILLYPULITZER.json';

describe(`Lilly Pulitzer`, () => {
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
      const orderData = await LillyPulitzer.parse(VENDOR_CODES.LILLYPULITZER, payload);
      expect(orderData).to.be.deep.equal({
        orderRef: '6762870',
        orderDate: 1635120000000,
        products: [
          {
            name: 'Mermaid Grotto Earrings',
            price: 48.0,
            thumbnail: 'https://scene7.lillypulitzer.com/is/image/sugartown/008409_bougainvilleapink-sf?$sfraPLP1x$'
          },
          {
            name: 'Mermaid Grotto Bracelet Set',
            price: 48.0,
            thumbnail: 'https://scene7.lillypulitzer.com/is/image/sugartown/009204_multi-sf?$sfraPLP1x$'
          }
        ],
        vendor: VENDOR_CODES.LILLYPULITZER,
        emailId: payload.id
      });
    });

    it('should return order data with quantity handled', async () => {
      const updatedPayload = Object.assign({}, payload);

      let updatedBody = updatedPayload.decodedBody;

      updatedBody = updatedBody.replace(`1</td>`, `2</td>`);

      updatedPayload.decodedBody = updatedBody;

      const orderData = await LillyPulitzer.parse(VENDOR_CODES.LILLYPULITZER, updatedPayload);
      expect(orderData).to.be.deep.equal({
        orderRef: '6762870',
        orderDate: 1635120000000,
        products: [
          {
            name: 'Mermaid Grotto Earrings (1)',
            price: 48.0,
            thumbnail: 'https://scene7.lillypulitzer.com/is/image/sugartown/008409_bougainvilleapink-sf?$sfraPLP1x$'
          },
          {
            name: 'Mermaid Grotto Earrings (2)',
            price: 48.0,
            thumbnail: 'https://scene7.lillypulitzer.com/is/image/sugartown/008409_bougainvilleapink-sf?$sfraPLP1x$'
          },
          {
            name: 'Mermaid Grotto Bracelet Set',
            price: 48.0,
            thumbnail: 'https://scene7.lillypulitzer.com/is/image/sugartown/009204_multi-sf?$sfraPLP1x$'
          }
        ],
        vendor: VENDOR_CODES.LILLYPULITZER,
        emailId: payload.id
      });
    });

    it('should throw error if contains lacking data', () => {
      const updatedPayload = Object.assign({}, payload);
      updatedPayload.decodedBody = '<body>Invalid Body</body>';
      expect(LillyPulitzer.parse(VENDOR_CODES.LILLYPULITZER, updatedPayload)).to.eventually.be.rejectedWith(Error);
    });
  });
});
