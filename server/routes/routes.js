"use strict";

var Controller = require('../controllers/controller');

module.exports = function(app, commons, passport) {

	var controller = new Controller(commons);
	var passportConf = require('../modules/security/passport')(passport, controller);
	
	function ensureAuthenticated(req, res, next) {
		if (req.isAuthenticated()) { return next(); }
		res.jsonp({message: "invalid-authentication"});
		// res.redirect('http://localhost:9001/login');
	}

	app.all('/*', function(req, res, next) {
		res.header("Access-Control-Allow-Origin", "http://localhost:9000");
		res.header('Access-Control-Allow-Credentials', true);
		res.header("Access-Control-Allow-Headers", "Content-Type, X-Requested-With");
		res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
		next();
	});

	app.post('/login', function(req, res, next){
		passport.authenticate('local', function(err, user, info) {
			if (err) { return next(err); }
			if (!user) { return res.json(info); }
			req.logIn(user, function(err) {
				if (err) { return next(err); }
				//req.session.user = req.user;
				res.setHeader('Access-Control-Allow-Credentials', true);
				return res.json(req.session);
			});
		})(req, res, next);

	});

	app.get('/logout', function(req, res){

		req.logout();
		res.json({message: "logout"});
	});

	app.get('/session', ensureAuthenticated, function(req, res){
		res.json(true);
	});

	app.post('/user', function(req, res){
		if (!req.param('username')) {
			return res.json({err: "missing username"});
		} 
		if (!req.param('email')) {
			return res.json({err: "missing email"});
		}
		if (!req.param('password')) {
			return res.json({err: "missing password"});
		} 

		controller.createUser({
			username 		: req.param('username'),
			email			: req.param('email'),
			rol				: req.param('rol'),
			password		: req.param('password'),
			name			: req.param('name'),
			surname			: req.param('surname'),
			zona			: req.param('zona'),
			horario 		: req.param('horario'),
			especialidades 	: req.param('especialidades'),
			telefono 		: req.param('telefono'),
			objetivo 		: req.param('objetivo')
		}, function(err, data){
			if (err) return res.json(err);

			res.json(data);
		});	
	});

	app.post('/trabajo', function(req, res){
		controller.createTrabajo({
			titulo 			: req.param('titulo'),
			descripcion		: req.param('descripcion'),
			especialidad	: req.param('especialidad'),
			horario			: req.param('horario'),
			zona			: req.param('zona'),
			telefono		: req.param('telefono'),
			cliente 		: req.param('id')
		}, function(err, data){
			if (err) return res.json(err);

			res.json(data);

			// controller.asignarEstudiante(data, function(err, data2) {
			// 	if (err) return res.json(err);				

			// 	res.json(data2);
			// });
		});	
	});

	app.get('/trabajos/:id', function(req, res){
		//console.log(req.session.passport.user.userId);

		controller.getTrabajos(
			req.param('id')
		,function(err, data){
			if (err) return res.json(err);

			res.json(data);
		});	
	});

	app.get('/perfil/:id', function(req, res){
		//console.log(req.session.passport.user.userId);
		console.log(req.param('id'));
		
		controller.getUserById(
			{'_id': req.param('id')}
		,function(err, data){
			if (err) return res.json(err);

			res.json(data);
		});	
	});

	app.get('/objetivo/_id', function(req, res){
		//console.log(req.session.passport.user.userId);
		
		controller.getObjetivo(
			{'_id': req.param('id')}
		,function(err, data){
			if (err) return res.json(err);

			res.json(data);
		});	
	});

	app.post('/aceptar', function(req, res){
		//console.log(req.session.passport.user.userId);
		
		controller.aceptarTrabajo(
			{'trabajoId': req.param('trabajoId'),
			 'fecha': req.param('fecha')}
		,function(err, data){
			if (err) return res.json(err);

			res.json(data);
		});	
	});

	app.post('/cerrar', function(req, res){
		//console.log(req.session.passport.user.userId);
		
		controller.cerrarTrabajo(
			{'rating': req.param('rating'),
			 'trabajoId': req.param('trabajoId'),
			 'precio': req.param('precio')}
		,function(err, data){
			if (err) return res.json(err);

			res.json(data);
		});	
	});

}