var invitationCollection = global.nss.db.collection('invitations');
// var request = require('request');
var _ = require('lodash');
var Mongo = require('mongodb');
// var traceur = require('traceur');
// var Base = traceur.require(__dirname + '/base.js');

class Invitation{
  static create(obj, fn){
    var invitation = new Invitation();
    invitation._id = Mongo.ObjectID(obj._id);
    invitation.campaignId = Mongo.ObjectID(obj.campaignId);
    invitation.invitee = obj.email;
    invitation.from = Mongo.ObjectID(obj.from);

    invitationCollection.save(invitation, ()=>{
      // send the invitenotify e-mail
      fn(invitation);
    });
  }

  // static findById(id, fn){
  //   Base.findById(id, invitationCollection, Invitation, fn);
  // }

  static findAllByInviteeEmail(user, fn){
    if(!user.email){fn(null); return;}
    invitationCollection.find({invitee:user.email}).toArray((e,objs)=>{
      objs = objs.map(o=>_.create(Invitation.prototype, o));
      fn(objs);
    });
  }

  static duplicateCheck(email, campaignId, fn){
    console.log('Inside the duplicate check!');
    if(!email || !campaignId){fn(null); return;}
    console.log('Email: ');
    console.log(email);
    console.log('Campaign ID: ');
    console.log(campaignId);
    console.log('OID campaignId: ');
    console.log(campaignId);

    var dupCheck = {
      invitee: email,
      campaignId: Mongo.ObjectID(campaignId)
    };

    invitationCollection.findOne(dupCheck, (e,o)=>{
      if(o){
        console.log('Already invited!');
        fn(o);
      }else{
        fn(null);
      }
    });
  }

  remove(fn){
    invitationCollection.findAndRemove({_id:this._id}, invite=>{
      fn(invite);
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

module.exports = Invitation;
