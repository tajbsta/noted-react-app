import { IVendor, IEmailPayload } from './models';
import { decodeRawBody } from './lib/helpers';
import emailParse from './lib/emailParse';

export default async function main(vendors: IVendor[], rawEmails: IEmailPayload[]) {
  const promises = [];

  for (let i = 0; i < rawEmails.length; i++) {
    const record: IEmailPayload = rawEmails[i];

    const decodedEmailBody = decodeRawBody(record.raw);

    record.decodedBody = decodedEmailBody;

    const vendor = vendors.find((vendor) => {
      const keywords = vendor.keyword.split(',');
      const found = !!keywords.find((keyword: any) => {
        const searchRegex = new RegExp(keyword, 'i');

        return searchRegex.test(decodedEmailBody);
      });

      return found;
    });

    if (vendor) {
      promises.push(emailParse(vendor.code, record));
    }
  }

  const result = await Promise.all(promises);

  return result;
}
