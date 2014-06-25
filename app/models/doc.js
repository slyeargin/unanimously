var docCollection = global.nss.db.collection('docs');
var _ = require('lodash');
var async = require('async');
var sanitizeHtml = require('sanitize-html');
var Mongo = require('mongodb');
var traceur = require('traceur');
var Base = traceur.require(__dirname + '/base.js');
var User = traceur.require(__dirname + '/../models/user.js');

class Doc{
  static create(obj, fn){
    var doc = new Doc();
    doc._id = Mongo.ObjectID(obj._id);
    doc.projectId = Mongo.ObjectID(obj.projectId);
    doc.copy = sanitizeHtml(obj.copy, {
      allowedTags: [ 'b', 'i', 'em', 'strong' ],
      allowedAttributes: {},
      selfClosing: [],
      allowedSchemes: []
    });
    doc.notes = sanitizeHtml(obj.notes, {
      allowedTags: [],
      allowedAttributes: {},
      selfClosing: [],
      allowedSchemes: []
    });
    doc.creatorId = Mongo.ObjectID(obj.creatorId);
    doc.date = obj.date ? new Date(obj.date) : new Date();
    doc.isFinal = obj.isFinal? true : false;

    docCollection.save(doc, ()=>{
      fn(doc);
    });
  }

  static findById(id, fn){
    Base.findById(id, docCollection, Doc, fn);
  }

  static findAllByProjectId(id, fn){
    if(typeof id === 'string'){
      if(id.length !== 24){fn(null); return;}
      id = Mongo.ObjectID(id);
    }

    if(!(id instanceof Mongo.ObjectID)){fn(null); return;}

    docCollection.find({projectId:id}).sort( { date: -1 } ).toArray((e,objs)=>{
      objs = objs.map(o=>_.create(Doc.prototype, o));
      async.map(objs, addUserInfo, (e, docs)=>{
        objs = docs;
        fn(objs);
      });
    });
  }

  static countAllByProjectId(id, fn){
    if(typeof id === 'string'){
      if(id.length !== 24){fn(null); return;}
      id = Mongo.ObjectID(id);
    }

    if(!(id instanceof Mongo.ObjectID)){fn(null); return;}

    docCollection.count({projectId:id}, (e,count)=>{
      fn(count);
    });
  }
}

function addUserInfo(doc, fn){
  'use strict';

  User.findById(doc.creatorId, user=>{
    doc.creator = user;
    fn(null, doc);
  });
}

module.exports = Doc;
