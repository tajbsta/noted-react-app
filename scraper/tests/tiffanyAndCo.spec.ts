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
import TiffanyAndCo from '../src/lib/vendors/tiffanyAndco';

chai.use(chaiAsPromised);
moment.tz.setDefault('Etc/UTC');

const TEST_DATA_URL = 'https://noted-scrape-test.s3.us-west-2.amazonaws.com/TIFFANYANDCO.json';

describe('Tiffany And Co', () => {
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
      const orderData = await TiffanyAndCo.parse(VENDOR_CODES.TIFFANYANDCO, payload);
      expect(orderData).to.be.deep.equal({
        orderRef: '110052970',
        orderDate: 1634601600000,
        products: [
          {
            name: 'SS APPLE CHILDS SPOON',
            price: 150.0,
            thumbnail:
              'http://media.tiffany.com/is/image/Tiffany/19196976_934060_ED?$EcomBrowseL$&defaultImage=ECOM_NoImageAvailable'
          },
          {
            name: 'Tiffany & Love Eau de Parfum for Her, 1.6 ounces.',
            price: 108.0,
            thumbnail:
              'http://media.tiffany.com/is/image/Tiffany/68112214_1004039_ED?$EcomBrowseL$&defaultImage=ECOM_NoImageAvailable'
          }
        ],
        vendor: VENDOR_CODES.TIFFANYANDCO,
        emailId: payload.id
      });
    });

    it('should return order data with quantity handled', async () => {
      const updatedPayload = Object.assign({}, payload);
      let updatedBody = updatedPayload.decodedBody;

      updatedBody = updatedBody.replace(`Quantity : 1`, `Quantity : 2`);

      updatedPayload.decodedBody = updatedBody;

      const orderData = await TiffanyAndCo.parse(VENDOR_CODES.TIFFANYANDCO, updatedPayload);
      expect(orderData).to.be.deep.equal({
        orderRef: '110052970',
        orderDate: 1634601600000,
        products: [
          {
            name: 'SS APPLE CHILDS SPOON (1)',
            price: 150.0,
            thumbnail:
              'http://media.tiffany.com/is/image/Tiffany/19196976_934060_ED?$EcomBrowseL$&defaultImage=ECOM_NoImageAvailable'
          },
          {
            name: 'SS APPLE CHILDS SPOON (2)',
            price: 150.0,
            thumbnail:
              'http://media.tiffany.com/is/image/Tiffany/19196976_934060_ED?$EcomBrowseL$&defaultImage=ECOM_NoImageAvailable'
          },
          {
            name: 'Tiffany & Love Eau de Parfum for Her, 1.6 ounces.',
            price: 108.0,
            thumbnail:
              'http://media.tiffany.com/is/image/Tiffany/68112214_1004039_ED?$EcomBrowseL$&defaultImage=ECOM_NoImageAvailable'
          }
        ],
        vendor: VENDOR_CODES.TIFFANYANDCO,
        emailId: payload.id
      });
    });

    it('should throw error if contains lacking data', () => {
      const updatedPayload = Object.assign({}, payload);
      updatedPayload.decodedBody = '<body>Invalid Body</body>';
      expect(TiffanyAndCo.parse(VENDOR_CODES.TIFFANYANDCO, updatedPayload)).to.eventually.be.rejectedWith(Error);
    });
  });
});
