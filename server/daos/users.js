"use strict";

var bcrypt = require('bcrypt'),
SALT_WORK_FACTOR = 10;
var uuid = require('node-uuid');

// var User = require('../models/user-model');

function UserDAO(db, mongoose) {
	

	if (false === (this instanceof UserDAO)) {
		console.log('Warning: UsersDAO constructor called without "new" operator!');
		return new UserDAO(db);
	}
	var ObjectId2 = require('mongodb').BSONPure.ObjectID;

	var that = this;

	//User Model
	var UserSchema = mongoose.Schema({
		username: { type: String, required: true, index: { unique: true } },
		email: { type: String, required: true, index: { unique: true } },
		password: { type: String, required: true },
		rol: { type: String, required: true },
		name: { type: String, default: ''},
		surname: { type: String, default: ''},	
		zona: [{ type: String, default: ''}],
		horario: [],
		especialidades: [{ type: String, default: ''}],
		telefono: { type: String, default: ''},
		objetivo: {dinero : Number, titulo: String, descripcion : String, recaudado :  Number}
	});

	UserSchema.methods.comparePassword = function(candidatePassword, cb) {
		console.log(candidatePassword);
		console.log(this.password);
	    bcrypt.compare(candidatePassword, this.password, function(err, isMatch) {
	        if (err) return cb(err);
	        console.log(isMatch);
	        cb(null, isMatch);
	    });
	};

	var User = mongoose.model('users', UserSchema);

	this.getUser = function(data, callback) {
		console.log("User: "+data._id);
		var query = User.findOne({'_id': data._id});

		// execute the query at a later time
		query.exec(function (err, user) {

			if (err) return callback(err,user);

			if (user === null) {
				return callback({"err": "user not exists"}, false);
			} 
			callback(err, user);
		});
	}

	this.buscarEstudiante = function(data, callback) {

		//db.users.find({rol: 'estudiante', especialidades: { $in: ['mac', 'informatica']}}).pretty();
		//db.users.find({rol: 'estudiante', especialidades: { $in: ['mac', 'informatica']}, horario: { $in: [19]}, zona: { $in: ['bilbo']}}).pretty();
		var query = User.findOne({'rol': 'estudiante', 'especialidades': { $in: data.especialidad}, 'horario': { $in: data.horario}, 'zona': { $in: data.zona}});

		// execute the query at a later time
		query.exec(function (err, user) {

			if (err) return callback(err,user);

			if (user === null) {
				return callback({"err": "user not exists"}, false);
			} 
			callback(err, user);
		});
	}

	this.getObjetivo = function(data, callback) {
		console.log("User: "+data._id);
		var query = User.findOne({'_id': data._id}, {objetivo: 1});

		// execute the query at a later time
		query.exec(function (err, user) {

			if (err) return callback(err,user);

			if (user === null) {
				return callback({"err": "user not exists"}, false);
			} 
			callback(err, user);
		});
	}

	this.updateUser = function(user, callback) {
		users.findOne({userId: user.userId}, function(err, item) {

			if (err) return callback(err, item);

			if (item === null) {
				return callback({"err": "user not exists"},false);
			} 

			item.name = data.name;
			item.alias = data.alias;
			item.surname = data.surname;

			users.update({_id:user._id}, user, function (err, item) {
				"use strict";

				if (err) return callback(err, null);

				callback(err, user);
			});
		});
	}

	this.authenticate = function(data, callback) {
		// find each person with a last name matching 'Ghost'
		var query = User.findOne({'username': data.username});

		// execute the query at a later time
		query.exec(function (err, user) {

			if (err) return callback(err,user);

			if (user === null) {
				return callback({"err": "El usuario no existe."},false);
			} else {
				// test a matching password
				user.comparePassword(data.password, function(err, isMatch) {
					if (err) throw err;
					if (!isMatch) {
						return callback({"err": "Contraseña incorrecta."},false);
					} else {
						console.log(user);
						callback(err, user);	
					}
				});
			}
		});
	};

	this.createUser = function(data, callback) {

		var newUser = new User({ 
			username		: data.username,
			name			: data.name,
			password		: data.password,
			rol				: data.rol,
			surname			: data.surname,
			email 			: data.email,
			zona 			: data.zona,
			horario 		: data.horario,
			especialidades 	: data.especialidades,
			telefono 		: data.telefono,
			objetivo 		: data.objetivo
		});

		// generate a salt
		bcrypt.genSalt(SALT_WORK_FACTOR, function(err, salt) {
			console.log(err);
			if (err) return callback(err);

		    // hash the password using our new salt
		    bcrypt.hash(newUser.password, salt, function(err, hash) {
		    	if (err) return callback(err);

		        // override the cleartext password with the hashed one
		        newUser.password = hash;
		        		// save user to database
		        		newUser.save(function(err, user) {
		        			if (err) return callback(err,user);
		        			callback(err, user);
		        		});
		        	});
		});
	}

	this.exists = function(data, callback) {

		var query = User.findOne({'username': data.username});

		// execute the query at a later time
		query.exec(function (err, user) {
			if (err) return callback(err,user);

			if (user !== null) {
				return callback({"err": "username exists"},true);
			} else {
				
				var query3 = User.findOne({'email': data.email});
				query3.exec(function (err, user3) {
					if (err) return callback(err,user3);

					if (user3 !== null){
						return callback({err: "email exists"},true);
					} else {
						return callback(err, false);
					}

				});
				
			}
		});
	}

	this.updateObjetivo = function(data,userId, callback) {

		console.log("updating user");
		console.log(userId);
		User.update({ '_id': userId }, { $inc: { 'objetivo.recaudado': data.precio}}, function (err, success) {
		//uPartida.save(function(err, partidaUpdated) {  
		  console.log(err);
		  console.log(success);
		  if (err) return callback(err, null);
		  callback(err, success);
		});
	}

	
}

module.exports.UserDAO = UserDAO;