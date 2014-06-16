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
var Campaign;

describe('campaigns', function(){

  before(function(done){
    db(function(){
      User = traceur.require(__dirname + '/../../../app/models/user.js');
      Campaign = traceur.require(__dirname + '/../../../app/models/campaign.js');
      done();
    });
  });

  beforeEach(function(done){
    global.nss.db.collection('users').drop(function(){
      factory('user', function(users){
        factory('campaign', function(campaigns){
          done();
        });
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

    describe('GET /campaigns/:id', function(){
      it('should show an individual campaign page', function(done){
        request(app)
        .get('/campaigns/4023456789abcdef01234567')
        .set('cookie', cookie)
        .end(function(err, res){
          expect(res.status).to.equal(200);
          expect(res.text).to.include('Samantha Y.');
          expect(res.text).to.include('My Fantastic Ad Campaign');
          done();
        });
      });

      it('should NOT show an individual campaign page - not logged in', function(done){
        request(app)
        .get('/campaigns/4023456789abcdef01234567')
        .end(function(err, res){
          expect(res.status).to.equal(302);
          expect(res.headers.location).to.equal('/login');
          done();
        });
      });

      it('should NOT show an individual campaign page - logged in but invalid ID', function(done){
        request(app)
        .get('/campaigns/wrongId')
        .set('cookie', cookie)
        .end(function(err, res){
          expect(res.status).to.equal(302);
          expect(res.headers.location).to.equal('/dashboard');
          done();
        });
      });
    });

    describe('POST /campaigns/create', function(){
      it('should create a new campaign', function(done){
        request(app)
        .post('/campaigns/create')
        .set('cookie', cookie)
        .send('_id=4123456789abcdef01234567')
        .send('name=My Even Better Ad Campaign')
        .send('description=I learned from my mistakes.')
        .send('ownerId=0123456789abcdef01234567')
        .end(function(err, res){
          expect(res.status).to.equal(302);
          expect(res.headers.location).to.equal('/campaigns/4123456789abcdef01234567');
          done();
        });
      });

      it('should NOT create a new campaign - not logged in', function(done){
        request(app)
        .post('/campaigns/create')
        .end(function(err, res){
          expect(res.status).to.equal(302);
          expect(res.headers.location).to.equal('/login');
          done();
        });
      });
    });

  }); // close auth
});
