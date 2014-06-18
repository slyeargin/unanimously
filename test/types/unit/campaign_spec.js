/* global describe, it, before, beforeEach */
/* jshint expr:true */

'use strict';

process.env.DBNAME = 'unanimously-test';

var expect = require('chai').expect;
var Mongo = require('mongodb');
var traceur = require('traceur');
var db = traceur.require(__dirname + '/../../helpers/db.js');
var factory = traceur.require(__dirname + '/../../helpers/factory.js');

var Campaign;
var User;

describe('Campaign', function(){
  before(function(done){
    db(function(){
      Campaign = traceur.require(__dirname + '/../../../app/models/campaign.js');
      User = traceur.require(__dirname + '/../../../app/models/user.js');
      done();
    });
  });

  beforeEach(function(done){
    global.nss.db.collection('campaigns').drop(function(){
      global.nss.db.collection('users').drop(function(){
        factory('campaign', function(campaigns){
          factory('user', function(users){
            done();
          });
        });
      });
    });
  });

  describe('.create', function(){
    it('should successfully create a campaign', function(done){
      var fields = {
        name: 'My Great Campaign',
        description: 'It will change the world.'
      };
      var owner = '0123456789abcdef01234567';
      fields.ownerId = owner;

      Campaign.create(fields, function(c){
        expect(c).to.be.ok;
        expect(c).to.be.an.instanceof(Campaign);
        expect(c._id).to.be.an.instanceof(Mongo.ObjectID);
        expect(c.ownerId).to.be.an.instanceof(Mongo.ObjectID);
        expect(c.ownerId.toString()).to.deep.equal('0123456789abcdef01234567');
        expect(c.editorIds).to.be.an('array');
        done();
      });
    });
  });

  describe('.findById', function(){
    it('should successfully find a Campaign - String', function(done){
      Campaign.findById('4023456789abcdef01234567', function(c){
        expect(c).to.be.instanceof(Campaign);
        expect(c.name).to.equal('My Fantastic Ad Campaign');
        expect(c.description).to.equal('It\'s amazing.');
        expect(c.ownerId.toString()).to.equal('0123456789abcdef01234567');
        done();
      });
    });

    it('should successfully find a Campaign - object id', function(done){
      Campaign.findById(Mongo.ObjectID('4023456789abcdef01234567'), function(c){
        expect(c).to.be.instanceof(Campaign);
        expect(c.name).to.equal('My Fantastic Ad Campaign');
        expect(c.description).to.equal('It\'s amazing.');
        expect(c.ownerId.toString()).to.equal('0123456789abcdef01234567');
        done();
      });
    });

    it('should NOT successfully find a Campaign - Bad Id', function(done){
      Campaign.findById('not an id', function(c){
        expect(c).to.be.null;
        done();
      });
    });

    it('should NOT successfully find a Campaign - NULL', function(done){
      Campaign.findById(null, function(c){
        expect(c).to.be.null;
        done();
      });
    });
  });

  describe('.findAllByOwnerId', function(){
    it('should successfully find campaigns by owner ID - string', function(done){
      Campaign.findAllByOwnerId('0123456789abcdef01234567', function(campaigns){
        expect(campaigns).to.be.ok;
        expect(campaigns).to.be.an('array');
        expect(campaigns[0]).to.be.instanceof(Campaign);
        expect(campaigns[0].name).to.equal('My Fantastic Ad Campaign');
        expect(campaigns[0].description).to.equal('It\'s amazing.');
        expect(campaigns[0]._id.toString()).to.equal('4023456789abcdef01234567');
        done();
      });
    });

    it('should successfully find campaigns by owner ID - object id', function(done){
      Campaign.findAllByOwnerId(Mongo.ObjectID('0123456789abcdef01234567'), function(campaigns){
        expect(campaigns).to.be.ok;
        expect(campaigns).to.be.an('array');
        expect(campaigns[0]).to.be.instanceof(Campaign);
        expect(campaigns[0].name).to.equal('My Fantastic Ad Campaign');
        expect(campaigns[0].description).to.equal('It\'s amazing.');
        expect(campaigns[0]._id.toString()).to.equal('4023456789abcdef01234567');
        done();
      });
    });

    it('should NOT successfully find any campaigns - bad ID', function(done){
      Campaign.findAllByOwnerId('not an id', function(campaigns){
        expect(campaigns).to.be.null;
        done();
      });
    });

    it('should NOT successfully find any campaigns - NULL', function(done){
      Campaign.findAllByOwnerId(null, function(campaigns){
        expect(campaigns).to.be.null;
        done();
      });
    });
  });

  describe('#addEditor', function(){
    it('should successfully add an editor to a campaign', function(done){
      User.findById('0123456789abcdef01234568', function(user){
        Campaign.findById('4023456789abcdef01234567', function(campaign){
          campaign.addEditor(user, function(u){
            expect(u).to.be.ok;
            expect(u).to.be.an.instanceof(User);
            expect(u.email).to.equal('slyeargin+test3@gmail.com');
            expect(u._id).to.be.an.instanceof(Mongo.ObjectID);
            done();
          });
        });
      });
    });

    it('should NOT add an editor to a campaign - user is campaign owner', function(done){
      User.findById('0123456789abcdef01234567', function(user){
        Campaign.findById('4023456789abcdef01234567', function(campaign){
          campaign.addEditor(user, function(u){
            expect(u).to.be.null;
            done();
          });
        });
      });
    });

    // it('should NOT add an editor to a campaign - user already an editor', function(done){
    //   User.findById('0123456789abcdef01234569', function(user){
    //     Campaign.findById('4023456789abcdef01234567', function(campaign){
    //       console.log('Campaign: ');
    //       console.log(campaign);
    //       campaign.addEditor(user, function(u){
    //         console.log('What is returning?');
    //         console.log(u);
    //         expect(u).to.be.null;
    //         done();
    //       });
    //     });
    //   });
    // });
  });

});
