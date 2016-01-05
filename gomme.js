var Gomme = (function(window){
	'use strict';
	var Gomme = {
		model:function model(name, structure){
			var method = Function('return function '+name.replace(/[^a-z|A-Z]/g, '')+'(a, b, c, d, e, f, g, h, i, j, k){\
				Object.defineProperty(this, "$", {\
					enumerable:false,\
					configurable:true,\
					writable:true,\
					value:new Gomme.Classes.$()\
				});\
				if (typeof this.$.constructor === "function"){\
					this.$.constructor(a, b, c, d, e, f, g, h, i, j, k);\
				}\
			}')();
			var p = method.prototype;
			Object.keys(structure).forEach(function(key){
				var value = structure[key];
				if (typeof value === "object"){

				} else {
					Object.defineProperty(p, key, {
						get:function(){
							return this.$.store[key];
						},
						set:function(value){
							if (this.$){
								var old = this.$.store[key];
								this.$.store[key] = value;
								if (old !== value){
									var data = {
										owner:this,
										property:key,
										old:old,
										new:value
									};
									console.log(data);
									if (this.$.trigger){
										this.$.trigger(key+"PropertyChanged", data);
										this.$.trigger("PropertyChanged", data);
									}
								}								
							}
						}
					});
				}
			});
			return method;
		},
		Classes:{
			$:(function(){
				function $(host){
					var now = new Date().valueOf();
					this.id = now.toString(16)+"-"+parseInt(Math.random()*now).toString(16);
					this.host = host;
					this.store = {};
				};
				var $p = $.prototype;
				$p.dispose = function dispose(){
					//
				}
				$p.add = function add(name, value){

				};
				$p.remove = function remove(name){

				};
				$p.on = function on(name, method){

				};
				$p.trigger = function trigger(name, data){

				};
				return $;
			})()
		}
	};
	return Gomme;
})(window);