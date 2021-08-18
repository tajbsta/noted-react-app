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
  const chunkMessages = _.chunk(messageIds, 50);

  const batchResponses = [];

  chunkMessages.forEach(async (ids) => {
    const batch = gapi.current.client.newBatch();
    ids.forEach((id) => {
      const getEmail = gapi.current.client.gmail.users.messages.get({
        userId: 'me',
        id,
        format: 'full',
        fields: 'id,payload,internalDate,sizeEstimate',
      });
      batch.add(getEmail);
    });
    batchResponses.push(batch);
  });

  const finalResponses = [];

  for (let i = 0; i < batchResponses.length; i++) {
    const val = await batchResponses[i];
    finalResponses.push(val);
  }

  let emails = [];
  for (const res of finalResponses) {
    const batchRes = res;

    let responses = Object.values(batchRes.result);
    responses = responses.filter((response) => response.status === 200);

    emails = emails.concat(
      responses.map((x) => {
        let htmlPart;

        const mimeType = x.result.payload.mimeType;

        // If not multipart use the first level part
        if (!mimeType.includes('multipart/')) {
          htmlPart = x.result.payload;
        } else {
          // Dig all through the message parts to get mimeType text/html part

          let done = false;
          let parts = x.result.payload.parts || [];
          let part;

          do {
            part = parts.find((part) => part.mimeType === 'text/html');

            if (part) {
              htmlPart = part;
              done = true;
            } else {
              const nextPart = parts.find((part) =>
                part.mimeType.includes('multipart/')
              );
              parts = nextPart && nextPart.parts ? nextPart.parts : [];
            }
          } while (!done && parts.length > 0);
        }

        const raw = htmlPart ? htmlPart.body.data : '';
        return {
          id: x.result.id,
          internalDate: x.result.internalDate,
          sizeEstimate: x.result.sizeEstimate,
          raw,
        };
      })
    );
  }

  return emails;
};
