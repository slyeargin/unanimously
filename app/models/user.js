var userCollection = global.nss.db.collection('users');
var request = require('request');
var Mongo = require('mongodb');
var bcrypt = require('bcrypt');
var gravatar = require('gravatar');
var _ = require('lodash');
var traceur = require('traceur');
var Base = traceur.require(__dirname + '/base.js');

class User{
  static create(obj, fn){
    userCollection.findOne({email:obj.email}, (e,u)=>{
      if(u){
        fn(null);
      }else{
        var user = new User();
        user._id = Mongo.ObjectID(obj._id);
        user.email = obj.email;
        user.name = obj.name ? obj.name : obj.email;
        user.photo = gravatar.url(user.email, {s: '200', r: 'pg', d: 'mm'}, false);
        user.password = obj.password ? bcrypt.hashSync(obj.password, 8) : '';
        user.isValid = obj.isValid ? obj.isValid : false;

        userCollection.save(user, ()=>{
          if (!user.password){
            sendVerificationEmail(user, fn);
          }else{
            fn(user);
          }
        });
      }
    });
  }

  static login(obj, fn){
    userCollection.findOne({email:obj.email}, (e,user)=>{
      if(user){
        var isGood = bcrypt.compareSync(obj.password, user.password);
        if(isGood && user.isValid){
          fn(user);
        }else{
          fn(null);
        }
      }else{
        fn(null);
      }
    });
  }

  static findById(id, fn){
    Base.findById(id, userCollection, User, fn);
  }

  static findByEmail(email, fn){
    if(!email){fn(null); return;}
    userCollection.findOne({email:email}, (e,o)=>{
      if(o){
        o = _.create(User.prototype, o);
        fn(o);
      }else{
        fn(null);
      }
    });
  }

  changePassword(password, fn){
    if(this){
      this.password = bcrypt.hashSync(password, 8);
      this.isValid = true;
      userCollection.save(this, ()=>{
        fn(this);
      });
    }else{
      fn(null);
    }
  }

  update(obj, fn){
    this.name = obj.name.length ? obj.name : this.email;

    userCollection.save(this, ()=>fn(this));
  }
}

function sendVerificationEmail(user, fn){
  'use strict';
  var key = process.env.MAILGUN;
  var url = 'https://api:' + key + '@api.mailgun.net/v2/sandboxcf74801602ec4522bb675027e5f4e47c.mailgun.org/messages'; //sandbox... is my subdomain they gave me, if add my website, then it would go there
  var post = request.post(url, function(err, response, body){
    fn(user);
  });

  var form = post.form();
  form.append('from', 'admin@slyeargin.com');
  form.append('to', user.email);
  form.append('subject', 'Please verify your e-mail address.');
  form.append('html', '<a href="http://localhost:4000/verify/' + user._id + '">Click to Verify</a>');
}

module.exports = User;
