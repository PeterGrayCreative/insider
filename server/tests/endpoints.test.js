// const mongoose = require('mongoose');

require('dotenv').config();
const chai = require('chai');
const chaihttp = require('chai-http');
const server = require('../app');

const { expect } = chai;
// const sinon = require('sinon');
chai.use(chaihttp);

describe('GET to /api/recent_messages', () => {
  it('should return the most recent messages', (done) => {
    chai
      .request(server)
      .get('/api/recent_messages')
      .end((err, res) => {
        if (err) {
          console.error(err);
          done();
        }
        expect(res.status).to.equal(200);
        expect(res.body.length).to.be.above(0);
        expect(res.body).to.be.an.instanceof(Array);
        res.body.forEach((message) => {
          expect(message).to.have.property('timestamp');
          expect(message).to.have.property('message');
          // Add more expects here
        });
      });
    done();
  });
});

// Requests account information from API
describe('POST to /api/account', () => {
  it('should return account information', (done) => {
    const user = {
      token: 'token here',
      email: 'email@email.com',
    };
    chai
      .request(server)
      .POST('/api/account')
      .send(user)
      .end((err, res) => {
        if (err) {
          console.error(err);
          done();
        }
        expect(res.status).to.equal(200);
        expect(res.body.username.length).to.be.above(0);
        expect(res.body.accountID).to.equal('12345');
        expect(res.body.cc).to.equal('1111');
      });
    done();
  });
  it('should return a server error', (done) => {
    const user = {
      token: '',
      email: 'email@email.com',
    };
    chai
      .request(server)
      .POST('/api/account')
      .send(user)
      .end((err, res) => {
        if (err) {
          console.error(err);
          done();
        }
        expect(res.status).to.equal(400);
        expect(res.body.error.length).to.be.above(0);
      });
    done();
  });
});

// Sends from an account with a CC on file, CC is stored on Stripe.
describe('POST to /api/send-from-account', () => {
  it('should return the most recent messages', (done) => {
    const message = {
      email: 'email@email.com',
      to: process.env.TWILIO_DEST,
      content: 'Hello',
    };
    chai
      .request(server)
      .POST('/api/send-from-account')
      .send(message)
      .end((err, res) => {
        if (err) {
          console.error(err);
          done();
        }
        expect(res.status).to.equal(200);
        expect(res.body.username.length).to.be.above(0);
        expect(res.body.accountID).to.equal('12345');
        expect(res.body.cc).to.equal('1111');
      });
    done();
  });
});

describe('POST to /api/send', () => {
  // Stripe elements will send a token, destination phone #, and a message
  it('should send a message to the recipient', (done) => {
    const user = {
      token: 'stripe token',
      to: process.env.TWILIO_DEST,
      content: 'Hello',
    };
    chai
      .request(server)
      .POST('/api/send')
      .send(user)
      .end((err, res) => {
        if (err) {
          console.error(err);
          done();
        }
        expect(res.status).to.equal(200);
        expect(res.body).to.contain('success');
      });
    done();
  });
  // If token fails to get created
  it('should fail to send a message', (done) => {
    const user = {
      token: '',
      to: process.env.TWILIO_DEST,
      content: 'Hello',
    };
    chai
      .request(server)
      .POST('/api/send')
      .send(user)
      .end((err, res) => {
        if (err) {
          console.error(err);
          done();
        }
        expect(res.status).to.equal(500);
        expect(res.body).to.contain('success');
      });
    done();
  });
});

describe('POST to /api/login', () => {
  it('should login a user and return a token', (done) => {
    const user = {
      email: 'email@email.com',
      password: 12345,
    };
    chai
      .request(server)
      .POST('/api/login')
      .send(user)
      .end((err, res) => {
        if (err) {
          console.error(err);
          done();
        }
        expect(res.status).to.equal(200);
        expect(res.body.token.length).to.be.above(0);
      });
    done();
  });
  // Sending an incorrect password
  it('should send back a bad password error', (done) => {
    const user = {
      email: 'email@email.com',
      password: 54321,
    };
    chai
      .request(server)
      .POST('/api/login')
      .send(user)
      .end((err, res) => {
        if (err) {
          console.error(err);
          done();
        }
        expect(res.status).to.equal(400);
        expect(res.body).to.have.property('error');
      });
    done();
  });
});

