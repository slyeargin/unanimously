var notificationCollection = global.nss.db.collection('notifications');
// var request = require('request');
var async = require('async');
var _ = require('lodash');
var Mongo = require('mongodb');
var traceur = require('traceur');
var Base = traceur.require(__dirname + '/base.js');

class Notification{
  static create(obj, fn){
    var notification = new Notification();
    notification._id = Mongo.ObjectID(obj._id);
    notification.recipientId = Mongo.ObjectID(obj.recipientId);
    notification.docId = Mongo.ObjectID(obj.docId);
    notification.created = new Date();

    notificationCollection.save(notification, ()=>{
      // sendAddNoticeEmail(notification, fn);
      fn(notification);
    });
  }

  static findById(id, fn){
    Base.findById(id, notificationCollection, Notification, fn);
  }

  static findAllByRecipientId(userId, fn){
    if(typeof userId === 'string'){
      if(userId.length !== 24){fn(null); return;}
      userId = Mongo.ObjectID(userId);
    }

    if(!(userId instanceof Mongo.ObjectID)){fn(null); return;}

    notificationCollection.find({recipientId:userId}).toArray((e,objs)=>{
      objs = objs.map(o=>_.create(Notification.prototype, o));
      fn(objs);
    });
  }

  static buildList(doc, campaign, fn){
    var notifylist = [];
    var dup = _.contains(campaign.editorIds, doc.creatorId.toString());
    if(dup === false){
      notifylist = campaign.editorIds;
    }else{
      notifylist = _.without(campaign.editorIds, doc.creatorId.toString());
      notifylist.push(campaign.ownerId);
    }
    var objs = notifylist.map(n=> n = {recipientId: n, docId: doc._id});
    async.map(objs, creationIterator, (e,objs)=>fn(objs));
  }


  remove(fn){
    notificationCollection.findAndRemove({_id:this._id}, notification=>{
      fn(notification);
    });
  }

}

function creationIterator(obj, fn){
  'use strict';

  Notification.create(obj, obj=>fn(null, obj));
}


// function sendAddNoticeEmail(notification, fn){
//   'use strict';
//   var key = process.env.MAILGUN;
//   var url = 'https://api:' + key + '@api.mailgun.net/v2/sandboxcf74801602ec4522bb675027e5f4e47c.mailgun.org/messages'; //sandbox... is my subdomain they gave me, if add my website, then it would go there
//   var post = request.post(url, function(err, response, body){
//     fn(notification);
//   });
//
//   var form = post.form();
//   form.append('from', 'admin@slyeargin.com');
//   form.append('to', notification.recipientId);
//   form.append('subject', 'You\'ve been added to a campaign on Unanimously.');
//   form.append('html', 'You\'ve been added to a campaign on Unanimously. <a href="http://localhost:4000/register">Register</a> to begin writing collaboratively.');
// }

module.exports = Notification;
