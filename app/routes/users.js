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
      Invitation.findAllByEmail(user, invites=>{
        if(invites){
          console.log(invites);
          //  objs = objs.map(o=>_.create(Campaign.prototype, o));
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