describe('POST to /api/signup', () => {
  it('should sign up a new user', (done) => {
    const user = {
      email: 'newEmail@email.com',
      password: 12345,
    };
    chai
      .request(server)
      .POST('/api/signup')
      .send(user)
      .end((err, res) => {
        if (err) {
          console.error(err);
          done();
        }
        expect(res.status).to.equal(200);
        expect(res.body).to.have.property('success');
      });
    done();
  });
  it('should return a signup error', (done) => {
    const user = {
      email: 'newEmailemail.com',
      password: 12345,
    };
    chai
      .request(server)
      .POST('/api/signup')
      .send(user)
      .end((err, res) => {
        if (err) {
          console.error(err);
          done();
        }
        expect(res.status).to.equal(400);
        expect(res.body).to.have.property('error');
      });
    done();
  });
});

describe('POST to /api/reset-password', () => {
  it("should reset a user's password", (done) => {
    const user = {
      email: 'Email@email.com',
      newPassword: '!12345',
      token: 'token',
    };
    chai
      .request(server)
      .POST('/api/reset-password')
      .send(user)
      .end((err, res) => {
        if (err) {
          console.error(err);
          done();
        }
        expect(res.status).to.equal(200);
        expect(res.body).to.have.property('success');
      });
    done();
  });
  // Should return an error because the email address is improperly formatted
  it('should retrn a reset password error', (done) => {
    const user = {
      email: 'newEmailemail.com',
      password: '12345',
      token: 'token',
    };
    chai
      .request(server)
      .POST('/api/reset-password')
      .send(user)
      .end((err, res) => {
        if (err) {
          console.error(err);
          done();
        }
        expect(res.status).to.equal(400);
        expect(res.body).to.have.property('error');
      });
    done();
  });
});

describe('POST to /api/update-payment', () => {
  it('should send new payment info to Stripe', (done) => {
    const user = {
      email: 'Email@email.com',
      stripeToken: '12345',
      token: 'JWT token',
    };
    chai
      .request(server)
      .POST('/api/reset-password')
      .send(user)
      .end((err, res) => {
        if (err) {
          console.error(err);
          done();
        }
        expect(res.status).to.equal(200);
        expect(res.body).to.have.property('success');
      });
    done();
  });
  // Should return an error because the email address is improperly formatted
  it('should return an error', (done) => {
    const user = {
      email: 'Email@email.com',
      stripeToken: '12345',
      token: 'Expired token',
    };
    chai
      .request(server)
      .POST('/api/reset-password')
      .send(user)
      .end((err, res) => {
        if (err) {
          console.error(err);
          done();
        }
        expect(res.status).to.equal(401);
        expect(res.body).to.have.property('error');
      });
    done();
  });
});

describe('POST to /api/logout', () => {
  // Invalidates a token
  it('should logout a user', (done) => {
    const user = {
      email: 'Email@email.com',
      token: 'JWT token',
    };
    chai
      .request(server)
      .POST('/api/reset-password')
      .send(user)
      .end((err, res) => {
        if (err) {
          console.error(err);
          done();
        }
        expect(res.status).to.equal(200);
        expect(res.body).to.have.property('success');
      });
    done();
  });
  // Logout gets hit, but no user is logged in
  it('should logout a user', (done) => {
    const user = {
      email: '',
      token: '',
    };
    chai
      .request(server)
      .POST('/api/reset-password')
      .send(user)
      .end((err, res) => {
        if (err) {
          console.error(err);
          done();
        }
        expect(res.status).to.equal(400);
        expect(res.body).to.have.property('error');
      });
    done();
  });
});
