"use strict";

function Commons() {
	
	var globals = [];
	var that = this;

	this.checkVar = function(name) {
		var result = false;
		if(globals[name] != undefined) result = true;
		return result;
	};

	this.setVar = function(name, value) {
		var result = false;
		if(!that.checkVar(name)){
			globals[name] = value;
			result = true;
		}
		return result;
	};

	this.getVar = function(name) {
		var result = null;
		if(that.checkVar(name))result = globals[name];
		return result;
	};

	this.printVars = function() {
		console.log(globals);
	}
};

module.exports = Commons;