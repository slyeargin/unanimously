var campaignCollection = global.nss.db.collection('campaigns');
// var request = require('request');
var Mongo = require('mongodb');
var traceur = require('traceur');
var Base = traceur.require(__dirname + '/base.js');

class Campaign{
  static create(obj, owner, fn){
    var campaign = new Campaign();
    campaign._id = Mongo.ObjectID(obj._id);
    campaign.name = obj.name;
    campaign.description = obj.description;
    campaign.ownerId = owner._id;
    campaign.editorIds = [];

    campaignCollection.save(campaign, ()=>{
      fn(this);
    });
  }

  static findById(id, fn){
    Base.findById(id, campaignCollection, Campaign, fn);
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

module.exports = Campaign;
