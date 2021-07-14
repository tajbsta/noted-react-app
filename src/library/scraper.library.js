import * as _ from 'lodash/array';
/**
 *
 * @param {string} email
 * @returns boolean
 */
const validateEmail = (email = '') => {
  /* eslint-disable no-useless-escape */
  const tester = /^[-!#$%&'*+\/0-9=?A-Z^_a-z`{|}~](\.?[-!#$%&'*+\/0-9=?A-Z^_a-z`{|}~])*@[a-zA-Z0-9](-*\.?[a-zA-Z0-9])*\.[a-zA-Z](-?[a-zA-Z0-9])+$/;

  return tester.test(email);
};

/**
 * GET VENDORS FROM EMAILS
 * @param {Array} vendors
 * @returns {Array} emails - From Emails for vendors
 */
export const getVendorsFromEmail = (vendors) => {
  const emails = [];
  vendors.forEach((vendor) => {
    const fromEmails = (vendor.from_emails || '').split(',');
    fromEmails.forEach((x) => {
      const email = x.trim();
      if (validateEmail(email)) {
        emails.push(email);
      }
    });
  });

  return emails;
};

/**BUILD EMAIL QUERY
 * @param {Object} initialQuery
 * @param {Array<string>} initialQuery.from
 * @param {string} initialQuery.before
 * @param {string} initialQuery.after
 * @returns queryString<string>
 *
 */
export const buildEmailQuery = (initialQuery) => {
  const query = [];
  if (initialQuery.from) {
    initialQuery.from.forEach((from) => {
      query.push([`from:${from}`]);
    });
  }
  const queryString = query
    .map((conditions) =>
      conditions.length > 1
        ? `(${conditions.join(' AND ')})`
        : `${conditions[0]}`
    )
    .join(' OR ');

  const before = initialQuery.before;
  const after = initialQuery.after;

  return `before:${before} after:${after} (${queryString})`;
};

/**
 * FETCH ACCOUNT EMAILS
 * @param {string} q
 * @param {Object} gapi - Google API attached to window object
 * @returns {Promise<Array<string>>} emails
 */
export const getAccountMessages = async (q, gapi) => {
  let messages = [];
  let nextPageToken = '';

  while (nextPageToken !== undefined) {
    const response = await gapi.current.client.gmail.users.messages.list({
      userId: 'me',
      maxResults: 500,
      q,
      pageToken: nextPageToken,
    });

    messages =
      response.result.resultSizeEstimate > 0
        ? messages.concat(response.result.messages)
        : messages;
    nextPageToken = response.result.nextPageToken || undefined;
  }

  const messageIds = messages.map((x) => x.id);

  const emails = await convertMessagesToEmails(messageIds, gapi);
  return emails;
};

/**
 * CONVERT MESSAGES TO EMAILS
 * @param {Array<string>} messageIds
 * @param {Object} gapi - Google API attached to window object
 */
export const convertMessagesToEmails = async (messageIds, gapi) => {
  const chunkMessages = _.chunk(messageIds, 100);

  const batchResponses = await Promise.all(
    chunkMessages.map(async (ids) => {
      const batch = gapi.current.client.newBatch();
      ids.forEach((id) => {
        const getEmail = gapi.current.client.gmail.users.messages.get({
          userId: 'me',
          id,
          format: 'raw',
        });
        batch.add(getEmail);
      });
      const res = await batch;
      return res;
    })
  );

  const emails = [];
  for (const batchRes of batchResponses) {
    Object.values(batchRes.result).forEach((res) => {
      const rawEmail = {
        raw: res.result.raw,
        internalDate: res.result.internalDate,
        // id: res.result.id,
        // sizeEstimate: res.result.sizeEstimate,
      };
      emails.push(rawEmail);
    });
  }

  return emails;
};
