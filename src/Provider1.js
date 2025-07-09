class Provider1 {
  async send(email) {
    if (Math.random() < 0.6) {
      return true;
    } else {
      throw new Error("First provider failed.");
    }
  }
}

module.exports = Provider1;