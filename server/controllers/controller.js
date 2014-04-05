"use strict";

var UserDAO = require('../daos/users').UserDAO;
var TrabajoDAO = require('../daos/trabajos').TrabajoDAO;

function Controller(commons) {
	

	//var usersDAO = new UsersDAO(commons.getVar('db'));
	//console.log(UserDAO);
	var userDao = new UserDAO(commons.getVar('db'), commons.getVar('mongoose'));
	var trabajoDao = new TrabajoDAO(commons.getVar('db'), commons.getVar('mongoose'));
	var that = this;

	this.login = function(udata, callback) {
		userDao.authenticate(udata, function(err, data){
			if (err) return callback(err,data);

			callback(err, data);
		});
	};

	this.getUserById = function(udata, callback){
		userDao.getUser(udata, function(err, data){
			
			if (err) return callback(err,data);
			console.log('getUser');
			console.log(data);
			callback(err, data);
		});
	};
	
	this.getObjetivo = function(udata, callback){
		userDao.getObjetivo(udata, function(err, data){
			
			if (err) return callback(err,data);
			
			callback(err, data);
		});
	};

	this.createUser = function(udata, callback) {
		userDao.createUser(udata, function(err, data){
			
			if (err) return callback(err,data);

			callback(err, data);			
		});
	};

	this.createTrabajo = function(udata, callback) {
		trabajoDao.createTrabajo(udata, function(err, data){
			
			if (err) return callback(err,data);
			console.log('trabajo creado');
			console.log(data);


			that.asignarEstudiante(data, function(err, data) {
				if (err) return callback(err,data);

				callback(err, data);	
			});

			//callback(err, data);			
		});
	};

	this.getTrabajos = function(_id, callback) {
		trabajoDao.getTrabajos(_id, function(err, data){
			
			if (err) return callback(err,data);

			callback(err, data);			
		});
	};

	this.asignarEstudiante = function(tdata, callback) {
		console.log("Asignando Estudiante!!");
		userDao.buscarEstudiante(tdata, function(err, estudiante){			
			if (err) return callback(err,estudiante);

			trabajoDao.asignarEstudiante(tdata._id, estudiante._id, function(err, respuesta) {
				if (err) return callback(err,respuesta);

				callback(err, respuesta);	
			});
					
		});
	};

	this.aceptarTrabajo = function(tdata, callback) {
		console.log("Aceptando Trabajo!!");

			trabajoDao.aceptarTrabajo(tdata, function(err, respuesta) {
				if (err) return callback(err,respuesta);

				callback(err, respuesta);	
			});
					
	};

	this.cerrarTrabajo = function(tdata, callback) {
		console.log("Aceptando Trabajo!!");

			trabajoDao.cerrarTrabajo(tdata, function(err, trabajo) {
				if (err) return callback(err,respuesta);

				userDao.updateObjetivo(tdata,trabajo.trabajador, function(err, res) {
					if (err) return callback(err,res);


					callback(err, res);	
				});

				
			});
					
	};
}

module.exports = Controller;