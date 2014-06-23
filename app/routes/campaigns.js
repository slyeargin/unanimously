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
  Campaign.findByIdFullObject(req.params.id, campaign=>{
    if(campaign){
      Project.findAllByCampaignId(campaign._id, projects=>{
        res.render('campaigns/show', {campaign:campaign, projects:projects, title: 'Campaign: ' + campaign.name});
      });
    } else {
      res.redirect('/dashboard');
    }
  });
};

exports.addEditor = (req, res)=>{
  User.findByEmail(req.body.email, user=>{
    if(user){
      Campaign.findById(req.body.campaignId, campaign=>{
        campaign.addEditor(user, user=>{
          if(user){
            res.redirect('/campaigns/' + req.body.campaignId);
          } else {
            res.redirect('/campaigns/' + req.body.campaignId);
          }
        });
      });
    } else {
      Invitation.duplicateCheck(req.body.email, req.body.campaignId, invite=>{
        if(!invite){
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

exports.removeEditor = (req, res)=>{
  User.findById(req.body.editorId, user=>{
    if(user){
      Campaign.findById(req.body.campaignId, campaign=>{
        campaign.removeEditor(user, user=>{
          console.log('What gets returned?');
          console.log(user);
          if (user){
            if(req.body.editorId === res.locals.user._id){
              res.redirect('/dashboard');
            } else {
              res.redirect('/campaigns/' + req.body.campaignId);
            }
          }
           else {
            res.redirect('/campaigns/' + req.body.campaignId);
          }
        });
      });
    } else {
      res.redirect('/campaigns/' + req.body.campaignId);
    }
  });
};

exports.edit = (req, res)=>{
  console.log('Req.params.id');
  console.log(req.params.id);
  Campaign.findById(req.params.id, campaign=>{
    if(campaign){
      res.render('campaigns/editCampaign', {campaign: campaign, title: 'Edit Your Campaign'});
    } else {
      res.redirect('/dashboard');
    }
  });
};

exports.update = (req, res)=> {
  Campaign.findById(req.body.campaignId, campaign=>{
    campaign.update(req.body, ()=>{
      res.redirect('/campaigns/' + req.body.campaignId);
    });
  });
};
