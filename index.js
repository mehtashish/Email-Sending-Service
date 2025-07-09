const EmailService = require("./src/EmailService");

(async () => {
  const service = new EmailService();

  const email = {
    to: "test@example.com",
    subject: "Testing",
    body: "This is a test email.",
  };

  const result = await service.sendEmail(email);
  console.log("Final result:", result);
})();