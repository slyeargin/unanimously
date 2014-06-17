'use strict';

var traceur = require('traceur');
var User = traceur.require(__dirname + '/../models/user.js');
var Campaign = traceur.require(__dirname + '/../models/campaign.js');
var Invitation = traceur.require(__dirname + '/../models/invitation.js');

exports.register = (req, res)=>{
  res.render('users/register', {title: 'Register User'});
};

exports.validate = (req, res)=>{
  User.create(req.body, user=>{
    if(user){
      res.redirect('/');
    }else{
      res.redirect('/register');
    }
  });
};

exports.lookup = (req, res, next)=>{
  User.findById(req.session.userId, user=>{
    if(user){
      res.locals.user = user;
    }

    next();
  });
};

exports.bounce = (req, res, next)=>{
  if(res.locals.user){
    next();
  }else{
    res.redirect('/login');
  }
};

exports.verify = (req, res)=>{
  User.findById(req.params.id, u=>{
    res.render('users/verify', {u:u, title: 'User Verification'});
  });
};

exports.verifyAccount = (req, res)=>{
  User.findById(req.params.id, user=>{
    user.changePassword(req.body.password, user=>{
      Invitation.findAllByInviteeEmail(user, invites=>{
        if(invites){
          console.log('Here are the invites!');
          console.log(invites);
          invites = invites.map(i=>{
            console.log('Each individual invite: ');
            console.log(i);
            Campaign.findById(i.campaignId, campaign=>{
              campaign.addEditor(user, user=>{
                if(user){
                  // added first time
                  console.log('Added user');
                  i.remove(()=>{
                    res.redirect('/campaigns/' + req.body.campaignId);
                  });
                } else {
                  // send null if not added because of duplicate
                  console.log('User was already added');
                  i.remove(()=>{
                    res.redirect('/campaigns/' + req.body.campaignId);
                  });
                }
              });
            });
          });
        }
        res.redirect('/login');
      });
    });
  });
};

exports.login = (req, res)=>{
  res.render('users/login', {title: 'User Login'});
};

exports.authenticate = (req, res)=>{
  User.login(req.body, user=>{
    if(user){
      req.session.userId = user._id;
      res.redirect('/dashboard');
    }else{
      req.session = null;
      res.redirect('/login');
    }
  });
};

exports.logout = (req, res)=>{
  req.session = null;
  res.redirect('/login');
};

exports.dashboard = (req, res)=>{
  Campaign.findAllByOwnerId(res.locals.user._id, campaigns=>{
    res.render('users/dashboard', {campaigns: campaigns, title: 'Unanimously | Dashboard'});
  });
};
