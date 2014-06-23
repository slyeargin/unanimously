var campaignCollection = global.nss.db.collection('campaigns');
var request = require('request');
var _ = require('lodash');
var Mongo = require('mongodb');
var traceur = require('traceur');
var async = require('async');
var User = traceur.require(__dirname + '/../models/user.js');
var Base = traceur.require(__dirname + '/base.js');

class Campaign{
  static create(obj, fn){
    var campaign = new Campaign();
    campaign._id = Mongo.ObjectID(obj._id);
    campaign.name = obj.name;
    campaign.description = obj.description;
    campaign.ownerId = Mongo.ObjectID(obj.ownerId);
    campaign.editorIds = obj.editorIds ? obj.editorIds : [];

    campaignCollection.save(campaign, ()=>{
      fn(campaign);
    });
  }

  static findById(id, fn){
    Base.findById(id, campaignCollection, Campaign, fn);
  }

  static findByIdFullObject(id, fn){
    if(typeof id === 'string'){
      if(id.length !== 24){fn(null); return;}
      id = Mongo.ObjectID(id);
    }

    if(!(id instanceof Mongo.ObjectID)){fn(null); return;}

    campaignCollection.findOne({_id:id}, (e,campaign)=>{
      if(campaign){
        campaign = _.create(Campaign.prototype, campaign);
        User.findById(campaign.ownerId, user=>{
          campaign.owner = user;
        });
        async.map(campaign.editorIds, addEditorInfo, (e, editors)=>{
          campaign.editors = editors;
          fn(campaign);
        });
      }else{
        fn(null);
      }
    });
  }

  static findAllByOwnerId(id, fn){
    if(typeof id === 'string'){
      if(id.length !== 24){fn(null); return;}
      id = Mongo.ObjectID(id);
    }

    if(!(id instanceof Mongo.ObjectID)){fn(null); return;}

    campaignCollection.find({ownerId:id}).toArray((e,objs)=>{
      objs = objs.map(o=>_.create(Campaign.prototype, o));
      fn(objs);
    });
  }

  static findAllByEditorIds(id, fn){
    if (!id){fn(null); return;}
    if(id instanceof Mongo.ObjectID){
      id = id.toString();
    }
    if(typeof id === 'string'){
      if(id.length !== 24){fn(null); return;}
    }

    campaignCollection.find({ editorIds: { '$in' : [id]} }).toArray((e,objs)=>{
      objs = objs.map(o=>_.create(Campaign.prototype, o));
      fn(objs);
    });
  }

  addEditor(user, fn){
    if(this && this.ownerId.toString() !== user._id.toString()){
      var dup = _.contains(this.editorIds, user._id.toString());
      if(dup === false){
        this.editorIds.push(user._id.toString());
        campaignCollection.save(this, ()=>{
          sendAddNoticeEmail(user, this, fn);
        });
      }else{
        fn(null);
      }
    }else{
      fn(null);
    }
  }

  removeEditor(user, fn){
    var removedUser = user._id.toString();
    var newList = _.without(this.editorIds, removedUser);
    this.editorIds = newList;
    console.log('New Campaign Object: ');
    console.log(this);
    campaignCollection.save(this, ()=>fn(this));
  }
}

function addEditorInfo(id, fn){
  'use strict';

  User.findById(id, user=>{
    fn(null, user);
  });
}

function sendAddNoticeEmail(user, campaign, fn){
  'use strict';
  var key = process.env.MAILGUN;
  var url = 'https://api:' + key + '@api.mailgun.net/v2/sandboxcf74801602ec4522bb675027e5f4e47c.mailgun.org/messages'; //sandbox... is my subdomain they gave me, if add my website, then it would go there
  var post = request.post(url, function(err, response, body){
    fn(user);
  });

  var form = post.form();
  form.append('from', 'admin@slyeargin.com');
  form.append('to', user.email);
  form.append('subject', 'You\'ve been added to the ' + campaign.name + ' campaign.');
  form.append('html', 'You\'ve been added to the <a href="http://localhost:4000/campaigns/' + campaign._id + '">' + campaign.name + '</a> campaign.');
}

module.exports = Campaign;
