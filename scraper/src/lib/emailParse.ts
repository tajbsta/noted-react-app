import * as log from './logger';
import { VENDOR_CODES } from '../constants';
import { Nordstrom } from './vendors';
import { OrderData, IEmailPayload } from '../models';

const parse = async (code: string, payload: IEmailPayload): Promise<OrderData | undefined> => {
  try {
    let orderData: OrderData | undefined;

    switch (code) {
      case VENDOR_CODES.NORDSTROM:
        orderData = await Nordstrom.parse(code, payload);
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
