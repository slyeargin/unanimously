/* global describe, it, before, beforeEach */
/* jshint expr:true */

'use strict';

process.env.DBNAME = 'unanimously-test';

var expect = require('chai').expect;
var Mongo = require('mongodb');
var traceur = require('traceur');
var db = traceur.require(__dirname + '/../../helpers/db.js');
var factory = traceur.require(__dirname + '/../../helpers/factory.js');

var Project;

describe('Project', function(){
  before(function(done){
    db(function(){
      Project = traceur.require(__dirname + '/../../../app/models/project.js');
      done();
    });
  });

  beforeEach(function(done){
    global.nss.db.collection('projects').drop(function(){
      factory('project', function(projects){
        done();
      });
    });
  });

  describe('.create', function(){
    it('should successfully create a project', function(done){
      var fields = {
        name: 'Amazing Magazine copy',
        medium: 'Print',
        notes: 'Print ad copy for the latest issue of Amazing Magazine'
      };
      var campaign = '4023456789abcdef01234567';
      fields.campaignId = campaign;

      Project.create(fields, function(p){
        expect(p).to.be.ok;
        expect(p).to.be.an.instanceof(Project);
        expect(p._id).to.be.an.instanceof(Mongo.ObjectID);
        expect(p.name).to.equal('Amazing Magazine copy');
        expect(p.medium).to.equal('Print');
        expect(p.notes).to.equal('Print ad copy for the latest issue of Amazing Magazine');
        expect(p.campaignId).to.be.an.instanceof(Mongo.ObjectID);
        expect(p.campaignId.toString()).to.deep.equal('4023456789abcdef01234567');
        done();
      });
    });
  });

  describe('.findById', function(){
    it('should successfully find a Project - String', function(done){
      Project.findById('6023456789abcdef01234567', function(p){
        expect(p).to.be.instanceof(Project);
        expect(p.name).to.equal('Okay Website');
        expect(p.medium).to.equal('Web');
        expect(p.notes).to.equal('Copy for ad on Okay Website');
        expect(p._id.toString()).to.deep.equal('6023456789abcdef01234567');
        expect(p.campaignId.toString()).to.deep.equal('4023456789abcdef01234567');
        done();
      });
    });

    it('should successfully find a Project - object id', function(done){
      Project.findById(Mongo.ObjectID('6023456789abcdef01234567'), function(p){
        expect(p).to.be.instanceof(Project);
        expect(p.name).to.equal('Okay Website');
        expect(p.medium).to.equal('Web');
        expect(p.notes).to.equal('Copy for ad on Okay Website');
        expect(p._id.toString()).to.deep.equal('6023456789abcdef01234567');
        expect(p.campaignId.toString()).to.deep.equal('4023456789abcdef01234567');
        done();
      });
    });

    it('should NOT successfully find a Project - Bad Id', function(done){
      Project.findById('not an id', function(p){
        expect(p).to.be.null;
        done();
      });
    });

    it('should NOT successfully find a Project - NULL', function(done){
      Project.findById(null, function(p){
        expect(p).to.be.null;
        done();
      });
    });
  });

  describe('.findAllByCampaignId', function(){
    it('should successfully find projects by campaign ID - string', function(done){
      Project.findAllByCampaignId('4023456789abcdef01234567', function(projects){
        expect(projects).to.be.ok;
        expect(projects).to.be.an('array');
        expect(projects[0]).to.be.instanceof(Project);
        expect(projects[0].campaignId.toString()).to.deep.equal('4023456789abcdef01234567');
        expect(projects[0].name).to.equal('Okay Website');
        expect(projects[0].medium).to.equal('Web');
        expect(projects[0].notes).to.equal('Copy for ad on Okay Website');
        expect(projects[0]._id.toString()).to.equal('6023456789abcdef01234567');
        done();
      });
    });

    it('should successfully find projects by campaign ID - object id', function(done){
      Project.findAllByCampaignId(Mongo.ObjectID('4023456789abcdef01234567'), function(projects){
        expect(projects).to.be.ok;
        expect(projects).to.be.an('array');
        expect(projects[0]).to.be.instanceof(Project);
        expect(projects[0].campaignId.toString()).to.deep.equal('4023456789abcdef01234567');
        expect(projects[0].name).to.equal('Okay Website');
        expect(projects[0].medium).to.equal('Web');
        expect(projects[0].notes).to.equal('Copy for ad on Okay Website');
        expect(projects[0]._id.toString()).to.equal('6023456789abcdef01234567');
        done();
      });
    });

    it('should NOT successfully find any projects - bad ID', function(done){
      Project.findAllByCampaignId('not an id', function(projects){
        expect(projects).to.be.null;
        done();
      });
    });

    it('should NOT successfully find any projects - NULL', function(done){
      Project.findAllByCampaignId(null, function(projects){
        expect(projects).to.be.null;
        done();
      });
    });
  });

  describe('#update', function(){
    it('should successfully update a project', function(done){
      var fields = {
        name: 'Great Website',
        medium: 'Web',
        notes: 'Copy for ad on Great Website'
      };
      Project.findById('6023456789abcdef01234567', function(project){
        project.update(fields, function(p){
          expect(p).to.be.ok;
          expect(p).to.be.instanceof(Project);
          expect(p.name).to.equal('Great Website');
          expect(p.medium).to.equal('Web');
          expect(p.notes).to.equal('Copy for ad on Great Website');
          expect(p._id.toString()).to.deep.equal('6023456789abcdef01234567');
          expect(p.campaignId.toString()).to.deep.equal('4023456789abcdef01234567');
          done();
        });
      });
    });
  });
});
