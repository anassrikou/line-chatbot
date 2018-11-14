module.exports = class BOT {
  constructor(userId) {
    this.id = userId;
    this.i = 0;
    this.registration = false;
    this.answers = [];
    this.info = null;
  }

  inc() {
    this.i++;
  }
  
  start() {
    this.registration = true;
  }

  reset() {
    this.i = 0;
    this.registration = false;
    this.answers.length = 0;
  }
}