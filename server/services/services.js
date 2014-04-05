"use strict";

var requestify = require('requestify');
var request = require('request');
//URL Finance Web Server
var URL = 'http://localhost:4000/';
//var URL = 'http://finandev2.brokerstars.com/index.php/';

function Services(commons) {

    /* If this constructor is called without the "new" operator, "this" points
    * to the global object. Log a warning and call it correctly. */

    if (false === (this instanceof Services)) {
      console.log('Warning: Services constructor called without "new" operator');
      return new Services();
    }

    this.login = function(username, password, callback) {
      console.log("llamandao login service");
      var json = {'username': username,
      'password': password}; 
      requestify.post(URL+'login', json)
      .then(function(response) {   
            // Get the response body (JSON parsed or jQuery object for XMLs)

            var data = JSON.parse(response.body);
            console.log(data);

            callback(null,data);
            
          });
    }; 

    this.getUserById = function(userId, callback) {
      console.log("llamandao Get User By Id service del intermediario");
      var params = {'id': userId}; 
      console.log(userId);
      requestify.get(URL+'user/'+userId, params)
      .then(function(response) {
        console.log("esperando respuesta servidor ");        
            // Get the response body (JSON parsed or jQuery object for XMLs)

            var data = JSON.parse(response.body);

            console.log(data);

            callback(null,data);
            
          });
    };

    this.createUser = function(udata, callback) {
      console.log("llamandao user service del intermediario para crear USuario");
      var json = {user: udata}; 
      console.log(json);

      request.post(
      URL+'userGames',
      {form:{user: udata}},
      function (error, response, body) {
          if (!error && response.statusCode == 200) {
              console.log(body)
              var data = JSON.parse(body);
              callback(null,data);
        }
      });
    };

    this.getPartidaNueva = function(udata, callback) {
      console.log("llamandao get Partida del intermediario");
      requestify.get(URL+'partidaGuessIt/'+udata.userId+'/'+udata.username)
      .then(function(response) {
        console.log("esperando respuesta servidor ");        
            // Get the response body (JSON parsed or jQuery object for XMLs)
            var data = JSON.parse(response.body);
            console.log(data);
            callback(null,data);
            
          });
    };

    this.getRanking = function(callback) {
      requestify.get(URL+'rankingGuessIt')
      .then(function(response) {
        console.log("esperando respuesta /ranking");        
            // Get the response body (JSON parsed or jQuery object for XMLs)
            var data = JSON.parse(response.body);
            callback(null,data);
          });
    };

    this.getHistorial10 = function(udata, callback) {
      console.log("llamandao Get Historial service del intermediario");

      requestify.get(URL+'historialGuessIt10/'+udata.userId)
      .then(function(response) {
        console.log("esperando respuesta servidor ");        
        // Get the response body (JSON parsed or jQuery object for XMLs)
        var data = JSON.parse(response.body);
        console.log(data);
        callback(null,data); 
      });
    };

    this.getHistorial = function(udata, callback) {
      console.log("llamandao Get Historial service del intermediario");

      requestify.get(URL+'historialGuessIt/'+udata.userId)
      .then(function(response) {
        console.log("esperando respuesta servidor ");        
        // Get the response body (JSON parsed or jQuery object for XMLs)
        var data = JSON.parse(response.body);
        console.log(data);
        callback(null,data); 
      });
    };

    this.getPartida = function(udata, callback) {
      console.log("llamandao Get Historial service del intermediario");

      requestify.get(URL+'partidaGuessIt/'+udata._id)
      .then(function(response) {
        console.log("esperando respuesta servidor ");        
        // Get the response body (JSON parsed or jQuery object for XMLs)
        var data = JSON.parse(response.body);
        console.log(data);
        callback(null,data); 
      });
    };

    this.pronostico = function(udata, callback) {
      console.log("llamandao pronostico");
      console.log(udata);

      request.post(
      URL+'pronosticoGuessIt',
      {form:udata},
      function (error, response, body) {
          if (!error && response.statusCode == 200) {
              console.log(body)
              var data = JSON.parse(body);
              callback(null,data);
          }
        });
      }
  }

  module.exports.Services = Services;
