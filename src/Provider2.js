class Provider2 {
  async send(email) {
    if (Math.random() < 0.8) {
      return true;
    } else {
      throw new Error("Second provider failed.");
    }
  }
}

module.exports = Provider2;