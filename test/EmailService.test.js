const EmailService = require("../src/EmailService");

jest.mock("../src/Provider1", () => {
  return jest.fn().mockImplementation(() => ({
    send: jest.fn().mockResolvedValue("Sent by Provider1"),
  }));
});
jest.mock("../src/Provider2", () => {
  return jest.fn().mockImplementation(() => ({
    send: jest.fn().mockResolvedValue("Sent by Provider2"),
  }));
});

describe("EmailService tests", () => {
  let service;

  beforeEach(() => {
    service = new EmailService();
  });

  test("should send email successfully with first provider", async () => {
    const email = {
      id: "1",
      to: "test1@example.com",
      subject: "Test 1",
      body: "This is a test email.",
    };
    const res = await service.sendEmail(email);
    expect(res.success).toBe(true);
    expect(res.provider).toBe("First email provider");
  });

  test("should block duplicate email by idempotency", async () => {
    const email = {
      id: "2",
      to: "test2@example.com",
      subject: "Test 2",
      body: "This is a test email.",
    };
    await service.sendEmail(email); // first time, sends
    const res = await service.sendEmail(email); // second time will block
    expect(res.success).toBe(false);
    expect(res.info).toBe("Duplicate email");
  });

  test("should block emails after rate limit exceeded", async () => {
    // default rate limit: 3 emails per window
    const emails = [
      {
        id: "3",
        to: "test3@example.com",
        subject: "Test 3",
        body: "This is a test email.",
      },
      {
        id: "4",
        to: "test4@example.com",
        subject: "Test 4",
        body: "This is a test email.",
      },
      {
        id: "5",
        to: "test5@example.com",
        subject: "Test 5",
        body: "This is a test email.",
      },
      {
        id: "6",
        to: "test6@example.com",
        subject: "Test 6",
        body: "This is a test email.",
      },
    ];
    await service.sendEmail(emails[0]);
    await service.sendEmail(emails[1]);
    await service.sendEmail(emails[2]);
    const res = await service.sendEmail(emails[3]); // should exceed rate limit
    expect(res.success).toBe(false);
    expect(res.error).toBe("Rate limit exceeded");
  });

  test("should use fallback provider if first provider fails", async () => {
    // Override Provider1 to always fail in this test
    const Provider1 = require("../src/Provider1");
    Provider1.mockImplementation(() => ({
      send: jest.fn().mockRejectedValue(new Error("Provider1 failed")),
    }));

    service = new EmailService();
    const email = {
      id: "7",
      to: "test7@example.com",
      subject: "Test 7",
      body: "This is a test email.",
    };
    const res = await service.sendEmail(email);
    expect(res.success).toBe(true);
    expect(res.provider).toBe("Second email provider");
  });
});