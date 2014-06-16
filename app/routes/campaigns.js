'use strict';

var traceur = require('traceur');
// var User = traceur.require(__dirname + '/../models/user.js');
var Campaign = traceur.require(__dirname + '/../models/campaign.js');
var Project = traceur.require(__dirname + '/../models/project.js');

exports.create = (req, res)=>{
  Campaign.create(req.body, campaign=>{
    res.redirect('/campaigns/'+campaign._id);
  });
};

exports.show = (req, res)=>{
  Campaign.findById(req.params.id, campaign=>{
    if(campaign){
      Project.findAllByCampaignId(campaign._id, projects=>{
        res.render('campaigns/show', {campaign:campaign, projects:projects, title: 'Unanimously | Campaign: ' + campaign.name});
      });
    } else {
      res.redirect('/dashboard');
    }
  });
};
