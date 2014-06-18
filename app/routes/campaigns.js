'use strict';

var traceur = require('traceur');
var User = traceur.require(__dirname + '/../models/user.js');
var Campaign = traceur.require(__dirname + '/../models/campaign.js');
var Project = traceur.require(__dirname + '/../models/project.js');
var Invitation = traceur.require(__dirname + '/../models/invitation.js');

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

exports.addEditor = (req, res)=>{
  User.findByEmail(req.body.email, user=>{
    if(user){
      console.log('Found user!');
      console.log(user);
      Campaign.findById(req.body.campaignId, campaign=>{
        console.log('Found campaign!');
        console.log(campaign);
        campaign.addEditor(user, user=>{
          if(user){
            console.log('Returned user: ');
            console.log(user);
            res.redirect('/campaigns/' + req.body.campaignId);
          } else {
            res.redirect('/campaigns/' + req.body.campaignId);
          }
        });
      });
    } else {
      console.log('Did not find user');
      Invitation.duplicateCheck(req.body.email, req.body.campaignId, invite=>{
        if(!invite){
          console.log('No duplicate invites');
          Invitation.create(req.body, ()=>{
            res.redirect('/campaigns/' + req.body.campaignId);
          });
        } else {
          res.redirect('/campaigns/' + req.body.campaignId);
        }
      });
    }
  });
};
