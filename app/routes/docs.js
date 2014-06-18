'use strict';

var traceur = require('traceur');
// var User = traceur.require(__dirname + '/../models/user.js');
// var Campaign = traceur.require(__dirname + '/../models/campaign.js');
// var Project = traceur.require(__dirname + '/../models/project.js');
var Doc = traceur.require(__dirname + '/../models/doc.js');

exports.create = (req, res)=>{
  Doc.create(req.body, ()=>{
    res.redirect('/projects/'+req.body.projectId);
  });
};
