import AWS from 'aws-sdk';

import logging from 'modules/logging';

const log = logging('email');

export default class Email {
  /**
   * Initialize the email sender usign a given SES region and from address.
   *
   * @param {Object} options Object containing region and fromAddress properties
   */
  constructor({ region, fromAddress, simulate = false }) {
    AWS.config.update({ region });
    this.api = new AWS.SES({ apiVersion: '2010-12-01' });
    this.simulate = simulate;
    this.fromAddress = fromAddress;

    this.createActivationEmail = this.createActivationEmail.bind(this);
    this.sendMessage = this.sendMessage.bind(this);
  }

  /**
   * Create an email message intended for the specified destination
   * with the specified link.
   *
   * @param {string} destination To: email address
   * @param {string} url URL to link to for activation
   */
  createActivationEmail(destination, url) {
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

  /**
   * Send an email message.
   *
   * @param {object} message Message object (see AWS SDK)
   */
  async sendMessage(message) {
    try {
      if (this.simulate) {
        log.info('Simulated email message sent!');
      } else {
        return await this.api.sendEmail(message).promise();
      }
    } catch (error) {
      log.error(error);
    }
  }
}
