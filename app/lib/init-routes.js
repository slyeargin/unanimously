'use strict';

var traceur = require('traceur');
var dbg = traceur.require(__dirname + '/route-debugger.js');
var initialized = false;

module.exports = (req, res, next)=>{
  if(!initialized){
    initialized = true;
    load(req.app, next);
  }else{
    next();
  }
};

function load(app, fn){
  var home = traceur.require(__dirname + '/../routes/home.js');
  var users = traceur.require(__dirname + '/../routes/users.js');
  var notifications = traceur.require(__dirname + '/../routes/notifications.js');
  var campaigns = traceur.require(__dirname + '/../routes/campaigns.js');
  var projects = traceur.require(__dirname + '/../routes/projects.js');
  var docs = traceur.require(__dirname + '/../routes/docs.js');

  app.all('*', users.lookup);

  app.get('/', dbg, home.index);

  app.get('/register', dbg, users.register);
  app.post('/register', dbg, users.validate);

  app.get('/verify/:id', dbg, users.verify);
  app.post('/verify/:id', dbg, users.verifyAccount);
  app.get('/reset/:id', dbg, users.password);
  app.post('/reset/:id', dbg, users.reset);
  app.get('/forgot', dbg, users.forgot);
  app.post('/forgot', dbg, users.getreset);
  app.post('/changepassword', dbg, users.changePassword);

  app.get('/login', dbg, users.login);
  app.post('/login', dbg, users.authenticate);

  app.all('*', users.bounce);

  app.get('/logout', dbg, users.logout);
  app.get('/dashboard', dbg, users.dashboard);

  app.get('/notifications', dbg, notifications.show);
  app.post('/notifications/remove', dbg, notifications.destroy);

  app.get('/profile', dbg, users.profile);
  app.post('/profile', dbg, users.update);

  app.post('/campaigns/create', dbg, campaigns.create);
  app.get('/campaigns/edit/:id', dbg, campaigns.edit);
  app.post('/campaigns/edit', dbg, campaigns.update);
  app.get('/campaigns/:id', dbg, campaigns.show);
  app.post('/campaigns/addEditor', dbg, campaigns.addEditor);
  app.post('/campaigns/removeEditor', dbg, campaigns.removeEditor);

  app.post('/projects/create', dbg, projects.create);
  app.get('/projects/edit/:id', dbg, projects.edit);
  app.post('/projects/edit', dbg, projects.update);
  app.get('/projects/:id', dbg, projects.show);

  app.post('/docs/create', dbg, docs.create);

  console.log('Routes Loaded');
  fn();
}
