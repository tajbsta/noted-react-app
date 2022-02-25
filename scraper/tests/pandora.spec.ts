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
import Pandora from '../src/lib/vendors/pandora';

chai.use(chaiAsPromised);
moment.tz.setDefault('Etc/UTC');

const TEST_DATA_URL = 'https://noted-scrape-test.s3.us-west-2.amazonaws.com/PANDORA (2).json';

describe(`Pandora`, () => {
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
      const orderData = await Pandora.parse(VENDOR_CODES.PANDORA, payload);

      expect(orderData).to.be.deep.equal({
        orderRef: 'PND12580235',
        orderDate: 1634515200000,
        products: [
          {
            name: 'Pandora ME Pavé Ring',
            thumbnail:
              'https://us.pandora.net/dw/image/v2/AAVX_PRD/on/demandware.static/-/Sites-pandora-master-catalog/default/dwe38c304f/productimages/main/189679C01_RGB.JPG?sw=100&sh=100&sm=fit&sfrm=png&bgcolor=F5F5F5',
            price: 50.0
          },
          {
            name: 'Polished Wishbone Ring',
            thumbnail:
              'https://us.pandora.net/dw/image/v2/AAVX_PRD/on/demandware.static/-/Sites-pandora-master-catalog/default/dw60a433c6/productimages/main/196314_RGB.JPG?sw=100&sh=100&sm=fit&sfrm=png&bgcolor=F5F5F5',
            price: 35.0
          }
        ],
        vendor: VENDOR_CODES.PANDORA,
        emailId: payload.id
      });
    });

    it('should return order data with quantity handled', async () => {
      const updatedPayload = Object.assign({}, payload);

      let updatedBody = updatedPayload.decodedBody;

      updatedBody = updatedBody.replace(`Quantity: 1`, `Quantity: 2`);

      updatedPayload.decodedBody = updatedBody;

      const orderData = await Pandora.parse(VENDOR_CODES.PANDORA, updatedPayload);

      expect(orderData).to.be.deep.equal({
        orderRef: 'PND12580235',
        orderDate: 1634515200000,
        products: [
          {
            name: 'Pandora ME Pavé Ring (1)',
            thumbnail:
              'https://us.pandora.net/dw/image/v2/AAVX_PRD/on/demandware.static/-/Sites-pandora-master-catalog/default/dwe38c304f/productimages/main/189679C01_RGB.JPG?sw=100&sh=100&sm=fit&sfrm=png&bgcolor=F5F5F5',
            price: 50.0
          },
          {
            name: 'Pandora ME Pavé Ring (2)',
            thumbnail:
              'https://us.pandora.net/dw/image/v2/AAVX_PRD/on/demandware.static/-/Sites-pandora-master-catalog/default/dwe38c304f/productimages/main/189679C01_RGB.JPG?sw=100&sh=100&sm=fit&sfrm=png&bgcolor=F5F5F5',
            price: 50.0
          },
          {
            name: 'Polished Wishbone Ring',
            thumbnail:
              'https://us.pandora.net/dw/image/v2/AAVX_PRD/on/demandware.static/-/Sites-pandora-master-catalog/default/dw60a433c6/productimages/main/196314_RGB.JPG?sw=100&sh=100&sm=fit&sfrm=png&bgcolor=F5F5F5',
            price: 35.0
          }
        ],
        vendor: VENDOR_CODES.PANDORA,
        emailId: payload.id
      });
    });

    it('should throw error if contains lacking data', () => {
      const updatedPayload = Object.assign({}, payload);
      updatedPayload.decodedBody = '<body>Invalid Body</body>';
      expect(Pandora.parse(VENDOR_CODES.PANDORA, updatedPayload)).to.eventually.be.rejectedWith(Error);
    });
  });
});
