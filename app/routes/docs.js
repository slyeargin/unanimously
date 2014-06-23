'use strict';

var traceur = require('traceur');
// var User = traceur.require(__dirname + '/../models/user.js');
// var Campaign = traceur.require(__dirname + '/../models/campaign.js');
// var Project = traceur.require(__dirname + '/../models/project.js');
var Doc = traceur.require(__dirname + '/../models/doc.js');
var Notification = traceur.require(__dirname + '/../models/notification.js');

exports.create = (req, res)=>{
  Doc.create(req.body, doc=>{
    doc.type = 'doc';
    Notification.listgen(doc, notification=>{
      console.log('Notification generated and saved');
      console.log(notification);
      res.redirect('/projects/'+req.body.projectId);
    });
  });
};
