var Gomme = (function(window){
	'use strict';
	var Gomme = {
		model:function model(name, structure){
			var method = Function('return function '+name.replace(/[^a-z|A-Z_]/g, '')+'(a, b, c, d, e, f, g, h, i, j, k){\
				Gomme.Classes.base.call(this, a, b, c, d, e, f, g, h, i, j, k);\
			}')();
			var p = method.prototype;
			Object.defineProperty(p, "$", {
				enumerable:false,
				configurable:true,
				writable:true,
				value:{
					original:structure,
					subclasses:{}
				}
			});
			Object.keys(structure).forEach(function(key){
				var value = structure[key];
				if (typeof value === "object"){
					if (value.constructor === Array){

						return;
					} else {
						var subname = name+"_"+key;
						p.$.subclasses[key] = model(subname, value);
					}
				} else {
					Gomme.Tools.add(p, key)
				}
			});
			return method;
		},
		Tools:{
			uid:function uid(){
				var now = new Date().valueOf();
				return now.toString(16)+"-"+parseInt(Math.random()*now).toString(16);
			},
			add:function(host, key){
				Object.defineProperty(host, key, {
					get:function(){
						if (this.$.hasOwnProperty("store")){
							if (this.$.store.hasOwnProperty(key)){
								return this.$.store[key];
							}
						}
						var prototype = Object.getPrototypeOf(this);
						return prototype.$.original[key];
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
								if (this.$.trigger){
									this.$.trigger(key, data);
									this.$.trigger("*", data);
									if (this.$.parent){
										this.$.parent.$.trigger("*", data);
									}
								}
								data = null;
								old = null;
							}			
						}
					}
				});
			},
			Events:{
				remove:function(){
					delete this.pool[this.id];
				},
				removeAll:function(){
					var self = this;
					Object.keys(this.pool).forEach(function(eid){
						delete self.pool[eid];
					});
				}
			}
		},
		Classes:{
			base:function base(a, b, c, d, e, f, g, h, i, j, k){
				var self = this;
				Object.defineProperty(this, "$", {
					enumerable:false,
					configurable:true,
					writable:true,
					value:new Gomme.Classes.$(this)
				});
				var prototype = Object.getPrototypeOf(this);
				Object.keys(prototype.$.subclasses).forEach(function(key){
					var subclass = prototype.$.subclasses[key];
					self[key] = new subclass(a, b, c, d, e, f, g, h, i, j, k);
					self[key].$.parent = (self.$.parent || self);
				});
				if (typeof this.$.constructor === "function"){
					this.$.constructor(a, b, c, d, e, f, g, h, i, j, k);
				}
			},
			$:(function(){
				function $(host){
					if (!host){return;}
					this.id = Gomme.Tools.uid();
					this.host = host;
					this.store = {};
					this.events = {};
				};
				var $p = $.prototype;
				$p.dispose = function dispose(async){
					var self = this;
					async = (async || false);
					var p = Object.getPrototypeOf(this.host);
					var subclasses = p.$.subclasses;
					var subkeys = Object.keys(subclasses);
					subkeys.forEach(function(key){
						var subclass = self.host[key];
						if (subclass.$ && typeof subclass.$.dispose === "function"){
							subclass.$.dispose(!!async);
						}
					});
					delete this.id;
					delete this.store;
					delete this.events;
					delete this.parent;
					var keys = Object.keys(this.host);
					var count = 0;
					var total = keys.length;
					var cleanup = function(){
						count = null;
						total = null;
						keys = null;
						subclasses = null;
						subkeys = null;
						cleanup = null;
						delete self.host.$;
						self = null;
					};
					if (async){
						keys.forEach(function(key){
							setTimeout(function(){
								delete self.host[key];
								count++;
								if (count === total && typeof async === "function"){
									cleanup();
									async();
								}
							}, 0);
						});
						return;
					}
					keys.forEach(function(key){
						delete self.host[key];
					});
					cleanup();
				}
				$p.add = function add(name, value){

				};
				$p.remove = function remove(name){

				};
				$p.on = function on(name, method){
					if (name && typeof method === "function"){
						this.events[name] = (this.events[name] || {});
						if (typeof name === "object" && name.constructor === Array){
							var self = this;
							var results = [];
							name.forEach(function(ev){
								results.push(self.on(ev, method));
							});
							setTimeout(function(){
								self = null;
								results = null;
							}, 0);
							return results;
						}
						if (typeof name === "string"){
							var eid = Gomme.Tools.uid();
							this.events[name][eid] = method;
							var handle = {
								id:eid,
								pool:this.events[name],
								remove:Gomme.Tools.Events.remove,
								removeAll:Gomme.Tools.Events.removeAll
							};
							return handle;
						}
					}
					return false;
				};
				$p.trigger = function trigger(name, data){
					var listeners = this.events[name];
					if (typeof listeners === "object"){
						Object.keys(listeners).forEach(function(key){
							var method = listeners[key];
							if (typeof method === "function"){
								method(data);
							}
						});
					}
				};
				return $;
			})()
		},
		Extenders:{
			array:function extendArray(array){

			}
		}
	};
	return Gomme;
})(window);