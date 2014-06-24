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
var Project;

describe('campaigns', function(){

  before(function(done){
    db(function(){
      User = traceur.require(__dirname + '/../../../app/models/user.js');
      Campaign = traceur.require(__dirname + '/../../../app/models/campaign.js');
      Project = traceur.require(__dirname + '/../../../app/models/project.js');
      done();
    });
  });

  beforeEach(function(done){
    global.nss.db.collection('users').drop(function(){
      factory('user', function(users){
        factory('campaign', function(campaigns){
          factory('project', function(projects){
            factory('doc', function(docs){
              done();
            });
          });
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

    describe('GET /projects/edit/:id', function(){
      it('should NOT show an individual project edit page - wrong user logged in', function(done){
        request(app)
        .get('/projects/edit/6023456789abcdef01234567')
        .set('cookie', cookie)
        .end(function(err, res){
          expect(res.status).to.equal(302);
          expect(res.headers.location).to.equal('/dashboard');
          done();
        });
      });
    });

    describe('GET /projects/:id', function(){
      it('should NOT show an individual project page - wrong user logged in', function(done){
        request(app)
        .get('/projects/6023456789abcdef01234567')
        .set('cookie', cookie)
        .end(function(err, res){
          expect(res.status).to.equal(302);
          expect(res.headers.location).to.equal('/dashboard');
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
      .send('email=stephen.yeargin@gmail.com')
      .send('password=1234')
      .end(function(err, res){
        var cookies = res.headers['set-cookie'];
        var one = cookies[0].split(';')[0];
        var two = cookies[1].split(';')[0];
        cookie = one + '; ' + two;
        done();
      });
    });

    describe('GET /projects/:id', function(){
      it('should show an individual project page - editor logged in', function(done){
        request(app)
        .get('/projects/6023456789abcdef01234567')
        .set('cookie', cookie)
        .end(function(err, res){
          expect(res.status).to.equal(200);
          expect(res.text).to.include('Okay Website');
          expect(res.text).to.include('Web');
          expect(res.text).to.include('Copy for ad on Okay Website');
          expect(res.text).to.include('Keep contamination under control.');
          done();
        });
      });
    });

    describe('GET /projects/edit/:id', function(){
      it('should NOT show an individual project edit page - editor logged in', function(done){
        request(app)
        .get('/projects/edit/6023456789abcdef01234567')
        .set('cookie', cookie)
        .end(function(err, res){
          expect(res.status).to.equal(302);
          expect(res.headers.location).to.equal('/dashboard');
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
      .send('email=slyeargin@gmail.com')
      .send('password=1234')
      .end(function(err, res){
        var cookies = res.headers['set-cookie'];
        var one = cookies[0].split(';')[0];
        var two = cookies[1].split(';')[0];
        cookie = one + '; ' + two;
        done();
      });
    });

    describe('GET /projects/:id', function(){
      it('should show an individual project page', function(done){
        request(app)
        .get('/projects/6023456789abcdef01234567')
        .set('cookie', cookie)
        .end(function(err, res){
          expect(res.status).to.equal(200);
          expect(res.text).to.include('Okay Website');
          expect(res.text).to.include('Web');
          expect(res.text).to.include('Copy for ad on Okay Website');
          expect(res.text).to.include('Keep contamination under control.');
          done();
        });
      });

      it('should NOT show an individual campaign page - not logged in', function(done){
        request(app)
        .get('/projects/6023456789abcdef01234567')
        .end(function(err, res){
          expect(res.status).to.equal(302);
          expect(res.headers.location).to.equal('/login');
          done();
        });
      });

      it('should NOT show an individual campaign page - logged in but invalid ID', function(done){
        request(app)
        .get('/projects/wrongId')
        .set('cookie', cookie)
        .end(function(err, res){
          expect(res.status).to.equal(302);
          expect(res.headers.location).to.equal('/dashboard');
          done();
        });
      });
    });

    describe('GET /projects/edit/:id', function(){
      it('should show an individual project edit page', function(done){
        request(app)
        .get('/projects/edit/6023456789abcdef01234567')
        .set('cookie', cookie)
        .end(function(err, res){
          expect(res.status).to.equal(200);
          expect(res.text).to.include('Edit Your Project');
          done();
        });
      });

      it('should NOT show an individual project edit page - not logged in', function(done){
        request(app)
        .get('/projects/edit/4023456789abcdef01234567')
        .end(function(err, res){
          expect(res.status).to.equal(302);
          expect(res.headers.location).to.equal('/login');
          done();
        });
      });

      it('should NOT show an individual project edit page - logged in but invalid project ID', function(done){
        request(app)
        .get('/projects/edit/wrongId')
        .set('cookie', cookie)
        .end(function(err, res){
          expect(res.status).to.equal(302);
          expect(res.headers.location).to.equal('/dashboard');
          done();
        });
      });
    });

    describe('POST /projects/edit', function(){
      it('should post project updates', function(done){
        request(app)
        .post('/projects/edit')
        .send('name=Great Website')
        .send('medium=Web')
        .send('notes=Copy for ad on Great Website')
        .send('projectId=6023456789abcdef01234567')
        .set('cookie', cookie)
        .end(function(err, res){
          expect(res.status).to.equal(302);
          expect(res.headers.location).to.equal('/projects/6023456789abcdef01234567');
          done();
        });
      });
    });

    describe('POST /projects/create', function(){
      it('should create a new project', function(done){
        request(app)
        .post('/projects/create')
        .set('cookie', cookie)
        .send('_id=6123456789abcdef01234567')
        .send('name=More prominent outlet')
        .send('medium=Print')
        .send('notes=This is a wider audience.')
        .send('campaignId=4023456789abcdef01234567')
        .end(function(err, res){
          expect(res.status).to.equal(302);
          expect(res.headers.location).to.equal('/projects/6123456789abcdef01234567');
          done();
        });
      });

      it('should NOT create a new project - not logged in', function(done){
        request(app)
        .post('/projects/create')
        .end(function(err, res){
          expect(res.status).to.equal(302);
          expect(res.headers.location).to.equal('/login');
          done();
        });
      });
    });

  }); // close auth
});
