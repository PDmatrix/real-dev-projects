const Async = {
  sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  },

  delay(promise, ms) {
    return this.sleep(ms).then(_ => promise);
  },
};

const Time = {
  getTimestamp() {
    return new Date().getTime() / 1000;
  },
};

module.exports = {
  Time,
};
