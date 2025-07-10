const express = require("express");
const EmailService = require("./src/EmailService");

// (async () => {
//   const service = new EmailService();

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

//   for (let i = 0; i < 5; i++) {
//     const email = {
//       id: `email-${i}`, // to avoid idempotency block
//       to: "test@example.com",
//       subject: `Testing`,
//       body: `This is a test email.`,
//     };

//     const result = await service.sendEmail(email);
//     console.log(`Attempt ${i + 1}:`, result);
//     console.log();
//   }

//   console.log("\n ----- Status Log -----");
//   console.log(service.getStatusLog());
// })();

const app = express();
const PORT = 3000;

const service = new EmailService();
app.use(express.json());

app.get("/", (req, res) => {
  res.status(200).send("Email sending service is running!");
});

app.get("/status", (req, res) => {
  res.json(service.getStatusLog());
});

app.post("/email", async (req, res) => {
  const email = req.body;

  try {
    const result = await service.sendEmail(email);
    res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});