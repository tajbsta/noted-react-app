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
import GNCLiveWell from '../src/lib/vendors/gncLiveWell';

chai.use(chaiAsPromised);
moment.tz.setDefault('Etc/UTC');

const TEST_DATA_URL = 'https://noted-scrape-test.s3.us-west-2.amazonaws.com/GNCLIVEWELL.json';

describe(`GNC Live Well`, () => {
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
      const orderData = await GNCLiveWell.parse(VENDOR_CODES.GNCLIVEWELL, payload);
      expect(orderData).to.be.deep.equal({
        orderRef: '200007411588',
        orderDate: 1634601600000,
        products: [
          {
            name: 'WHEY2GO Funnel - Batman (1)',
            price: 4.99,
            thumbnail:
              'https://www.gnc.com/dw/image/v2/BBLB_PRD/on/demandware.static/-/Sites-master-catalog-gnc/default/dw09b185cb/hi-res/469781_web_SmartShake_Whey2Go_Funnel_Batman.jpg?sw=350&sh=350&sm=fit'
          },
          {
            name: 'WHEY2GO Funnel - Batman (2)',
            price: 4.99,
            thumbnail:
              'https://www.gnc.com/dw/image/v2/BBLB_PRD/on/demandware.static/-/Sites-master-catalog-gnc/default/dw09b185cb/hi-res/469781_web_SmartShake_Whey2Go_Funnel_Batman.jpg?sw=350&sh=350&sm=fit'
          },
          {
            name: 'Aug PRO Box Generic v4',
            price: 15.0,
            thumbnail:
              'https://www.gnc.com/dw/image/v2/BBLB_PRD/on/demandware.static/-/Sites-master-catalog-gnc/default/dw11f22a2a/hi-res/PROBox_2021_All%20Goals.jpg?sw=350&sh=350&sm=fit'
          },
          {
            name: 'QUEST BOX PUMPKIN PIE BOX',
            price: 29.99,
            thumbnail:
              'https://www.gnc.com/dw/image/v2/BBLB_PRD/on/demandware.static/-/Sites-master-catalog-gnc/default/dw615cd35c/hi-res/476659_web_Quest%20Protein%20Bar%20Pumpkin%20Pie_Front_Box.jpg?sw=350&sh=350&sm=fit'
          }
        ],
        vendor: VENDOR_CODES.GNCLIVEWELL,
        emailId: payload.id
      });
    });

    it('should return order data with quantity handled', async () => {
      const updatedPayload = Object.assign({}, payload);

      const orderData = await GNCLiveWell.parse(VENDOR_CODES.GNCLIVEWELL, updatedPayload);
      expect(orderData).to.be.deep.equal({
        orderRef: '200007411588',
        orderDate: 1634601600000,
        products: [
          {
            name: 'WHEY2GO Funnel - Batman (1)',
            price: 4.99,
            thumbnail:
              'https://www.gnc.com/dw/image/v2/BBLB_PRD/on/demandware.static/-/Sites-master-catalog-gnc/default/dw09b185cb/hi-res/469781_web_SmartShake_Whey2Go_Funnel_Batman.jpg?sw=350&sh=350&sm=fit'
          },
          {
            name: 'WHEY2GO Funnel - Batman (2)',
            price: 4.99,
            thumbnail:
              'https://www.gnc.com/dw/image/v2/BBLB_PRD/on/demandware.static/-/Sites-master-catalog-gnc/default/dw09b185cb/hi-res/469781_web_SmartShake_Whey2Go_Funnel_Batman.jpg?sw=350&sh=350&sm=fit'
          },
          {
            name: 'Aug PRO Box Generic v4',
            price: 15.0,
            thumbnail:
              'https://www.gnc.com/dw/image/v2/BBLB_PRD/on/demandware.static/-/Sites-master-catalog-gnc/default/dw11f22a2a/hi-res/PROBox_2021_All%20Goals.jpg?sw=350&sh=350&sm=fit'
          },
          {
            name: 'QUEST BOX PUMPKIN PIE BOX',
            price: 29.99,
            thumbnail:
              'https://www.gnc.com/dw/image/v2/BBLB_PRD/on/demandware.static/-/Sites-master-catalog-gnc/default/dw615cd35c/hi-res/476659_web_Quest%20Protein%20Bar%20Pumpkin%20Pie_Front_Box.jpg?sw=350&sh=350&sm=fit'
          }
        ],
        vendor: VENDOR_CODES.GNCLIVEWELL,
        emailId: payload.id
      });
    });

    it('should throw error if contains lacking data', () => {
      const updatedPayload = Object.assign({}, payload);
      updatedPayload.decodedBody = '<body>Invalid Body</body>';
      expect(GNCLiveWell.parse(VENDOR_CODES.GNCLIVEWELL, updatedPayload)).to.eventually.be.rejectedWith(Error);
    });
  });
});
