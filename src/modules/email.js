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

    this.createActivationMessage = this.createActivationMessage.bind(this);
    this.sendMessage = this.sendMessage.bind(this);
  }

  createActivationMessage(destination, code) {
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
            Data: `Your activation code is ${code}`
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
