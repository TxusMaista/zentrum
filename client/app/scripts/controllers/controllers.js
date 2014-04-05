'use strict';

angular.module('hack4goodApp')
  .controller('MainCtrl', function ($scope, $http, $location, $rootScope) {
    $scope.username = null;
    $scope.password = null;

    $scope.inLogin = function(){
    	$("#login").css("display", "block");
    	$("#login").addClass("moveL");
    }

    $scope.login = function(){
    	$http({
	      method: 'POST',
	      url: 'http://169.254.12.197:5005/login',
	      type: 'json',
	      data: {username:$scope.username, password:$scope.password}
	    }).
	    success(function (data, status, headers, config) {
  			$rootScope.user = data;
  			$location.path("/user");
	    }).
	    error(function (data, status, headers, config) {
	    	console.log("Data loading fail.");
	    });
    }

  })
  .controller('ProfileCtrl', function ($scope, $http, $rootScope) {

  	$scope.user = null;
  	$scope.tareas = null;
  	$scope.ntarea = {id:null, titulo:null, descripcion:null, especialidad:null, fecha:null, horario:null, zona:null, telefono:null};
  	
  	$http({
      method: 'GET',
      url: 'http://169.254.12.197:5005/perfil/'+$rootScope.user.passport.user._id,
      type: 'json'
    }).
    success(function (data, status, headers, config) {
		$scope.user = data;
		if($scope.user.rol == "cliente")
			$("#pImg").attr("src", "img/client.png");
		else
			$("#pImg").attr("src", "img/student.png");
		console.log($scope.user);
    }).
    error(function (data, status, headers, config) {
    	console.log("Data loading fail.");
    });

    $http({
      method: 'GET',
      url: 'http://169.254.12.197:5005/trabajos/'+$rootScope.user.passport.user._id,
      type: 'json'
    }).
    success(function (data, status, headers, config) {
		$scope.tareas = data;
		console.log($scope.tareas);
		for(var i=0;i<$scope.tareas.length;i++){
			switch($scope.tareas[0].estado){
				case "pendiente":$scope.tareas[i].color = "orange";break;
				case "asignado":$scope.tareas[i].color = "orange";break;
				case "cerrado":$scope.tareas[i].color = "green";break;
			}
		}
    }).
    error(function (data, status, headers, config) {
    	console.log("Data loading fail.");
    });

    $scope.sendTarea = function(){
    	$scope.ntarea.id = $rootScope.user.passport.user._id;
  		$http({
	      method: 'POST',
	      url: 'http://169.254.12.197:5005/trabajo',
	      type: 'json',
	      data: {id:$rootScope.user.passport.user._id, titulo:$scope.ntarea.titulo, descripcion:$scope.ntarea.descripcion, especialidad:$scope.ntarea.especialidad, fecha:$scope.ntarea.fecha, horario:$scope.ntarea.horario, zona:$scope.ntarea.zona, telefono:$scope.ntarea.telefono}
	    }).
	    success(function (data, status, headers, config) {
			$("#nTarea").css("display", "none");
	  		$("#move").removeClass("move");
	  		console.log("cierra");
	    }).
	    error(function (data, status, headers, config) {
	    	console.log("Data loading fail.");
	    });

  	}

  	$scope.ntarea = function(id){
  		$("#nTarea").css("display", "block");
  		$("#move").addClass("move");
  		console.log(id);
  	}

  	$scope.ltarea = function(id){
  		$("#tarea").css("display", "block");
  		$("#fMove").addClass("move");
  		console.log(id);
  	}

  	$scope.close = function(){
  		$("#tarea").css("display", "none");
  		$("#fMove").removeClass("move");
  		console.log("cierra");
  	}

  	$scope.nclose = function(){
  		$("#nTarea").css("display", "none");
  		$("#move").removeClass("move");
  		console.log("cierra");
  	}

  });
