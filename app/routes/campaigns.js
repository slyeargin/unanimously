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
      console.log('User exists!');
      // add to campaign, ensuring no duplicates
      Campaign.findById(req.body.campaignId, campaign=>{
        campaign.addEditor(user, user=>{
          if(user){
            console.log('Added user');
            // added first time
            res.redirect('/campaigns/' + req.body.campaignId);
          } else {
            // send null if not added because of duplicate
            console.log('User was already added');
            res.redirect('/campaigns/' + req.body.campaignId);
          }
        });
      });
    } else {
      // ensure no duplicates
      Invitation.duplicateCheck(req.body.email, req.body.campaignId, invite=>{
        if(!invite){
          console.log('No existing invite');
          // create invitation
          console.log('Req.body: ');
          console.log(req.body);
          Invitation.create(req.body, ()=>{
            console.log('Invite created');
            res.redirect('/campaigns/' + req.body.campaignId);
          });
        } else {
          // do not create duplicate invitation
          console.log('You try too hard');
          res.redirect('/campaigns/' + req.body.campaignId);
        }
      });
    }
  });
};
