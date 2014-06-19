/* global describe, it, before, beforeEach */
/* jshint expr:true */

'use strict';

process.env.DBNAME = 'unanimously-test';

var expect = require('chai').expect;
var Mongo = require('mongodb');
var traceur = require('traceur');
var db = traceur.require(__dirname + '/../../helpers/db.js');
var factory = traceur.require(__dirname + '/../../helpers/factory.js');

var Doc;

describe('Doc', function(){
  before(function(done){
    db(function(){
      Doc = traceur.require(__dirname + '/../../../app/models/doc.js');
      done();
    });
  });

  beforeEach(function(done){
    global.nss.db.collection('docs').drop(function(){
      factory('doc', function(docs){
        done();
      });
    });
  });

  describe('.create', function(){
    it('should successfully create a doc', function(done){
      var fields = {
        copy: 'A disability doesn’t hinder someone from being a productive and valuable employee. We’ve helped many people with disabilities find jobs — people like Jose.',
        notes: 'Will run on July 30',
        projectId: '6023456789abcdef01234567',
        creatorId: '0123456789abcdef01234569'
      };

      Doc.create(fields, function(d){
        expect(d).to.be.ok;
        expect(d).to.be.an.instanceof(Doc);
        expect(d._id).to.be.an.instanceof(Mongo.ObjectID);
        expect(d.copy).to.equal('A disability doesn’t hinder someone from being a productive and valuable employee. We’ve helped many people with disabilities find jobs — people like Jose.');
        expect(d.notes).to.equal('Will run on July 30');
        expect(d.projectId).to.be.an.instanceof(Mongo.ObjectID);
        expect(d.projectId.toString()).to.deep.equal('6023456789abcdef01234567');
        expect(d.creatorId).to.be.an.instanceof(Mongo.ObjectID);
        expect(d.creatorId.toString()).to.deep.equal('0123456789abcdef01234569');
        done();
      });
    });
  });

  describe('.findById', function(){
    it('should successfully find a doc - String', function(done){
      Doc.findById('7023456789abcdef01234567', function(d){
        expect(d).to.be.instanceof(Doc);
        expect(d.copy).to.equal('Keep contamination under control.');
        expect(d.notes).to.equal('First draft');
        expect(d._id.toString()).to.deep.equal('7023456789abcdef01234567');
        expect(d.projectId.toString()).to.deep.equal('6023456789abcdef01234567');
        done();
      });
    });

    it('should successfully find a doc - object id', function(done){
      Doc.findById(Mongo.ObjectID('7023456789abcdef01234567'), function(d){
        expect(d).to.be.instanceof(Doc);
        expect(d.copy).to.equal('Keep contamination under control.');
        expect(d.notes).to.equal('First draft');
        expect(d._id.toString()).to.deep.equal('7023456789abcdef01234567');
        expect(d.projectId.toString()).to.deep.equal('6023456789abcdef01234567');
        done();
      });
    });

    it('should NOT successfully find a doc - Bad Id', function(done){
      Doc.findById('not an id', function(d){
        expect(d).to.be.null;
        done();
      });
    });

    it('should NOT successfully find a doc - NULL', function(done){
      Doc.findById(null, function(d){
        expect(d).to.be.null;
        done();
      });
    });
  });

  describe('.findAllByProjectId', function(){
    it('should successfully find docs by project ID - string', function(done){
      Doc.findAllByProjectId('6023456789abcdef01234567', function(docs){
        expect(docs).to.be.ok;
        expect(docs).to.be.an('array');
        expect(docs).to.have.length(2);
        expect(docs[0]).to.be.instanceof(Doc);
        expect(docs[0].projectId.toString()).to.deep.equal('6023456789abcdef01234567');
        expect(docs[0]._id.toString()).to.equal('7023456789abcdef01234567');
        done();
      });
    });

    it('should successfully find docs by project ID - object id', function(done){
      Doc.findAllByProjectId(Mongo.ObjectID('6023456789abcdef01234567'), function(docs){
        expect(docs).to.be.ok;
        expect(docs).to.be.an('array');
        expect(docs).to.have.length(2);
        expect(docs[0]).to.be.instanceof(Doc);
        expect(docs[0].projectId.toString()).to.deep.equal('6023456789abcdef01234567');
        expect(docs[0]._id.toString()).to.equal('7023456789abcdef01234567');
        done();
      });
    });

    it('should NOT successfully find any docs - bad ID', function(done){
      Doc.findAllByProjectId('not an id', function(docs){
        expect(docs).to.be.null;
        done();
      });
    });

    it('should NOT successfully find any docs - NULL', function(done){
      Doc.findAllByProjectId(null, function(docs){
        expect(docs).to.be.null;
        done();
      });
    });
  });

});
