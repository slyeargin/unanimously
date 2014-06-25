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
var Notification;

describe('campaigns', function(){

  before(function(done){
    db(function(){
      User = traceur.require(__dirname + '/../../../app/models/user.js');
      Campaign = traceur.require(__dirname + '/../../../app/models/campaign.js');
      Project = traceur.require(__dirname + '/../../../app/models/project.js');
      Doc = traceur.require(__dirname + '/../../../app/models/doc.js');
      Notification = traceur.require(__dirname + '/../../../app/models/notification.js');
      done();
    });
  });

  beforeEach(function(done){
    global.nss.db.collection('users').drop(function(){
      factory('user', function(users){
        factory('campaign', function(campaigns){
          factory('project', function(projects){
            factory('doc', function(docs){
              factory('notification', function(notification){
                done();
              });
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

    describe('GET /notifications', function(){
      it('should get all of a user\'s notifications', function(done){
        request(app)
        .get('/notifications')
        .set('cookie', cookie)
        .end(function(err, res){
          expect(res.status).to.equal(200);
          expect(res.text).to.include('SM Yeargin updated Okay Website.');
          done();
        });
      });

      it('should NOT get all of a user\'s notifications - not logged in', function(done){
        request(app)
        .get('/notifications')
        .end(function(err, res){
          expect(res.status).to.equal(302);
          expect(res.headers.location).to.equal('/login');
          done();
        });
      });
    });

    describe('POST /notifications/remove', function(){
      it('should delete a notification', function(done){
        request(app)
        .post('/notifications/remove')
        .set('cookie', cookie)
        .send('notificationId=9523456789abcdef01234567')
        .end(function(err, res){
          expect(res.status).to.equal(302);
          expect(res.headers.location).to.equal('/notifications');
          done();
        });
      });

      it('should NOT delete a notification - not logged in', function(done){
        request(app)
        .post('/notifications/remove')
        .end(function(err, res){
          expect(res.status).to.equal(302);
          expect(res.headers.location).to.equal('/login');
          done();
        });
      });
    });

  });
});
