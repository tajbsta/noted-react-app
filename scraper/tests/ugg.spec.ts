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
import Ugg from '../src/lib/vendors/ugg';

chai.use(chaiAsPromised);
moment.tz.setDefault('Etc/UTC');

const TEST_DATA_URL = 'https://noted-scrape-test.s3.us-west-2.amazonaws.com/UGG.json';

describe(`UGG`, () => {
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

      const orderData = await Ugg.parse(VENDOR_CODES.UGG, updatedPayload);
      expect(orderData).to.be.deep.equal({
        orderRef: 'NA4966558',
        orderDate: Number(payload.internalDate),
        products: [
          {
            name: 'Neumel Ez-Fit',
            price: 90.0,
            thumbnail:
              'https://www.ugg.com/on/demandware.static/-/Sites-UGG-NA-master/default/dwd8feaec0/images/transparent/1121037T-CHE_1.png'
          },
          {
            name: 'Chelham Weather',
            price: 70.0,
            thumbnail:
              'https://www.ugg.com/on/demandware.static/-/Sites-UGG-NA-master/default/dwcd3e8e82/images/transparent/1120950T-BLKS_1.png'
          }
        ],
        vendor: VENDOR_CODES.UGG,
        emailId: payload.id
      });
    });

    it('should return order data with quantity handled', async () => {
      const updatedPayload = Object.assign({}, payload);

      let updatedBody = updatedPayload.decodedBody;

      updatedBody = updatedBody.replace(
        '<p>Qty: <span style="font-weight:normal;">1</span></p>',
        '<p>Qty: <span style="font-weight:normal;">2</span></p>'
      );

      updatedPayload.decodedBody = updatedBody;

      const orderData = await Ugg.parse(VENDOR_CODES.UGG, updatedPayload);
      expect(orderData).to.be.deep.equal({
        orderRef: 'NA4966558',
        orderDate: Number(payload.internalDate),
        products: [
          {
            name: 'Neumel Ez-Fit (1)',
            price: 90.0,
            thumbnail:
              'https://www.ugg.com/on/demandware.static/-/Sites-UGG-NA-master/default/dwd8feaec0/images/transparent/1121037T-CHE_1.png'
          },
          {
            name: 'Neumel Ez-Fit (2)',
            price: 90.0,
            thumbnail:
              'https://www.ugg.com/on/demandware.static/-/Sites-UGG-NA-master/default/dwd8feaec0/images/transparent/1121037T-CHE_1.png'
          },
          {
            name: 'Chelham Weather',
            price: 70.0,
            thumbnail:
              'https://www.ugg.com/on/demandware.static/-/Sites-UGG-NA-master/default/dwcd3e8e82/images/transparent/1120950T-BLKS_1.png'
          }
        ],
        vendor: VENDOR_CODES.UGG,
        emailId: payload.id
      });
    });

    it('should throw error if contains lacking data', () => {
      const updatedPayload = Object.assign({}, payload);
      updatedPayload.decodedBody = '<body>Invalid Body</body>';
      expect(Ugg.parse(VENDOR_CODES.UGG, updatedPayload)).to.eventually.be.rejectedWith(Error);
    });
  });
});
