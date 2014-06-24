'use strict';

var traceur = require('traceur');
var _ = require('lodash');
// var User = traceur.require(__dirname + '/../models/user.js');
var Campaign = traceur.require(__dirname + '/../models/campaign.js');
var Project = traceur.require(__dirname + '/../models/project.js');
var Doc = traceur.require(__dirname + '/../models/doc.js');

exports.create = (req, res)=>{
  Project.create(req.body, project=>{
    res.redirect('/projects/'+project._id);
  });
};

exports.show = (req, res)=>{
  Project.findById(req.params.id, project=>{
    if(project){
      Doc.findAllByProjectId(project._id, docs=>{
        Campaign.findByIdFullObject(project.campaignId, campaign=>{
          console.log('Editors: ');
          console.log(campaign.editorIds);
          console.log('This user: ');
          console.log(req.session.userId);
          var edCheck = _.contains(campaign.editorIds, req.session.userId);
          console.log('edCheck value: ');
          console.log(edCheck);
          if (req.session.userId === campaign.ownerId.toString()){
            console.log('You own this.');
            res.render('projects/show', {campaign: campaign, project:project, docs:docs, title: 'Project: ' + project.name});
          } else if (edCheck){
            console.log('You edit this.');
            res.render('projects/show', {campaign: campaign, project:project, docs:docs, title: 'Project: ' + project.name});
          } else {
            console.log('Nice try.');
            res.redirect('/dashboard');
          }
        });
      });
    } else{
      res.redirect('/dashboard');
    }
  });
};

exports.edit = (req, res)=>{
  Project.findById(req.params.id, project=>{
    if(project){
      Campaign.findById(project.campaignId, campaign=>{
        if (req.session.userId === campaign.ownerId.toString()){
          res.render('projects/editProject', {project: project, title: 'Edit Your Project'});
        } else {
          res.redirect('/dashboard');
        }
      });
    } else {
      res.redirect('/dashboard');
    }
  });
};

exports.update = (req, res)=> {
  Project.findById(req.body.projectId, project=>{
    project.update(req.body, ()=>{
      res.redirect('/projects/' + req.body.projectId);
    });
  });
};
