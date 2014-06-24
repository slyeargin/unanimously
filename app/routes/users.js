'use strict';

var traceur = require('traceur');
var User = traceur.require(__dirname + '/../models/user.js');
var Campaign = traceur.require(__dirname + '/../models/campaign.js');
var Invitation = traceur.require(__dirname + '/../models/invitation.js');
var Notification = traceur.require(__dirname + '/../models/notification.js');


exports.validate = (req, res)=>{
  User.create(req.body, user=>{
    if(user){
      res.redirect('/register');
    }else{
      res.redirect('/login');
    }
  });
};

exports.register = (req, res)=>{
  if(res.locals.user){
    res.redirect('/dashboard');
  } else{
    res.render('users/preverify', {title: 'Unanimously | Check Your E-mail'});
  }
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
    if(u){
      if (!u.isValid){
        res.render('users/verify', {u:u, title: 'Unanimously | User Verification'});
      } else {
        res.redirect('/');
      }
    }else{
      res.redirect('/');
    }
  });
};

exports.reset = (req, res)=>{
  User.findById(req.params.id, u=>{
    if(u){
      User.reset(u, ()=>res.redirect('/logout'));
    } else {
      res.redirect('/logout');
    }
  });
};

exports.password = (req, res)=>{
  User.findById(req.params.id, u=>{
    if(u){
      res.render('users/reset', {user:u, title: 'Reset Your Password'});
    } else {
      res.redirect('/');
    }
  });
};

exports.forgot = (req, res)=>{
  if(res.locals.user){
    res.redirect('/dashboard');
  } else{
    res.render('users/forgot', {title: 'Reset Your Password'});
  }
};

exports.getreset = (req, res)=>{
  User.findByEmail(req.body.email, u=>{
    if(u){
      User.reset(u, ()=>res.redirect('/login'));
    } else {
      res.redirect('/');
    }
  });
};

exports.changePassword = (req, res)=>{
  User.findById(req.body.userId, user=>{
    if(user){
      user.changePassword(req.body.password, ()=>{
        res.redirect('/login');
      });
    } else {
      res.redirect('/');
    }
  });
};


exports.verifyAccount = (req, res)=>{
  User.findById(req.params.id, user=>{
    if(user){
      if (!user.isValid){
        user.update(req.body, ()=>{
          user.changePassword(req.body.password, user=>{
            Invitation.findAllByInviteeEmail(user, invites=>{
              if(invites){
                invites = invites.map(i=>{
                  Campaign.findById(i.campaignId, campaign=>{
                    campaign.addEditor(user, ()=>i.remove());
                  });
                });
              }
              res.redirect('/login');
            });
          });
        });
      } else {
        res.redirect('/login');
      }
    } else {
      res.redirect('/');
    }
  });
};

exports.profile = (req, res)=>{
  res.render('users/editProfile', {title: 'Edit Your Profile'});
};

exports.update = (req, res)=> {
  User.findById(req.session.userId, user=>{
    user.update(req.body, ()=>{
      res.redirect('/dashboard');
    });
  });
};

exports.login = (req, res)=>{
  if(res.locals.user){
    res.redirect('/dashboard');
  }else{
    res.render('users/login', {title: 'Unanimously | User Login'});
  }
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
  Campaign.findAllByOwnerId(res.locals.user._id, myCampaigns=>{
    Campaign.findAllByEditorIds(res.locals.user._id, otherCampaigns=>{
      Notification.countAllByRecipientId(res.locals.user._id, count=>{
        res.render('users/dashboard', {myCampaigns: myCampaigns, otherCampaigns: otherCampaigns, notifications: count, title: 'Dashboard'});
      });
    });
  });
};
