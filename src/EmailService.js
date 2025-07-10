const firstProvider = require("./Provider1");
const secondProvider = require("./Provider2");

class EmailService {
  constructor() {
    this.primaryProvider = new firstProvider();
    this.fallbackProvider = new secondProvider();
    this.idempotencyCheck = new Set();
    this.emailsPerWindow = 3;
    this.windowSize = 3 * 1000;
    this.rateLimit = {
      count: 0,
      windowStart: Date.now(),
    };
    this.statusLog = [];
  }

  // to get all status logs
  getStatusLog() {
    return this.statusLog;
  }

  async sendEmail(email) {
    if (this.idempotencyCheck.has(email.id)) {
      console.log("Email already sent!");
      this.statusLog.push({
        emailId: email.id,
        time: new Date(),
        success: false,
        provider: null,
        error: "Duplicate email",
      });
      return {
        success: false,
        provider: null,
        info: "Duplicate email",
      };
    }

    const now = Date.now();
    if (now - this.rateLimit.windowStart >= this.windowSize) {
      this.rateLimit.windowStart = now;
      this.rateLimit.count = 0;
    }
    if (this.rateLimit.count >= this.emailsPerWindow) {
      console.log("Rate limit exceeded! Try after some time.");
      this.statusLog.push({
        emailId: email.id,
        time: new Date(),
        success: false,
        provider: null,
        error: "Rate limit exceeded",
      });
      return {
        success: false,
        provider: null,
        error: "Rate limit exceeded",
      };
    }

    this.rateLimit.count++;

    let result = {
      success: false,
      provider: null,
      error: null,
    };

    let retries = 0;
    function sleep(ms) {
      return new Promise((resolve) => setTimeout(resolve, ms));
    }

    for (retries = 0; retries < 2; retries++) {
      try {
        await this.primaryProvider.send(email);
        console.log(`Email sent using first provider to ${email.to}.`);
        result = {
          success: true,
          provider: "First email provider",
          error: null,
        };
        this.statusLog.push({
          emailId: email.id,
          time: new Date(),
          success: true,
          provider: "First email provider",
          error: null,
        });
        this.idempotencyCheck.add(email.id);
        return result;
      } catch (err) {
        console.log(`Retry attempt ${retries + 1} failed on provider 1..`);
        await sleep(1000 * Math.pow(2, retries));
      }
    }
    try {
      await this.fallbackProvider.send(email);
      console.log(`Email sent using second provider to ${email.to}.`);
      result = {
        success: true,
        provider: "Second email provider",
        error: null,
      };
      this.statusLog.push({
        emailId: email.id,
        time: new Date(),
        success: true,
        provider: "Second email provider",
        error: null,
      });
    } catch (err) {
      console.error(`${err.message}`);
      result = {
        success: false,
        provider: null,
        error: "Both email providers failed!",
      };
      this.statusLog.push({
        emailId: email.id,
        time: new Date(),
        success: false,
        provider: null,
        error: "Both email providers failed!",
      });
    }

    this.idempotencyCheck.add(email.id);
    return result;
  }
}

module.exports = EmailService;