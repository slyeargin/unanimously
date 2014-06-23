/* global describe, before, beforeEach, it */
/* jshint expr:true */

'use strict';

process.env.DBNAME = 'unanimously-test';

var expect = require('chai').expect;
var traceur = require('traceur');
var db = traceur.require(__dirname + '/../../helpers/db.js');
var factory = traceur.require(__dirname + '/../../helpers/factory.js');
var app = require('../../../app/app');
var request = require('supertest');

var User;

describe('users', function(){

  before(function(done){
    db(function(){
      User = traceur.require(__dirname + '/../../../app/models/user.js');
      done();
    });
  });

  beforeEach(function(done){
    global.nss.db.collection('users').drop(function(){
      factory('user', function(users){
        done();
      });
    });
  });

  describe('GET /register', function(){
    it('should show the registration page', function(done){
      request(app)
      .get('/register')
      .end(function(err, res){
        expect(res.status).to.equal(200);
        done();
      });
    });
  });

  describe('POST /register', function(){
    it('registers a user', function(done){
      request(app)
      .post('/register')
      .send('email=slyeargin+test6@gmail.com')
      .end(function(err, res){
        expect(res.status).to.equal(302);
        expect(res.headers.location).to.equal('/');
        done();
      });
    });

    it('doesn\'t register a user - e-mail address already in use', function(done){
      request(app)
      .post('/register')
      .send('email=samantha@yearg.in')
      .end(function(err, res){
        expect(res.status).to.equal(302);
        expect(res.headers.location).to.equal('/register');
        done();
      });
    });
  });


  describe('GET /verify/:id', function(){
    it('should show an individual verification page', function(done){
      request(app)
      .get('/verify/0123456789abcdef01234567')
      .end(function(err, res){
        expect(res.status).to.equal(200);
        done();
      });
    });

    it('should NOT show an individual verification page - user doesn\'t exist', function(done){
      request(app)
      .get('/verify/9123456789abcdef01234567')
      .end(function(err, res){
        expect(res.status).to.equal(302);
        expect(res.headers.location).to.equal('/');
        done();
      });
    });
  });

  describe('POST /verify/:id', function(){
    it('verify a user', function(done){
      request(app)
      .post('/verify/0123456789abcdef01234567')
      .send('password=1234')
      .end(function(err, res){
        expect(res.status).to.equal(302);
        expect(res.headers.location).to.equal('/login');
        done();
      });
    });

    it('should not verify a user - user does not exist', function(done){
      request(app)
      .post('/verify/9123456789abcdef01234567')
      .send('password=1234')
      .end(function(err, res){
        expect(res.status).to.equal(302);
        expect(res.headers.location).to.equal('/');
        done();
      });
    });
  });

  describe('GET /login', function(){
    it('should show the login page', function(done){
      request(app)
      .get('/login')
      .end(function(err, res){
        expect(res.status).to.equal(200);
        done();
      });
    });
  });

  describe('POST /login', function(){
    it('should login an existing user', function(done){
      request(app)
      .post('/login')
      .send('email=samantha@yearg.in')
      .send('password=1234')
      .end(function(err, res){
        expect(res.status).to.equal(302);
        expect(res.headers.location).to.equal('/dashboard');
        expect(res.headers['set-cookie']).to.be.ok;
        done();
      });
    });

    it('should NOT login an existing user - bad email', function(done){
      request(app)
      .post('/login')
      .send('email=wrong@aol.com')
      .send('password=5678')
      .end(function(err, res){
        expect(res.status).to.equal(302);
        expect(res.headers.location).to.equal('/login');
        // expect(res.headers['set-cookie']).to.not.be.ok;
        done();
      });
    });

    it('should NOT login an existing user - bad password', function(done){
      request(app)
      .post('/login')
      .send('email=samantha@yearg.in')
      .send('password=wrong')
      .end(function(err, res){
        expect(res.status).to.equal(302);
        expect(res.headers.location).to.equal('/login');
        // expect(res.headers['set-cookie']).to.not.be.ok;
        done();
      });
    });
  });

  describe('POST /logout', function(){
    it('should logout an existing user', function(done){
      request(app)
      .post('/logout')
      .end(function(err, res){
        expect(res.status).to.equal(302);
        expect(res.headers.location).to.equal('/login');
        // expect(res.headers['set-cookie']).to.be.ok;
        done();
      });
    });
  });

  describe('Authentication', function(){
    var cookie;

    beforeEach(function(done){
      request(app)
      .post('/login')
      .send('email=samantha@yearg.in')
      .send('password=1234')
      .end(function(err, res){
        var cookies = res.headers['set-cookie'];
        var one = cookies[0].split(';')[0];
        var two = cookies[1].split(';')[0];
        cookie = one + '; ' + two;
        done();
      });
    });

    describe('GET /login', function(){
      it('should NOT show the login page - already logged in', function(done){
        request(app)
        .get('/login')
        .set('cookie', cookie)
        .end(function(err, res){
          expect(res.status).to.equal(302);
          expect(res.headers.location).to.equal('/dashboard');
          done();
        });
      });
    });

    describe('GET /dashboard', function(){
      it('should show the dashboard page', function(done){
        request(app)
        .get('/dashboard')
        .set('cookie', cookie)
        .end(function(err, res){
          expect(res.status).to.equal(200);
          done();
        });
      });

      it('should NOT show the dashboard page - not logged in', function(done){
        request(app)
        .get('/dashboard')
        .end(function(err, res){
          expect(res.status).to.equal(302);
          expect(res.headers.location).to.equal('/login');
          done();
        });
      });
    });
  });
});
