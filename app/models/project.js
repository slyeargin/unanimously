var projectCollection = global.nss.db.collection('projects');
// var request = require('request');
var _ = require('lodash');
var sanitizeHtml = require('sanitize-html');
var Mongo = require('mongodb');
var traceur = require('traceur');
var Base = traceur.require(__dirname + '/base.js');

class Project{
  static create(obj, fn){
    var project = new Project();
    project._id = Mongo.ObjectID(obj._id);
    project.name = sanitizeHtml(obj.name, {
      allowedTags: [],
      allowedAttributes: {},
      selfClosing: [],
      allowedSchemes: []
    });
    project.medium = sanitizeHtml(obj.medium, {
      allowedTags: [],
      allowedAttributes: {},
      selfClosing: [],
      allowedSchemes: []
    });
    project.notes = sanitizeHtml(obj.notes, {
      allowedTags: [],
      allowedAttributes: {},
      selfClosing: [],
      allowedSchemes: []
    });
    project.campaignId = Mongo.ObjectID(obj.campaignId);
    //project.creatorId = Mongo.ObjectID(obj.creatorId);

    projectCollection.save(project, ()=>{
      fn(project);
    });
  }

  static findById(id, fn){
    Base.findById(id, projectCollection, Project, fn);
  }

  static findAllByCampaignId(id, fn){
    if(typeof id === 'string'){
      if(id.length !== 24){fn(null); return;}
      id = Mongo.ObjectID(id);
    }

    if(!(id instanceof Mongo.ObjectID)){fn(null); return;}

    projectCollection.find({campaignId:id}).toArray((e,objs)=>{
      objs = objs.map(o=>_.create(Project.prototype, o));
      fn(objs);
    });
  }

  update(obj, fn){
    if (obj.name.length){
      this.name = sanitizeHtml(obj.name, {
        allowedTags: [],
        allowedAttributes: {},
        selfClosing: [],
        allowedSchemes: []
      });
    }
    if (obj.medium.length){
      this.medium = sanitizeHtml(obj.medium, {
        allowedTags: [],
        allowedAttributes: {},
        selfClosing: [],
        allowedSchemes: []
      });
    }
    if (obj.notes.length){
      this.notes = sanitizeHtml(obj.notes, {
        allowedTags: [],
        allowedAttributes: {},
        selfClosing: [],
        allowedSchemes: []
      });
    }

    projectCollection.save(this, ()=>fn(this));
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

module.exports = Project;
