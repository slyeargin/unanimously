/* global describe, it, before, beforeEach */
/* jshint expr:true */

'use strict';

process.env.DBNAME = 'unanimously-test';

var expect = require('chai').expect;
var Mongo = require('mongodb');
var traceur = require('traceur');
var db = traceur.require(__dirname + '/../../helpers/db.js');
var factory = traceur.require(__dirname + '/../../helpers/factory.js');

var Notification;

describe('Notification', function(){
  before(function(done){
    db(function(){
      Notification = traceur.require(__dirname + '/../../../app/models/notification.js');
      done();
    });
  });

  beforeEach(function(done){
    global.nss.db.collection('notifications').drop(function(){
      global.nss.db.collection('projects').drop(function(){
        global.nss.db.collection('campaigns').drop(function(){
          global.nss.db.collection('users').drop(function(){
            factory('notification', function(notifications){
              factory('project', function(projects){
                factory('campaign', function(campaigns){
                  factory('user', function(users){
                    done();
                  });
                });
              });
            });
          });
        });
      });
    });
  });

  describe('.create', function(){
    it('should successfully create a notification', function(done){
      var fields = {
        '_id':'7623456789abcdef01234567',
        'type':'project',
        'campaignId':'4023456789abcdef01234567',
        // 'projectId':'6023456789abcdef01234567',
        'fromId':'0123456789abcdef01234567'
      };
      var recipientId = '0123456789abcdef01234569';

      Notification.create(fields, recipientId, function(n){
        expect(n).to.be.ok;
        expect(n).to.be.an.instanceof(Notification);
        expect(n._id).to.be.an.instanceof(Mongo.ObjectID);
        expect(n.type).to.equal('project');
        // test project Id;
        expect(n.campaignId.toString()).to.equal('4023456789abcdef01234567');
        expect(n.recipientId.toString()).to.equal('0123456789abcdef01234569');
        expect(n.fromId.toString()).to.equal('0123456789abcdef01234567');
        done();
      });
    });
  });

  describe('.findById', function(){
    it('should successfully find a notification by ID', function(done){
      Notification.findById('7623456789abcdef01234567', function(n){
        expect(n).to.be.ok;
        expect(n).to.be.instanceof(Notification);
        expect(n._id.toString()).to.equal('7623456789abcdef01234567');
        expect(n.type).to.equal('doc');
        expect(n.campaignId.toString()).to.equal('4023456789abcdef01234567');
        expect(n.projectId.toString()).to.equal('6023456789abcdef01234567');
        expect(n.recipientId.toString()).to.equal('0123456789abcdef01234569');
        expect(n.fromId.toString()).to.equal('0123456789abcdef01234567');
        done();
      });
    });

    it('should NOT successfully find a notification - bad ID', function(done){
      Notification.findAllByRecipientId('not an ID', function(n){
        expect(n).to.be.null;
        done();
      });
    });

    it('should NOT successfully find a notification - NULL', function(done){
      Notification.findAllByRecipientId(null, function(n){
        expect(n).to.be.null;
        done();
      });
    });
  });

  describe('.findAllByRecipientId', function(){
    it('should successfully find notifications by recipient ID', function(done){
      Notification.findAllByRecipientId('0123456789abcdef01234569', function(n){
        console.log('What is returned?');
        console.log(n);
        expect(n).to.be.an('array');
        expect(n.length).to.equal(1);
        expect(n[0]).to.be.instanceof(Notification);
        expect(n[0]._id.toString()).to.equal('7623456789abcdef01234567');
        expect(n[0].type).to.equal('doc');
        expect(n[0].campaignId.toString()).to.equal('4023456789abcdef01234567');
        expect(n[0].projectId.toString()).to.equal('6023456789abcdef01234567');
        expect(n[0].recipientId.toString()).to.equal('0123456789abcdef01234569');
        expect(n[0].fromId.toString()).to.equal('0123456789abcdef01234567');
        done();
      });
    });

    it('should NOT successfully find any notifications - bad ID', function(done){
      Notification.findAllByRecipientId('not an ID', function(n){
        expect(n).to.be.null;
        done();
      });
    });

    it('should NOT successfully find any notifications - NULL', function(done){
      Notification.findAllByRecipientId(null, function(n){
        expect(n).to.be.null;
        done();
      });
    });
  });


  describe('#remove', function(){
    it('should remove any matching notification by ID', function(done){
      Notification.findById('7623456789abcdef01234567', function(notification){
        notification.remove(function(n){
          expect(notification).to.be.instanceof(Notification);
          expect(notification._id).to.be.instanceof(Mongo.ObjectID);
          expect(n).to.be.null;
          done();
        });
      });
    });
  });

  describe('#createMessage', function(){
    it('should generate a multipurpose message for a notification', function(done){
      Notification.findById('7623456789abcdef01234567', function(notification){
        notification.createMessage(function(n){
          expect(n).to.be.ok;
          expect(notification).to.be.instanceof(Notification);
          expect(notification._id).to.be.instanceof(Mongo.ObjectID);
          expect(notification._id.toString()).to.deep.equal('7623456789abcdef01234567');
          expect(notification.type).to.equal('doc');
          expect(notification.campaignId.toString()).to.equal('4023456789abcdef01234567');
          expect(notification.projectId.toString()).to.equal('6023456789abcdef01234567');
          expect(notification.recipientId.toString()).to.equal('0123456789abcdef01234569');
          expect(notification.fromId.toString()).to.equal('0123456789abcdef01234567');
          expect(n).to.be.instanceof(Notification);
          expect(n._id).to.be.instanceof(Mongo.ObjectID);
          expect(n._id.toString()).to.deep.equal('7623456789abcdef01234567');
          expect(n.type).to.equal('doc');
          expect(n.campaignId.toString()).to.equal('4023456789abcdef01234567');
          expect(n.projectId.toString()).to.equal('6023456789abcdef01234567');
          expect(n.recipientId.toString()).to.equal('0123456789abcdef01234569');
          expect(n.fromId.toString()).to.equal('0123456789abcdef01234567');
          expect(n.from).to.equal('S. Yeargin');
          expect(n.recipientEmail).to.equal('slyeargin+test4@gmail.com');
          expect(n.project).to.equal('Okay Website');
          expect(n.campaign).to.equal('My Fantastic Ad Campaign');
          expect(n.message).to.equal('S. Yeargin has updated Okay Website in My Fantastic Ad Campaign.');
          expect(n.subject).to.equal('Okay Website has been updated.');
          expect(n.link).to.equal('<a href="http://localhost:4000/projects/6023456789abcdef01234567">View Okay Website on Unanimous.ly.</a>');
          done();
        });
      });
    });
  });

});
