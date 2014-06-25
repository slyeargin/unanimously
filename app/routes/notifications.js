'use strict';

var moment = require('moment');
var traceur = require('traceur');
var Notification = traceur.require(__dirname + '/../models/notification.js');


exports.show = (req, res)=>{
  Notification.findAllByRecipientId(req.session.userId, notifications=>{
    Notification.getFullObjects(notifications, fullNotifications=>{
      res.render('notifications/show', {moment: moment, notifications: fullNotifications});
    });
  });
};

exports.destroy = (req, res)=>{
  Notification.findById(req.body.notificationId, notification=>{
    if (notification){
      notification.remove(()=>{
        res.redirect('/notifications');
      });
    } else {
      res.redirect('/notifications');
    }
  });
};
