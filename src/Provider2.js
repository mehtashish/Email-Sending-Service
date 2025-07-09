class Provider2 {
  async send(email) {
    if (Math.random() < 0.8) {
      return true;
    } else {
      throw new Error("Email Provider 2 also failed!");
    }
  }
}

module.exports = Provider2;