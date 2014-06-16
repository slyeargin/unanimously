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

// exports.index = (req, res)=>{
//   Campaign.findAllByOwnerId(res.locals.user, myCampaigns=>{
//     // add in otherCampaigns
//     res.render('campaigns/', {myCampaigns: myCampaigns, title: 'Unanimously | Campaigns'});
//   });
// };

exports.show = (req, res)=>{
  Campaign.findById(req.params.id, campaign=>{
    console.log('Campaign? ');
    console.log(campaign);
    res.render('campaigns/show', {campaign: campaign, title: 'Unanimously | Campaigns | ' + campaign.name});
    // Project.findAllByCampaignId(campaign._id, projects=>{
    //   console.log('Projects? ');
    //   console.log(projects);
    //   res.render('campaigns/show', {campaign: campaign, projects: projects, title: 'Unanimously | Campaigns | ' + campaign.name});
    // });
  });
};



exports.dashboard = (req, res)=>{
  Campaign.findAllByOwnerId(res.locals.user._id, campaigns=>{
    res.render('users/dashboard', {campaigns: campaigns, title: 'Unanimously | Dashboard'});
  });
};
