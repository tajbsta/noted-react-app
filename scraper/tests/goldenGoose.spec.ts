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
import GoldenGoose from '../src/lib/vendors/goldenGoose';

chai.use(chaiAsPromised);
moment.tz.setDefault('Etc/UTC');

const TEST_DATA_URL = 'https://noted-scrape-test.s3.us-west-2.amazonaws.com/GOLDENGOOSE.json';

describe(`GoldenGoose`, () => {
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
      const orderData = await GoldenGoose.parse(VENDOR_CODES.GOLDENGOOSE, payload);
      expect(orderData).to.be.deep.equal({
        orderRef: '00289986',
        orderDate: 1634083200000,
        products: [
          {
            name: 'Super-Star sneakers with painted star and lettering on the foxing',
            price: 300.0,
            thumbnail:
              'https://static.goldengoose.com/image/upload/w_auto,c_scale,dpr_auto/v1605204751/Style/ECOMM/G36KS001-B42'
          },
          {
            name: 'White leather Super-Star sneakers with glittery heel tab',
            price: 335.0,
            thumbnail:
              'https://static.goldengoose.com/image/upload/w_auto,c_scale,dpr_auto/v1632220753/Style/ECOMM/GJF00102.F001543-10593'
          }
        ],
        vendor: VENDOR_CODES.GOLDENGOOSE,
        emailId: payload.id
      });
    });

    it('should return order data with quantity handled', async () => {
      const updatedPayload = Object.assign({}, payload);

      let updatedBody = updatedPayload.decodedBody;

      updatedBody = updatedBody.replace(
        'padding-bottom: 0; padding-left: 0; padding-right: 0; padding-top: 0; text-align: center"></p>',
        'padding-bottom: 0; padding-left: 0; padding-right: 0; padding-top: 0; text-align: center">2</p>'
      );

      updatedPayload.decodedBody = updatedBody;

      const orderData = await GoldenGoose.parse(VENDOR_CODES.GOLDENGOOSE, updatedPayload);
      expect(orderData).to.be.deep.equal({
        orderRef: '00289986',
        orderDate: 1634083200000,
        products: [
          {
            name: 'Super-Star sneakers with painted star and lettering on the foxing (1)',
            price: 300.0,
            thumbnail:
              'https://static.goldengoose.com/image/upload/w_auto,c_scale,dpr_auto/v1605204751/Style/ECOMM/G36KS001-B42'
          },
          {
            name: 'Super-Star sneakers with painted star and lettering on the foxing (2)',
            price: 300.0,
            thumbnail:
              'https://static.goldengoose.com/image/upload/w_auto,c_scale,dpr_auto/v1605204751/Style/ECOMM/G36KS001-B42'
          },
          {
            name: 'White leather Super-Star sneakers with glittery heel tab',
            price: 335.0,
            thumbnail:
              'https://static.goldengoose.com/image/upload/w_auto,c_scale,dpr_auto/v1632220753/Style/ECOMM/GJF00102.F001543-10593'
          }
        ],
        vendor: VENDOR_CODES.GOLDENGOOSE,
        emailId: payload.id
      });
    });

    it('should throw error if contains lacking data', () => {
      const updatedPayload = Object.assign({}, payload);
      updatedPayload.decodedBody = '<body>Invalid Body</body>';
      expect(GoldenGoose.parse(VENDOR_CODES.GOLDENGOOSE, updatedPayload)).to.eventually.be.rejectedWith(Error);
    });
  });
});
