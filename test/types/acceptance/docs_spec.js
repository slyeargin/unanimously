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
var Doc;

describe('campaigns', function(){

  before(function(done){
    db(function(){
      User = traceur.require(__dirname + '/../../../app/models/user.js');
      Campaign = traceur.require(__dirname + '/../../../app/models/campaign.js');
      Project = traceur.require(__dirname + '/../../../app/models/project.js');
      Doc = traceur.require(__dirname + '/../../../app/models/doc.js');
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

    describe('POST /docs/create', function(){
      it('should create a new doc', function(done){
        request(app)
        .post('/docs/create')
        .set('cookie', cookie)
        .send('_id=7123456789abcdef01234567')
        .send('copy=Keeping all contamination under control.')
        .send('notes=We should oversell it.')
        .send('projectId=6023456789abcdef01234567')
        .end(function(err, res){
          expect(res.status).to.equal(302);
          expect(res.headers.location).to.equal('/projects/6023456789abcdef01234567');
          done();
        });
      });

      it('should NOT create a new project - not logged in', function(done){
        request(app)
        .post('/docs/create')
        .end(function(err, res){
          expect(res.status).to.equal(302);
          expect(res.headers.location).to.equal('/login');
          done();
        });
      });

      //tests to check if project exists before creating a doc
    });

  }); // close auth
});
