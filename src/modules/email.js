import AWS from 'aws-sdk';

export default class Email {
  constructor(options) {
    AWS.config.update({ region: options.region });
    this.api = new AWS.SES({ apiVersion: '2010-12-01' });
    this.fromAddress = options.fromAddress;

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
    const send = this.api.sendEmail(message).promise();

    return await send;
  }
}
