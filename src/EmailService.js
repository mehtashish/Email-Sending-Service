const firstProvider = require("./Provider1");
const secondProvider = require("./Provider2");

class EmailService {
  constructor() {
    this.primaryProvider = new firstProvider();
    this.fallbackProvider = new secondProvider();
  }

  async sendEmail(email) {
    try {
      await this.primaryProvider.send(email);
      console.log(`Email sent using first provider to ${email.to}.`);
      return {
        success: true,
        provider: "First email provider",
        error: null,
      };
    } catch (err) {
      console.error(`${err.message}`);
      try {
        await this.fallbackProvider.send(email);
        console.log(`Email sent using second provider to ${email.to}.`);
        return {
          success: true,
          provider: "Second email provider",
          error: null,
        };
      } catch (err) {
        console.error(`${err.message}`);
        return {
          success: false,
          provider: null,
          error: "Both email providers failed!",
        };
      }
    }
  }
}

module.exports = EmailService;