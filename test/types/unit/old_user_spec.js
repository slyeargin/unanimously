// /* global describe, it, before, beforeEach */
// // beforeEach, afterEach */
// /* jshint expr:true */
//
// 'use strict';
//
// process.env.DBNAME = 'unanimous-test';
//
// var expect = require('chai').expect;
// var Mongo = require('mongodb');
// var app = require('../../../app/app');
// var request = require('supertest');
// var traceur = require('traceur');
// var factory = traceur.require(__dirname + '/../../helpers/factory.js');
//
// var User;
//
// describe('User', function(){
//   before(function(done){
//     request(app)
//     .get('/')
//     .end(function(){
//       User = traceur.require(__dirname + '/../../../app/models/user.js');
//       done();
//     });
//   });
//
//   beforeEach(function(done){
//     global.nss.db.collection('users').drop(function(){
//       factory('user', function(users){
//         done();
//       });
//     });
//   });
//
//   describe('.create', function(){
//     it('should successfully create a user', function(done){
//       var fields = {
//         email:'samantha@yearg.in'
//       };
//
//       User.create(fields, function(u){
//         expect(u).to.be.ok;
//         expect(u).to.be.an.instanceof(User);
//         expect(u._id).to.be.an.instanceof(Mongo.ObjectID);
//         done();
//       });
//     });
//
//     it('should NOT successfully register a user - user already exists', function(done){
//       User.create({email:'samantha@yearg.in'}, function(u){
//         expect(u).to.be.null;
//         done();
//       });
//     });
//
//     // it('should NOT successfully register a user - user already exists', function(done){
//     //   User.create({email:'slyeargin+tester@gmail.com'}, function(u){
//     //     expect(u).to.be.null;
//     //     done();
//     //   });
//     // });
//   });
//
//   // describe('.login', function(){
//   //   it('should successfully login a user', function(done){
//   //     User.login({email:'bill@aol.com', password:'1234'}, function(u){
//   //       expect(u).to.be.ok;
//   //       done();
//   //     });
//   //   });
//   //
//   //   it('should NOT login user - bad email', function(done){
//   //     User.login({email:'wrong@aol.com', password:'5678'}, function(u){
//   //       expect(u).to.be.null;
//   //       done();
//   //     });
//   //   });
//   //
//   //   it('should NOT login user - bad password', function(done){
//   //     User.login({email:'bill@aol.com', password:'wrong'}, function(u){
//   //       expect(u).to.be.null;
//   //       done();
//   //     });
//   //   });
//   // });
//
//   // describe('.findById', function () {
//   //   it('should return a user with matching credentials', function (done) {
//   //     User.findById('0123456789abcdef01234567', function (user) {
//   //       expect(user).to.be.ok;
//   //       expect(user).to.be.instanceof(User);
//   //       expect(user.email).to.equal('bill@aol.com');
//   //       done();
//   //     });
//   //   });
//   //
//   //   it('should return a null user object', function (done) {
//   //     User.findById('538de154065c89565f9bde6c', function (user) {
//   //       expect(user).to.be.null;
//   //       done();
//   //     });
//   //   });
//   // });
//
//   // describe('#update', function () {
//   //   it('should update a user - no profile pic', function (done) {
//   //     User.findById('0123456789abcdef01234567', function (user) {
//   //
//   //       var obj = {
//   //         sex: ['female'],
//   //         race: ['black'],
//   //         religion: ['Jewish'],
//   //         bodyType: ['hourglass with extra minutes'],
//   //         height: ['66'],
//   //         age: ['23'],
//   //         about: ['I am a successful, independent black woman looking for love.'],
//   //         lookingFor: ['male, female'],
//   //         photo: [{
//   //           originalFilename: 'profilePic5.jpg',
//   //           path: '../../test/pictures/copy/profilePic5.jpg',
//   //           size: 10
//   //         }]
//   //       };
//   //
//   //       user.update(obj, function (user) {
//   //         expect(user).to.be.ok;
//   //         expect(user).to.be.instanceof(User);
//   //         expect(user._id).to.be.instanceof(Mongo.ObjectID);
//   //         expect(user._id.toString()).to.deep.equal('0123456789abcdef01234567');
//   //         expect(user.email).to.equal('bill@aol.com');
//   //         expect(user.zip).to.equal('37203');
//   //         expect(user.sex).to.equal('female');
//   //         expect(user.race).to.equal('black');
//   //         expect(user.religion).to.equal('Jewish');
//   //         expect(user.bodyType).to.equal('hourglass with extra minutes');
//   //         expect(user.height).to.equal('66');
//   //         expect(user.about).to.equal('I am a successful, independent black woman looking for love.');
//   //         done();
//   //       });
//   //     });
//   //   });
//   // });
//
// });
