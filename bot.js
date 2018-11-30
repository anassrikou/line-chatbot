
const User = require('./models/users');

module.exports = class BOT {
  constructor(userId) {
    this.id = userId;
    this.index = 0;
    this.registration = false;
    this.answers = {};
    this.info = null;
    this.has_multiple_events = false;
    this.user_last_message_time = 0;
  }

  nextQuestion() {
    this.index++;
  }
  
  startRegistrationProcess() {
    this.registration = true;
  }

  goToAttendDate() {
    this.has_multiple_events = true;
    this.index = 5;
  }

  reset() {
    this.index = 0;
    this.registration = false;
    this.answers.length = 0;
    this.has_multiple_events = false;
  }
}