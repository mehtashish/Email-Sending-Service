const EmailService = require("./src/EmailService");

(async () => {
  const service = new EmailService();

  // const email = {
  //   id: "123",
  //   to: "test@example.com",
  //   subject: "Testing",
  //   body: "This is a test email.",
  // };

  // First attempt for sending email

  // const firstResult = await service.sendEmail(email);
  // console.log("Result:", firstResult);

  // Attempting second email send
  // This attempt will be skiped as the email is already sent

  // console.log("\nSending email again..");
  // const secondResult = await service.sendEmail(email);
  // console.log("Result:", secondResult);

  for (let i = 0; i < 5; i++) {
    const email = {
      id: `email-${i}`, // to avoid idempotency block
      to: "test@example.com",
      subject: `Testing`,
      body: `This is a test email.`,
    };

    const result = await service.sendEmail(email);
    console.log(`Attempt ${i + 1}:`, result);
    console.log();
  }

  console.log("\n ----- Status Log -----");
  console.log(service.getStatusLog());
})();