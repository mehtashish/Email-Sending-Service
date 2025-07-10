# 📧 Resilient Email Sending Service (JavaScript)

---

## 📦 Folder Structure

- /src → Source code
  - /EmailService.js
  - /Provider1.js
  - /Provider2.js
  
- /test → Unit tests
  - /EmailService.test.js

- index.js → Entry/demo file to run the service
- package.json → Project metadata & scripts
- README.md → Project documentation
- .gitignore → Git ignore rules

---

## 🚀 Features Implemented

- **Retry logic with exponential backoff**  
  Retries failed, sends on the primary provider.

- **Fallback mechanism**  
  Switches to a second provider if the first continues to fail.

- **Idempotency**  
  Prevents sending the same email (by checking the unique `id`).

- **Rate limiting**  
  Limits the number of emails sent per small window to avoid spamming.

- **Status tracking**  
  Keeps a log of email attempts with status and timestamp.

- **Unit tests**  
  Tests cover successful send, fallback, idempotency, rate limiting, and logs.

---

## 🚀 Run locally

1️⃣ **Clone the repository**
```bash
git clone https://github.com/mehtashish/Email-Sending-Service.git
cd Email-Sending-Service
```

2️⃣ **Install dependencies**
```bash
npm install
```

▶ **Running the demo**
- Run the demo script:
```bash
npm start
```

*What happens:*
- Creates an EmailService instance
-Sends email(s)
- Shows console logs and results

🔲 *Server will run at:*
[http://localhost:3000](http://localhost:3000)

---

## 🧪 API Endpoints
- POST /email
  - Send an email.
  - Request body:
  ```json
  {
  "id": "1",
  "to": "test@example.com",
  "subject": "Testing",
  "body": "This is a test email."
  }
  ```

- 📊 **GET /status**
  - View status logs (history of all send attempts, provider used, success/failure, timestamp).

---

## ✅ Running Unit Tests
- Run tests:
```bash
npm test
```

*Uses Jest to:*
- Mock providers (simulate sending)
- Test key features: send, retry, fallback, idempotency, rate limiting, status tracking

---

## ✅ Deployed live on Render  
> **API Base URL:**  
> [https://email-sending-service-28gk.onrender.com](https://email-sending-service-28gk.onrender.com)

---

## 🧪 How to test features

| Feature        | How to test |
|----------------|-------------|
| Retry & fallback | Temporarily force `Provider1` to fail → POST /email and see it switch to `Provider2` |
| Idempotency | Send same email twice (same `id`) → second time returns `{ success: false, info: "Duplicate email" }` |
| Rate limiting | Send >3 emails quickly → see `{ success: false, error: "Rate limit exceeded" }` |
| Status tracking | GET `/status` → see list of all attempts with timestamp, success, provider |

---

## 🧰 How it works (high level)
- Tries the primary provider first.
- If it fails, it retries with exponential backoff (e.g., 1s → 2s).
- After retries, switches to the fallback provider.
- Uses Set to keep track of sent email IDs (idempotency).
- Implements simple rate limiting based on a small time window.
- Logs each attempt in a status log.

---

## 🛠 Technologies Used
- Node.js (JavaScript)
- Jest (testing framework)

---

## ✏ Ideas for future improvements
- Add a circuit breaker pattern
- Write logs to a file instead of console
- Add a simple queue system for high load
- Use real email providers instead of mocks
