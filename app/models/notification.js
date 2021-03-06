var notificationCollection = global.nss.db.collection('notifications');
var async = require('async');
var _ = require('lodash');
var Mongo = require('mongodb');
var traceur = require('traceur');
var Base = traceur.require(__dirname + '/base.js');
var Doc = traceur.require(__dirname + '/../models/doc.js');
var User = traceur.require(__dirname + '/../models/user.js');
var Project = traceur.require(__dirname + '/../models/project.js');

class Notification{
  static create(obj, fn){
    var notification = new Notification();
    notification._id = Mongo.ObjectID(obj._id);
    notification.recipientId = Mongo.ObjectID(obj.recipientId);
    notification.docId = Mongo.ObjectID(obj.docId);
    notification.created = new Date();

    notificationCollection.save(notification, ()=>{
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

    notificationCollection.find({recipientId:userId}).sort( { created: -1 } ).toArray((e,objs)=>{
      objs = objs.map(o=>_.create(Notification.prototype, o));
      fn(objs);
    });
  }

  static getFullObjects(objs, fn){
    async.map(objs, addDocInfo, (e, docObjs)=>{
      async.map(docObjs, createMessage, (e, fullObjs)=>{
        fn(fullObjs);
      });
    });
  }

  static countAllByRecipientId(userId, fn){
    if(typeof userId === 'string'){
      if(userId.length !== 24){fn(null); return;}
      userId = Mongo.ObjectID(userId);
    }

    if(!(userId instanceof Mongo.ObjectID)){fn(null); return;}

    notificationCollection.count({recipientId:userId}, (e,count)=>{
      fn(count);
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

function createMessage(obj, fn){
  'use strict';

  var message;

  if (obj.document.isFinal){
    message = obj.docCreatorName + ' posted the final version of ' + obj.project.name + '.';
    obj.message = message;
    fn(null, obj);
  } else {
    Doc.countAllByProjectId(obj.docId, count=>{
      if (count === 1){
        message = obj.docCreatorName + ' created ' + obj.project.name  + '.';
        obj.message = message;
        fn(null, obj);
      } else {
        message = obj.docCreatorName + ' updated ' + obj.project.name + '.';
        obj.message = message;
        fn(null, obj);
      }
    });
  }
}

function addDocInfo(obj, fn){
  'use strict';

  Doc.findById(obj.docId, doc=>{
    obj.document = doc;
    Project.findById(doc.projectId, project=>{
      obj.project = project;
      User.findById(doc.creatorId, user=>{
        obj.docCreatorName = user.name;
        fn(null, obj);
      });
    });
  });
}

function creationIterator(obj, fn){
  'use strict';

  Notification.create(obj, obj=>fn(null, obj));
}

module.exports = Notification;
