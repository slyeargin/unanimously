var notificationCollection = global.nss.db.collection('notifications');
var userCollection = global.nss.db.collection('users');
var campaignCollection = global.nss.db.collection('campaigns');
var projectCollection = global.nss.db.collection('projects');
// var request = require('request');
var _ = require('lodash');
// var async = require('async');
var Mongo = require('mongodb');
var traceur = require('traceur');
var Base = traceur.require(__dirname + '/base.js');
// var User = traceur.require(__dirname + '/user.js');

class Notification{
  static create(obj, recipientId, fn){
    var notification = new Notification();
    notification._id = Mongo.ObjectID(obj._id);
    notification.type = obj.type;
    notification.campaignId = Mongo.ObjectID(obj.campaignId);
    notification.projectId = Mongo.ObjectID(obj.projectId);
    notification.recipientId = obj.recipientId ? obj.recipientId : Mongo.ObjectID(recipientId);
    notification.fromId = Mongo.ObjectID(obj.fromId);
    notification.date = new Date();
    console.log('Notification created!');
    console.log(notification);
    notificationCollection.save(notification, ()=>{
      // notification.createMessage(notification=>{
      //   // sendUpdateEmail(notification, fn);
      //   fn(notification);
      // });
      console.log('Notification saved.');
      fn(notification);
    });
  }

  static findById(id, fn){
    Base.findById(id, notificationCollection, Notification, fn);
  }

  static findAllByRecipientId(id, fn){
    if(!id){fn(null); return;}
    if(typeof id === 'string'){
      if(id.length !== 24){fn(null); return;}
      id = Mongo.ObjectID(id);
    }
    notificationCollection.find({recipientId:id}).toArray((e,objs)=>{
      objs = objs.map(o=>_.create(Notification.prototype, o));
      console.log('Notifications found: ');
      console.log(objs);
      // map through objs
      // notification.createMessage(notification=>{
      //   // sendUpdateEmail(notification, fn);
      //   fn(notification);
      fn(objs);
    });
  }

  static listgen(obj, fn){
    projectCollection.findOne({_id:obj.projectId}, (e,p)=>{
      console.log('Project found?');
      console.log(p);
      campaignCollection.findOne({_id:p.campaignId}, (e,c)=>{
        console.log('Campaign found?');
        console.log(c);
        obj.campaignId = c._id;
        var notifylist = _.without(c.editorIds, obj.creatorId);
        if (obj.creatorId !== c.ownerId){
          notifylist.push(c.ownerId);
        }
        console.log('What is the notifylist?');
        console.log(notifylist);
        notifylist.map(n=>{
          console.log('What is obj? ');
          console.log(obj);
          Notification.create(obj, n, ns=>{
            fn(ns);
          });
        });
      });
    });
  }

  createMessage(fn){
    console.log('This? ');
    console.log(this);
    userCollection.findOne({_id:this.fromId}, (e,u)=>{
      this.from = u.name;
      userCollection.findOne({_id:this.recipientId}, (e,u)=>{
        console.log('Find user?');
        console.log(u);
        this.recipientEmail = u.email;
        projectCollection.findOne({_id:this.projectId}, (e,p)=>{
          console.log('Find project?');
          console.log(p);
          this.project = p.name;
          campaignCollection.findOne({_id:this.campaignId}, (e,c)=>{
            console.log('Find campaign?');
            console.log(c);
            this.campaign = c.name;
            console.log('After DB: ');
            console.log(this);

            if (this.type === 'doc'){
              this.message = this.from + ' has updated ' + this.project + ' in ' + this.campaign + '.';
              this.subject = this.project + ' has been updated.';
              this.link = '<a href="http://localhost:4000/projects/' + this.projectId + '">View ' + this.project + ' on Unanimous.ly.</a>';
              console.log('After notification type: ');
              console.log(this);

              fn(this);
            }

            if (this.type === 'project'){
              this.message = this.from + ' has created ' + this.project + ' in ' + this.campaign + '.';
              this.subject = 'A new project has been added to ' + this.campaign + '.';
              this.link = '<a href="http://localhost:4000/projects/' + this.projectId + '">View ' + this.project + ' on Unanimous.ly.</a>';
              console.log('After notification type: ');
              console.log(this);

              fn(this);
            }
          });
        });
      });
    });
  }

  remove(fn){
    notificationCollection.findAndRemove({_id:this._id}, notification=>{
      fn(notification);
    });
  }

}


// function sendUpdateEmail(notification, fn){
//   'use strict';
//   var key = process.env.MAILGUN;
//   var url = 'https://api:' + key + '@api.mailgun.net/v2/sandboxcf74801602ec4522bb675027e5f4e47c.mailgun.org/messages'; //sandbox... is my subdomain they gave me, if add my website, then it would go there
//   var post = request.post(url, function(err, response, body){
//     fn(notification);
//   });
//
//   var form = post.form();
//   form.append('from', 'admin@slyeargin.com');
//   form.append('to', notification.recipientEmail);
//   form.append('subject', 'Unanimous.ly: ' + notification.subject);
//   form.append('html', notification.message + '<br /><br />' + notification.link);
// }

module.exports = Notification;
