import AWS from 'aws-sdk';

import loggers from './logging';

const log = loggers('email');

export default class Email {
  /**
   * Initialize the email sender usign a given SES region and from address.
   *
   * @param {Object} options Object containing region and fromAddress properties
   */
  constructor({ region, fromAddress }) {
    AWS.config.update({ region });
    this.api = new AWS.SES({ apiVersion: '2010-12-01' });
    this.fromAddress = fromAddress;

    this.sendActivationEmail = this.sendActivationEmail.bind(this);
    this.sendMessage = this.sendMessage.bind(this);
  }

  /**
   * Send an email to the specified destination with the specified link.
   *
   * @param {string} destination To: email address
   * @param {string} url URL to link to for activation
   */
  sendActivationEmail(destination, url) {
    return {
      Destination: {
        ToAddresses: [destination]
      },
      Message: {
        Subject: {
          Charset: 'UTF-8',
          Data: 'Mixnjuice Account Confirmation'
        },
        Body: {
          Text: {
            Charset: 'UTF-8',
            Data: `Please go to ${url} to confirm your account.`
          }
        }
      },
      Source: this.fromAddress
    };
  }

  async sendMessage(message) {
    try {
      const send = this.api.sendEmail(message).promise();

      return await send;
    } catch (error) {
      log.error(error);
    }
  }
}
