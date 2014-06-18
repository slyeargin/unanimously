/* global describe, it, before, beforeEach */
/* jshint expr:true */

'use strict';

process.env.DBNAME = 'unanimously-test';

var expect = require('chai').expect;
var Mongo = require('mongodb');
var traceur = require('traceur');
var db = traceur.require(__dirname + '/../../helpers/db.js');
var factory = traceur.require(__dirname + '/../../helpers/factory.js');

var Invitation;

describe('Invitation', function(){
  before(function(done){
    db(function(){
      Invitation = traceur.require(__dirname + '/../../../app/models/invitation.js');
      done();
    });
  });

  beforeEach(function(done){
    global.nss.db.collection('invitations').drop(function(){
      factory('invitation', function(invitations){
        done();
      });
    });
  });

  describe('.create', function(){
    it('should successfully create an invitation', function(done){
      var fields = {
        email: 'slyeargin@gmail.com',
        campaignId: '4023456789abcdef01234567',
        from: '0123456789abcdef01234567'
      };

      Invitation.create(fields, function(i){
        expect(i).to.be.ok;
        expect(i).to.be.an.instanceof(Invitation);
        expect(i._id).to.be.an.instanceof(Mongo.ObjectID);
        expect(i.invitee).to.equal('slyeargin@gmail.com');
        expect(i.campaignId.toString()).to.equal('4023456789abcdef01234567');
        expect(i.from.toString()).to.equal('0123456789abcdef01234567');
        done();
      });
    });
  });

//   if(!user.email){fn(null); return;}
//   invitationCollection.find({invitee:user.email}).toArray((e,objs)=>{
//     objs = objs.map(o=>_.create(Invitation.prototype, o));
//     fn(objs);
//   });
// }

  describe('.findAllByInviteeEmail', function(){
    it('should successfully find an invitation', function(done){
      var user = {
        email: 'slyeargin+test5@gmail.com'
      };

      Invitation.findAllByInviteeEmail(user, function(i){
        expect(i).to.be.an('array');
        expect(i.length).to.equal(1);
        expect(i[0]).to.be.instanceof(Invitation);
        expect(i[0]._id.toString()).to.equal('7523456789abcdef01234567');
        expect(i[0].campaignId.toString()).to.equal('4023456789abcdef01234567');
        expect(i[0].invitee).to.equal('slyeargin+test5@gmail.com');
        expect(i[0].from.toString()).to.equal('0123456789abcdef01234567');
        done();
      });
    });

    it('should NOT successfully find an invitation - bad e-mail', function(done){
      Invitation.findAllByInviteeEmail('not an email', function(i){
        expect(i).to.be.null;
        done();
      });
    });

    it('should NOT successfully find an invitation - NULL', function(done){
      Invitation.findAllByInviteeEmail(null, function(i){
        expect(i).to.be.null;
        done();
      });
    });
  });

  describe('.duplicateCheck', function(){
    it('should find any matching invitation by e-mail and campaign ID', function(done){
      var email = 'slyeargin+test5@gmail.com';
      var campaignId = '4023456789abcdef01234567';

      Invitation.duplicateCheck(email, campaignId, function(i){
        // expect(i).to.be.instanceof(Invitation);
        expect(i._id.toString()).to.equal('7523456789abcdef01234567');
        expect(i.campaignId.toString()).to.equal('4023456789abcdef01234567');
        expect(i.invitee).to.equal('slyeargin+test5@gmail.com');
        expect(i.from.toString()).to.equal('0123456789abcdef01234567');
        done();
      });
    });

    it('should NOT successfully find an invitation - does not exist', function(done){
      var email = 'slyeargin@gmail.com';
      var campaignId = '4023456789abcdef01234567';

      Invitation.duplicateCheck(email, campaignId, function(i){
        expect(i).to.be.null;
        done();
      });
    });
  });

  // remove(fn){
  //   invitationCollection.findAndRemove({_id:this._id}, invite=>{
  //     fn(invite);
  //   });
  // }

  describe('#remove', function(){
    it('should remove any matching invitation by ID', function(done){
      var user = {
        email: 'slyeargin+test5@gmail.com'
      };

      Invitation.findAllByInviteeEmail(user, function(invite){
        invite[0].remove(function(i){
          expect(invite).to.be.an('array');
          expect(invite.length).to.equal(1);
          expect(i).to.be.null;
          done();
        });
      });
    });
  });

});
