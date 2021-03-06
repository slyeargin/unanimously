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
      factory('notification', function(notifications){
        done();
      });
    });
  });

  describe('.create', function(){
    it('should successfully create a notification', function(done){
      var fields = {
        _id:'9723456789abcdef01234567',
        recipientId:'0123456789abcdef01234567',
        docId: '7023456789abcdef01234568'
      };

      Notification.create(fields, function(n){
        expect(n).to.be.ok;
        expect(n).to.be.an.instanceof(Notification);
        expect(n._id).to.be.an.instanceof(Mongo.ObjectID);
        expect(n._id.toString()).to.equal('9723456789abcdef01234567');
        expect(n.recipientId).to.be.an.instanceof(Mongo.ObjectID);
        expect(n.recipientId.toString()).to.equal('0123456789abcdef01234567');
        expect(n.docId).to.be.an.instanceof(Mongo.ObjectID);
        expect(n.docId.toString()).to.equal('7023456789abcdef01234568');
        done();
      });
    });
  });

  describe('.findById', function(){
    it('should successfully find a notification - String', function(done){
      Notification.findById('9523456789abcdef01234567', function(n){
        expect(n).to.be.instanceof(Notification);
        expect(n._id).to.be.an.instanceof(Mongo.ObjectID);
        expect(n._id.toString()).to.equal('9523456789abcdef01234567');
        expect(n.recipientId).to.be.an.instanceof(Mongo.ObjectID);
        expect(n.recipientId.toString()).to.equal('0123456789abcdef01234567');
        expect(n.docId).to.be.an.instanceof(Mongo.ObjectID);
        expect(n.docId.toString()).to.equal('7023456789abcdef01234568');
        done();
      });
    });

    it('should successfully find a notification - object id', function(done){
      Notification.findById(Mongo.ObjectID('9523456789abcdef01234567'), function(n){
        expect(n).to.be.instanceof(Notification);
        expect(n._id).to.be.an.instanceof(Mongo.ObjectID);
        expect(n._id.toString()).to.equal('9523456789abcdef01234567');
        expect(n.recipientId).to.be.an.instanceof(Mongo.ObjectID);
        expect(n.recipientId.toString()).to.equal('0123456789abcdef01234567');
        expect(n.docId).to.be.an.instanceof(Mongo.ObjectID);
        expect(n.docId.toString()).to.equal('7023456789abcdef01234568');
        done();
      });
    });

    it('should NOT successfully find a notification - Bad Id', function(done){
      Notification.findById('not an id', function(n){
        expect(n).to.be.null;
        done();
      });
    });

    it('should NOT successfully find a notification - NULL', function(done){
      Notification.findById(null, function(n){
        expect(n).to.be.null;
        done();
      });
    });
  });

  describe('.findAllByRecipientId', function(){
    it('should successfully find all of a user\'s notifications', function(done){
      Notification.findAllByRecipientId('0123456789abcdef01234567', function(n){
        expect(n).to.be.an('array');
        expect(n.length).to.equal(1);
        expect(n[0]).to.be.instanceof(Notification);
        expect(n[0]._id.toString()).to.equal('9523456789abcdef01234567');
        expect(n[0].recipientId).to.be.an.instanceof(Mongo.ObjectID);
        expect(n[0].recipientId.toString()).to.equal('0123456789abcdef01234567');
        expect(n[0].docId).to.be.an.instanceof(Mongo.ObjectID);
        expect(n[0].docId.toString()).to.equal('7023456789abcdef01234568');
        done();
      });
    });

    it('should NOT successfully find any notifications - bad ID', function(done){
      Notification.findAllByRecipientId('not an email', function(n){
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

  describe('.buildList', function(){
    it('should build a list of recipientIds and create notifications', function(done){
      var campaign = {
        _id : '4023456789abcdef01234567',
        name : 'My Fantastic Ad Campaign',
        description : 'It\'s amazing.',
        ownerId : '0123456789abcdef01234567',
        editorIds : [ '0123456789abcdef01234569' ]
      };
      var doc = {
        _id:'7023456789abcdef01234567',
        projectId:'6023456789abcdef01234567',
        copy:'Keep contamination under control.',
        notes:'First draft',
        date: '6/1/2014',
        creatorId: '0123456789abcdef01234567'
      };
      Notification.buildList(doc, campaign, function(n){
        expect(n).to.be.ok;
        expect(n).to.be.an('array');
        expect(n.length).to.equal(1);
        expect(n[0]).to.be.an.instanceof(Notification);
        expect(n[0]._id).to.be.an.instanceof(Mongo.ObjectID);
        expect(n[0].recipientId).to.be.an.instanceof(Mongo.ObjectID);
        expect(n[0].recipientId.toString()).to.equal('0123456789abcdef01234569');
        expect(n[0].docId).to.be.an.instanceof(Mongo.ObjectID);
        expect(n[0].docId.toString()).to.equal('7023456789abcdef01234567');
        expect(n[0].created).to.be.an.instanceof(Date);
        done();
      });
    });
  });

  describe('.countAllByRecipientId', function(){
    it('should successfully count all of a user\'s notifications', function(done){
      Notification.countAllByRecipientId('0123456789abcdef01234567', function(n){
        expect(n).to.be.ok;
        expect(n).to.equal(1);
        done();
      });
    });

    it('should find 0 notifications - user has none', function(done){
      Notification.countAllByRecipientId('0123456789abcdef01234569', function(n){
        expect(n).to.exist;
        expect(n).to.equal(0);
        done();
      });
    });

    it('should NOT successfully find any notifications - bad ID', function(done){
      Notification.findAllByRecipientId('not an email', function(n){
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

  describe('.getFullObjects', function(){
    it('should wrap notifications with necessary info', function(done){
      Notification.findAllByRecipientId('0123456789abcdef01234567', function(notifications){
        Notification.getFullObjects(notifications, function(n){
          expect(n).to.be.ok;
          expect(n).to.be.an('array');
          expect(n.length).to.equal(1);
          expect(n[0].message).to.equal('SM Yeargin updated Okay Website.');
          expect(n[0].created).to.be.an.instanceof(Date);
          expect(n[0]).to.be.an.instanceof(Notification);
          expect(n[0]._id).to.be.an.instanceof(Mongo.ObjectID);
          expect(n[0]._id.toString()).to.equal('9523456789abcdef01234567');
          expect(n[0].recipientId).to.be.an.instanceof(Mongo.ObjectID);
          expect(n[0].recipientId.toString()).to.equal('0123456789abcdef01234567');
          expect(n[0].docId).to.be.an.instanceof(Mongo.ObjectID);
          expect(n[0].docId.toString()).to.equal('7023456789abcdef01234568');
          expect(n[0].project._id).to.be.an.instanceof(Mongo.ObjectID);
          expect(n[0].project._id.toString()).to.equal('6023456789abcdef01234567');
          expect(n[0].docCreatorName).to.equal('SM Yeargin');
          expect(n[0].document.isFinal).to.equal(false);
          done();
        });
      });
    });
  });

  describe('#remove', function(){
    it('should remove notification by ID', function(done){
      Notification.findById('9523456789abcdef01234567', function(notice){
        notice.remove(function(n){
          expect(notice).to.be.ok;
          expect(notice._id.toString()).to.deep.equal('9523456789abcdef01234567');
          expect(n).to.be.null;
          done();
        });
      });
    });
  });

});
