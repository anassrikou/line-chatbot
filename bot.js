
const User = require('./models/users');

module.exports = class BOT {
  constructor(userId) {
    this.id = userId;
    this.index = 0;
    this.registration = false;
    this.answers = [];
    this.info = null;
    this.has_multiple_events = false;
  }

  nextQuestion() {
    this.index++;
  }
  
  startRegistrationProcess() {
    this.registration = true;
  }

  backToAttendDate() {
    this.index = 5;
  }

  reset() {
    this.index = 0;
    this.registration = false;
    this.answers.length = 0;
  }
}