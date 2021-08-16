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
import BedBathBeyond from '../src/lib/vendors/bedBathBeyond';

chai.use(chaiAsPromised);
moment.tz.setDefault('Etc/UTC');

const TEST_DATA_URL = 'https://noted-scrape-test.s3-us-west-2.amazonaws.com/BEDBATH&BEYOND.json';

describe('BedBathBeyond', () => {
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
      const orderData = await BedBathBeyond.parse(VENDOR_CODES.BEDBATHBEYOND, payload);
      expect(orderData).to.be.deep.equal({
        orderRef: 'BBB6452789750',
        orderDate: 1570924800000,
        products: [
          {
            name: 'Cambria® Classic Complete® Clip Rings in Satin White (Set of 7)',
            thumbnail: 'https://s7d9.scene7.com/is/image/BedBathandBeyond/35188840795461p?$146$',
            price: 9.99
          },
          {
            name: 'Cambria® Classic Complete® Fractured Facets Finial in White (Set of 2)',
            thumbnail: 'https://s7d9.scene7.com/is/image/BedBathandBeyond/115466860322999p?$146$',
            price: 14.99
          },
          {
            name: 'Cambria® Classic Complete® Decorative 28-Inch - 48-Inch Drapery Rod in Satin White',
            thumbnail: 'https://s7d9.scene7.com/is/image/BedBathandBeyond/35187940795379p?$146$',
            price: 15.99
          },
          {
            name: 'Malden® Urban Loft 8-Inch x 10-Inch Matted Wood Photo Frame in Grey (1)',
            thumbnail: 'https://s7d9.scene7.com/is/image/BedBathandBeyond/201780965661499p?$146$',
            price: 14.99
          },
          {
            name: 'Malden® Urban Loft 8-Inch x 10-Inch Matted Wood Photo Frame in Grey (2)',
            thumbnail: 'https://s7d9.scene7.com/is/image/BedBathandBeyond/201780965661499p?$146$',
            price: 14.99
          },
          {
            name: 'Malden® Urban Loft 8-Inch x 10-Inch Matted Wood Photo Frame in Grey (3)',
            thumbnail: 'https://s7d9.scene7.com/is/image/BedBathandBeyond/201780965661499p?$146$',
            price: 14.99
          },
          {
            name: 'Malden® Urban Loft 8-Inch x 10-Inch Matted Wood Photo Frame in Grey (4)',
            thumbnail: 'https://s7d9.scene7.com/is/image/BedBathandBeyond/201780965661499p?$146$',
            price: 14.99
          },
          {
            name: 'Malden® Urban Loft 8-Inch x 10-Inch Matted Wood Photo Frame in Grey (5)',
            thumbnail: 'https://s7d9.scene7.com/is/image/BedBathandBeyond/201780965661499p?$146$',
            price: 14.99
          },
          {
            name: 'Malden® Urban Loft 8-Inch x 10-Inch Matted Wood Photo Frame in Grey (6)',
            thumbnail: 'https://s7d9.scene7.com/is/image/BedBathandBeyond/201780965661499p?$146$',
            price: 14.99
          }
        ],
        vendor: VENDOR_CODES.BEDBATHBEYOND,
        emailId: '16dc558f998e086b'
      });
    });

    it('should return order data with quantity handled', async () => {
      const updatedPayload = Object.assign({}, payload);
      let updatedBody = updatedPayload.decodedBody;

      updatedBody = updatedBody.replace(
        `style="font-family:arial;font-size:12px;line-height:15px;color:#666;">1`,
        `style="font-family:arial;font-size:12px;line-height:15px;color:#666;">2`
      );

      updatedPayload.decodedBody = updatedBody;

      const orderData = await BedBathBeyond.parse(VENDOR_CODES.BEDBATHBEYOND, updatedPayload);
      expect(orderData).to.be.deep.equal({
        orderRef: 'BBB6452789750',
        orderDate: 1570924800000,
        products: [
          {
            name: 'Cambria® Classic Complete® Clip Rings in Satin White (Set of 7) (1)',
            thumbnail: 'https://s7d9.scene7.com/is/image/BedBathandBeyond/35188840795461p?$146$',
            price: 9.99
          },
          {
            name: 'Cambria® Classic Complete® Clip Rings in Satin White (Set of 7) (2)',
            thumbnail: 'https://s7d9.scene7.com/is/image/BedBathandBeyond/35188840795461p?$146$',
            price: 9.99
          },
          {
            name: 'Cambria® Classic Complete® Fractured Facets Finial in White (Set of 2)',
            thumbnail: 'https://s7d9.scene7.com/is/image/BedBathandBeyond/115466860322999p?$146$',
            price: 14.99
          },
          {
            name: 'Cambria® Classic Complete® Decorative 28-Inch - 48-Inch Drapery Rod in Satin White',
            thumbnail: 'https://s7d9.scene7.com/is/image/BedBathandBeyond/35187940795379p?$146$',
            price: 15.99
          },
          {
            name: 'Malden® Urban Loft 8-Inch x 10-Inch Matted Wood Photo Frame in Grey (1)',
            thumbnail: 'https://s7d9.scene7.com/is/image/BedBathandBeyond/201780965661499p?$146$',
            price: 14.99
          },
          {
            name: 'Malden® Urban Loft 8-Inch x 10-Inch Matted Wood Photo Frame in Grey (2)',
            thumbnail: 'https://s7d9.scene7.com/is/image/BedBathandBeyond/201780965661499p?$146$',
            price: 14.99
          },
          {
            name: 'Malden® Urban Loft 8-Inch x 10-Inch Matted Wood Photo Frame in Grey (3)',
            thumbnail: 'https://s7d9.scene7.com/is/image/BedBathandBeyond/201780965661499p?$146$',
            price: 14.99
          },
          {
            name: 'Malden® Urban Loft 8-Inch x 10-Inch Matted Wood Photo Frame in Grey (4)',
            thumbnail: 'https://s7d9.scene7.com/is/image/BedBathandBeyond/201780965661499p?$146$',
            price: 14.99
          },
          {
            name: 'Malden® Urban Loft 8-Inch x 10-Inch Matted Wood Photo Frame in Grey (5)',
            thumbnail: 'https://s7d9.scene7.com/is/image/BedBathandBeyond/201780965661499p?$146$',
            price: 14.99
          },
          {
            name: 'Malden® Urban Loft 8-Inch x 10-Inch Matted Wood Photo Frame in Grey (6)',
            thumbnail: 'https://s7d9.scene7.com/is/image/BedBathandBeyond/201780965661499p?$146$',
            price: 14.99
          }
        ],
        vendor: VENDOR_CODES.BEDBATHBEYOND,
        emailId: '16dc558f998e086b'
      });
    });

    it('should throw error if contains lacking data', () => {
      const updatedPayload = Object.assign({}, payload);
      updatedPayload.decodedBody = '<body>Invalid Body</body>';
      expect(BedBathBeyond.parse(VENDOR_CODES.BEDBATHBEYOND, updatedPayload)).to.eventually.be.rejectedWith(Error);
    });
  });
});
