'use strict';

var traceur = require('traceur');
// var _ = require('lodash');
var Notification = traceur.require(__dirname + '/../models/notification.js');
var Campaign = traceur.require(__dirname + '/../models/campaign.js');
var Project = traceur.require(__dirname + '/../models/project.js');
var Doc = traceur.require(__dirname + '/../models/doc.js');

exports.create = (req, res)=>{
  Doc.create(req.body, doc=>{
    Project.findById(doc.projectId, project=>{
      Campaign.findById(project.campaignId, campaign=>{
        Notification.buildList(doc, campaign, ()=>{
          res.redirect('/projects/'+req.body.projectId);
        });
      });
    });
  });
};
