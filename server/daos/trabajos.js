"use strict";


function TrabajoDAO(db, mongoose) {
	

	if (false === (this instanceof TrabajoDAO)) {
		console.log('Warning: TrabajoDAO constructor called without "new" operator!');
		return new TrabajoDAO(db);
	}

	var that = this;
	var Schema = mongoose.Schema;
	var ObjectId = Schema.ObjectId;
	var ObjectId2 = require('mongodb').BSONPure.ObjectID;

	//User Model
	var TrabajoSchema = mongoose.Schema({
		titulo: { type: String, required: true },
		descripcion: { type: String, required: true},
		especialidad: [{ type: String, required: true }],
		horario: [{ type: String, required: true }],
		zona: [{ type: String, default: ''}],
		telefono: { type: String, default: ''},	
		estado: { type: String, default: 'abierto'},
		fecha: { type: String, default: ''},
		rating: { type: String, default: ''},
		dinero: Number,
		cliente: ObjectId,
		trabajador: ObjectId
	});

	var Trabajo = mongoose.model('trabajo', TrabajoSchema);

	this.getTrabajo = function(data, callback) {
		console.log("Trabajo: "+data._id);
		var query = Trabajo.findOne({'_id': data._id});

		// execute the query at a later time
		query.exec(function (err, trabajo) {

			if (err) return callback(err,trabajo);

			if (trabajo === null) {
				return callback({"err": "trabajo not exists"}, false);
			} 
			callback(err, trabajo);
		});
	}

	this.createTrabajo = function(data, callback) {
		var newTrabajo = new Trabajo({ 
			titulo			: data.titulo,
			descripcion		: data.descripcion,
			especialidad	: data.especialidad,
			horario			: data.horario,
			zona			: data.zona,
			telefono		: data.telefono,
			estado 			: data.estado,
			cliente 		: data.cliente,
			trabajador 		: data.trabajador
		});

		newTrabajo.save(function(err, trabajo) {
			if (err) return callback(err,trabajo);
			callback(err, newTrabajo);
		});

	}

	this.getTrabajos = function(_id, callback) {
		//var query = Trabajo.find({'trabajador': _id});
		var query = Trabajo.find({$or: [{'trabajador': _id}, {'cliente': _id}]});
		
		// execute the query at a later time
		query.exec(function (err, trabajos) {
			if (err) return callback(err,trabajos);

			callback(err, trabajos);
		});
	}

	this.asignarEstudiante = function(trabajoId, estudianteId, callback) {
		Trabajo.update({ '_id': trabajoId }, { $set: { 'trabajador': estudianteId, 'estado': 'asignado'}}, function (err, trabajoUpdated) {
		//uPartida.save(function(err, partidaUpdated) {  
		  console.log(err);
		  console.log(trabajoUpdated);
		  if (err) return callback(err, null);
		  callback(err, trabajoUpdated);
		});
	}

	this.aceptarTrabajo = function(data, callback) {
		Trabajo.update({ '_id': new ObjectId2(data.trabajoId) }, { $set: { 'fecha': data.fecha, 'estado': 'aceptado'}}, function (err, trabajoUpdated) {
		//uPartida.save(function(err, partidaUpdated) {  
		  console.log(err);
		  console.log(trabajoUpdated);
		  if (err) return callback(err, null);
		  callback(err, trabajoUpdated);
		});
	}

	this.cerrarTrabajo = function(data, callback) {
		Trabajo.update({ '_id': new ObjectId2(data.trabajoId) }, { $set: { 'precio': data.precio, 'estado': 'cerrado'}}, function (err, trabajoUpdated) {
		//uPartida.save(function(err, partidaUpdated) {  
	
		  if (err) return callback(err, null);

		  var query = Trabajo.findOne({'_id': new ObjectId2(data.trabajoId)});

			// execute the query at a later time
			query.exec(function (err, trabajo) {

				if (err) return callback(err,trabajo);

				if (trabajo === null) {
					return callback({"err": "trabajo not exists"}, false);
				} 
				callback(err, trabajo);
			});
		  //callback(err, trabajoUpdated);
		});
	}
	
}

module.exports.TrabajoDAO = TrabajoDAO;