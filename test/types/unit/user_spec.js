/* global describe, it, before, beforeEach */
/* jshint expr:true */

'use strict';

process.env.DBNAME = 'unanimously-test';

var expect = require('chai').expect;
var Mongo = require('mongodb');
var traceur = require('traceur');
var db = traceur.require(__dirname + '/../../helpers/db.js');
var factory = traceur.require(__dirname + '/../../helpers/factory.js');

var User;

describe('User', function(){
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

  describe('.create', function(){
    it('should successfully create a user', function(done){
      var fields = {
        email:'slyeargin+createuser@gmail.com'
      };

      User.create(fields, function(u){
        expect(u).to.be.ok;
        expect(u).to.be.an.instanceof(User);
        expect(u._id).to.be.an.instanceof(Mongo.ObjectID);
        done();
      });
    });

    it('should NOT successfully register a user - user already exists', function(done){
      User.create({email:'slyeargin+tester@gmail.com'}, function(u){
        expect(u).to.be.null;
        done();
      });
    });
  });

  describe('#changePassword', function(){
    it('should successfully change a password', function(done){
      User.findById('0123456789abcdef01234568', function(user){
        user.changePassword('abcd', function(u){
          expect(u).to.be.ok;
          expect(u).to.be.an.instanceof(User);
          expect(u.email).to.equal('slyeargin+test3@gmail.com');
          expect(u._id).to.be.an.instanceof(Mongo.ObjectID);
          done();
        });
      });
    });
  });

  describe('#update', function(){
    it('should successfully update a profile - name provided', function(done){
      User.findById('0123456789abcdef01234568', function(user){
        var fields = {
          name: 'Test Change'
        };
        user.update(fields, function(u){
          expect(u).to.be.ok;
          expect(u).to.be.an.instanceof(User);
          expect(u.name).to.equal('Test Change');
          expect(u.email).to.equal('slyeargin+test3@gmail.com');
          expect(u._id).to.be.an.instanceof(Mongo.ObjectID);
          done();
        });
      });
    });

    it('should successfully update a profile - name provided', function(done){
      User.findById('0123456789abcdef01234568', function(user){
        var fields = {
          name: ''
        };
        user.update(fields, function(u){
          expect(u).to.be.ok;
          expect(u).to.be.an.instanceof(User);
          expect(u.name).to.equal('slyeargin+test3@gmail.com');
          expect(u.email).to.equal('slyeargin+test3@gmail.com');
          expect(u._id).to.be.an.instanceof(Mongo.ObjectID);
          done();
        });
      });
    });
  });

  describe('.login', function(){
    it('should successfully login a user', function(done){
      User.login({email:'slyeargin+tester@gmail.com', password:'1234'}, function(u){
        expect(u).to.be.ok;
        done();
      });
    });

    it('should NOT login user - bad email', function(done){
      User.login({email:'wrong@aol.com', password:'does not matter'}, function(u){
        expect(u).to.be.null;
        done();
      });
    });

    it('should NOT login user - bad password', function(done){
      User.login({email:'slyeargin+tester@gmail.com', password:'wrong'}, function(u){
        expect(u).to.be.null;
        done();
      });
    });

    it('should NOT login user - unverified account', function(done){
      User.login({email:'slyeargin+test2@gmail.com', password:'1234'}, function(u){
        expect(u).to.be.null;
        done();
      });
    });
  });

  describe('.findById', function(){
    it('should successfully find a user - String', function(done){
      User.findById('0123456789abcdef01234567', function(u){
        expect(u).to.be.instanceof(User);
        expect(u.email).to.equal('slyeargin@gmail.com');
        done();
      });
    });

    it('should successfully find a user - object id', function(done){
      User.findById(Mongo.ObjectID('0123456789abcdef01234567'), function(u){
        expect(u).to.be.instanceof(User);
        expect(u.email).to.equal('slyeargin@gmail.com');
        done();
      });
    });

    it('should NOT successfully find a user - Bad Id', function(done){
      User.findById('not an id', function(u){
        expect(u).to.be.null;
        done();
      });
    });

    it('should NOT successfully find a user - NULL', function(done){
      User.findById(null, function(u){
        expect(u).to.be.null;
        done();
      });
    });
  });

  describe('.findByEmail', function(){
    it('should successfully find a user', function(done){
      User.findByEmail('slyeargin@gmail.com', function(u){
        expect(u).to.be.instanceof(User);
        expect(u._id.toString()).to.equal('0123456789abcdef01234567');
        expect(u.email).to.equal('slyeargin@gmail.com');
        done();
      });
    });

    it('should NOT successfully find a user - does not exist', function(done){
      User.findByEmail('not an id', function(u){
        expect(u).to.be.null;
        done();
      });
    });

    it('should NOT successfully find a user - NULL', function(done){
      User.findByEmail(null, function(u){
        expect(u).to.be.null;
        done();
      });
    });
  });

});
