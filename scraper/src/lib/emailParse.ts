import * as log from './logger';
import { VENDOR_CODES } from '../constants';
import {
  Abercrombie,
  Adidas,
  Aerie,
  BedBathBeyond,
  Belk,
  BrooksBrothers,
  CalvinKlein,
  Carters,
  Chicos,
  Converse,
  Express,
  FashionNova,
  FinishLine,
  FootLocker,
  FreePeople,
  GAP,
  Lululemon,
  Nordstrom
} from './vendors';
import { OrderData, IEmailPayload } from '../models';

const parse = async (code: string, payload: IEmailPayload): Promise<OrderData | undefined> => {
  try {
    let orderData: OrderData | undefined;

    switch (code) {
      case VENDOR_CODES.NORDSTROM:
        orderData = await Nordstrom.parse(code, payload);
        break;
      case VENDOR_CODES.LULULEMON:
        orderData = await Lululemon.parse(code, payload);
        break;
      case VENDOR_CODES.ABERCROMBIE:
        orderData = await Abercrombie.parse(code, payload);
        break;
      case VENDOR_CODES.ADIDAS:
        orderData = await Adidas.parse(code, payload);
        break;
      case VENDOR_CODES.AERIE:
        orderData = await Aerie.parse(code, payload);
        break;
      case VENDOR_CODES.BEDBATHBEYOND:
        orderData = await BedBathBeyond.parse(code, payload);
        break;
      case VENDOR_CODES.BELK:
        orderData = await Belk.parse(code, payload);
        break;
      case VENDOR_CODES.BROOKSBROTHERS:
        orderData = await BrooksBrothers.parse(code, payload);
        break;
      case VENDOR_CODES.CALVINKLEIN:
        orderData = await CalvinKlein.parse(code, payload);
        break;
      case VENDOR_CODES.CARTERS:
        orderData = await Carters.parse(code, payload);
        break;
      case VENDOR_CODES.CHICOS:
        orderData = await Chicos.parse(code, payload);
        break;
      case VENDOR_CODES.CONVERSE:
        orderData = await Converse.parse(code, payload);
        break;
      case VENDOR_CODES.EXPRESS:
        orderData = await Express.parse(code, payload);
        break;
      case VENDOR_CODES.FASHIONNOVA:
        orderData = await FashionNova.parse(code, payload);
        break;
      case VENDOR_CODES.FINISHLINE:
        orderData = await FinishLine.parse(code, payload);
        break;
      case VENDOR_CODES.FOOTLOCKER:
        orderData = await FootLocker.parse(code, payload);
        break;
      case VENDOR_CODES.FREEPEOPLE:
        orderData = await FreePeople.parse(code, payload);
        break;
      case VENDOR_CODES.GAP:
        orderData = await GAP.parse(code, payload);
        break;
      default:
        break;
    }

    return orderData;
  } catch (error) {
    log.info({
      message: error.message,
      code
    });
  }
};

export default parse;
