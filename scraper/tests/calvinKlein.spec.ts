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
import Belk from '../src/lib/vendors/belk';
import CalvinKlein from '../src/lib/vendors/calvinKlein';

chai.use(chaiAsPromised);
moment.tz.setDefault('Etc/UTC');

const TEST_DATA_URL = 'https://noted-scrape-test.s3-us-west-2.amazonaws.com/CALVINKLEIN.json';

describe('Calvin Klein', () => {
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
      const orderData = await CalvinKlein.parse(VENDOR_CODES.CALVINKLEIN, payload);
      expect(orderData).to.be.deep.equal({
        orderRef: '64906801',
        orderDate: 1618358400000,
        products: [
          {
            name: 'Performance Brush Logo High Waist Drawstring Joggers',
            price: 44.62,
            thumbnail:
              'https://calvinklein.scene7.com/is/image/CalvinKlein/11576222_130_main?wid=400&hei=527&fmt=jpeg&qlt=90%2c0&op_sharpen=1&resMode=trilin&op_usm=0.8%2c1.0%2c6%2c0&iccEmbed=0'
          },
          {
            name: 'Performance Brush Logo Crewneck Sweatshirt',
            price: 44.63,
            thumbnail:
              'https://calvinklein.scene7.com/is/image/CalvinKlein/11553558_130_main?wid=400&hei=527&fmt=jpeg&qlt=90%2c0&op_sharpen=1&resMode=trilin&op_usm=0.8%2c1.0%2c6%2c0&iccEmbed=0'
          }
        ],
        vendor: VENDOR_CODES.CALVINKLEIN,
        emailId: '178d0f5230c66839'
      });
    });

    it('should return order data with quantity handled', async () => {
      const updatedPayload = Object.assign({}, payload);
      let updatedBody = updatedPayload.decodedBody;

      updatedBody = updatedBody.replace(
        `<td width="50%" valign="top" style="font-family:ArialMT, Arial, Sans-serif; line-height:25px; font-size:18px; padding: 0px 0px 15px 0px;">1</td>`,
        `<td width="50%" valign="top" style="font-family:ArialMT, Arial, Sans-serif; line-height:25px; font-size:18px; padding: 0px 0px 15px 0px;">2</td>`
      );

      updatedPayload.decodedBody = updatedBody;

      const orderData = await CalvinKlein.parse(VENDOR_CODES.CALVINKLEIN, updatedPayload);
      expect(orderData).to.be.deep.equal({
        orderRef: '64906801',
        orderDate: 1618358400000,
        products: [
          {
            name: 'Performance Brush Logo High Waist Drawstring Joggers (1)',
            price: 44.62,
            thumbnail:
              'https://calvinklein.scene7.com/is/image/CalvinKlein/11576222_130_main?wid=400&hei=527&fmt=jpeg&qlt=90%2c0&op_sharpen=1&resMode=trilin&op_usm=0.8%2c1.0%2c6%2c0&iccEmbed=0'
          },
          {
            name: 'Performance Brush Logo High Waist Drawstring Joggers (2)',
            price: 44.62,
            thumbnail:
              'https://calvinklein.scene7.com/is/image/CalvinKlein/11576222_130_main?wid=400&hei=527&fmt=jpeg&qlt=90%2c0&op_sharpen=1&resMode=trilin&op_usm=0.8%2c1.0%2c6%2c0&iccEmbed=0'
          },
          {
            name: 'Performance Brush Logo Crewneck Sweatshirt',
            price: 44.63,
            thumbnail:
              'https://calvinklein.scene7.com/is/image/CalvinKlein/11553558_130_main?wid=400&hei=527&fmt=jpeg&qlt=90%2c0&op_sharpen=1&resMode=trilin&op_usm=0.8%2c1.0%2c6%2c0&iccEmbed=0'
          }
        ],
        vendor: VENDOR_CODES.CALVINKLEIN,
        emailId: '178d0f5230c66839'
      });
    });

    it('should throw error if contains lacking data', () => {
      const updatedPayload = Object.assign({}, payload);
      updatedPayload.decodedBody = '<body>Invalid Body</body>';
      expect(CalvinKlein.parse(VENDOR_CODES.CALVINKLEIN, updatedPayload)).to.eventually.be.rejectedWith(Error);
    });
  });
});
