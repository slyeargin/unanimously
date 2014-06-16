var docCollection = global.nss.db.collection('docs');
// var request = require('request');
var _ = require('lodash');
var Mongo = require('mongodb');
var traceur = require('traceur');
var Base = traceur.require(__dirname + '/base.js');

class Doc{
  static create(obj, fn){
    var doc = new Doc();
    doc._id = Mongo.ObjectID(obj._id);
    doc.projectId = Mongo.ObjectID(obj.projectId);
    doc.copy = obj.copy;
    doc.notes = obj.notes;
    doc.date = new Date();
    doc.isFinal = false;

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

    docCollection.find({projectId:id}).toArray((e,objs)=>{
      objs = objs.map(o=>_.create(Doc.prototype, o));
      fn(objs);
    });
  }
}

// function sendVerificationEmail(user, fn){
//   'use strict';
//   var key = process.env.MAILGUN;
//   var url = 'https://api:' + key + '@api.mailgun.net/v2/sandboxcf74801602ec4522bb675027e5f4e47c.mailgun.org/messages'; //sandbox... is my subdomain they gave me, if add my website, then it would go there
//   var post = request.post(url, function(err, response, body){
//     console.log('--------sending message--------');
//     console.log(body);
//     fn(user);
//   });
//
//   var form = post.form();
//   form.append('from', 'admin@slyeargin.com');
//   form.append('to', user.email);
//   form.append('subject', 'Please verify your e-mail address.');
//   form.append('html', '<a href="http://localhost:4000/verify/' + user._id + '">Click to Verify</a>');
// }

module.exports = Doc;