'use strict';

var traceur = require('traceur');
// var User = traceur.require(__dirname + '/../models/user.js');
// var Campaign = traceur.require(__dirname + '/../models/campaign.js');
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
        res.render('projects/show', {project:project, docs:docs, title: 'Unanimously | Project: ' + project.name});
      });
    } else{
      res.redirect('/dashboard');
    }
  });
};
