'use strict';

var traceur = require('traceur');
var Notification = traceur.require(__dirname + '/../models/notification.js');

exports.remove = (req, res)=>{
  Notification.findById(req.body.notificationId, notification=>{
    if(notification){
      notification.remove(notification=>{
        if(notification){
          res.redirect('/dashboard');
        } else {
          res.redirect('/dashboard');
        }
      });
    } else {
      res.redirect('/dashboard');
    }
  });
};
