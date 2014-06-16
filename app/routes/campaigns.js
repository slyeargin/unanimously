'use strict';

var traceur = require('traceur');
// var User = traceur.require(__dirname + '/../models/user.js');
var Campaign = traceur.require(__dirname + '/../models/campaign.js');
// var Project = traceur.require(__dirname + '/../models/project.js');

exports.create = (req, res)=>{
  Campaign.create(req.body, campaign=>{
    res.redirect('/campaigns/'+campaign._id);
  });
};

exports.dashboard = (req, res)=>{
  Campaign.findAllByOwnerId(res.locals.user._id, campaigns=>{
    res.render('users/dashboard', {campaigns: campaigns, title: 'Unanimously | Dashboard'});
  });
};

// exports.show = (req, res)=>{
//   Campaign.findById(req.params.id, campaign=>{
//     res.render('campaigns/show', {campaign:campaign, title: 'Unanimously | Campaign: ' + campaign.name});
//   });
// };
