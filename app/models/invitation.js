var invitationCollection = global.nss.db.collection('invitations');
var request = require('request');
var _ = require('lodash');
var Mongo = require('mongodb');

class Invitation{
  static create(obj, fn){
    var invitation = new Invitation();
    invitation._id = Mongo.ObjectID(obj._id);
    invitation.campaignId = Mongo.ObjectID(obj.campaignId);
    invitation.invitee = obj.email;
    invitation.from = Mongo.ObjectID(obj.from);

    invitationCollection.save(invitation, ()=>{
      sendAddNoticeEmail(invitation, fn);
    });
  }

  static findAllByInviteeEmail(user, fn){
    if(!user || !user.email){fn(null); return;}
    invitationCollection.find({invitee:user.email}).toArray((e,objs)=>{
      objs = objs.map(o=>_.create(Invitation.prototype, o));
      fn(objs);
    });
  }

  static duplicateCheck(email, campaignId, fn){
    if(!email || !campaignId){fn(null); return;}
    var dupCheck = {
      invitee: email,
      campaignId: Mongo.ObjectID(campaignId)
    };

    invitationCollection.findOne(dupCheck, (e,o)=>{
      if(o){
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

function sendAddNoticeEmail(invitation, fn){
  'use strict';
  var key = process.env.MAILGUN;
  var url = 'https://api:' + key + '@api.mailgun.net/v2/sandboxcf74801602ec4522bb675027e5f4e47c.mailgun.org/messages'; //sandbox... is my subdomain they gave me, if add my website, then it would go there
  var post = request.post(url, function(err, response, body){
    fn(invitation);
  });

  var form = post.form();
  form.append('from', 'admin@slyeargin.com');
  form.append('to', invitation.invitee);
  form.append('subject', 'You\'ve been added to a campaign on Unanimously.');
  form.append('html', 'You\'ve been added to a campaign on Unanimously. <a href="http://localhost:4000/register">Register</a> to begin writing collaboratively.');
}

module.exports = Invitation;
