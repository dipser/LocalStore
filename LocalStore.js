/**
 * JS-Local-Storage Wrapper
 *
 * @author Aurel Hermand, aurel@hermand.de
 * @version 1.0 - Initial version
 */


var LocalStore = {
	//url: '', // Automatic Data from url

	name: null, // Name-Postfix für den localStorage-Index
	time: null, // Standardlöschzeit, wenn keine gesetzt wurde. null=permanent

	init: function(name=null) {
		this.name = name;
		var index = JSON.parse(localStorage.get('LocalStoreIndex-'+this.name));
		for (var i in index) {
			var lsii = localStorage.get(index[i]);
			if (this._dateNow()+lssi.time < lssi.setTime) {
				this.removeItem(index[i]);
			}
		}
		// ...LOAD URL DATA HERE...
		return this;
	},

	refresh: function() {
		// ...REFRESH URL DATA HERE...
	},

	clear: function() {
		var index = JSON.parse(localStorage.getItem('LocalStoreIndex-'+this.name)); // [key1, key2,...]
		for (var i in index) {localStorage.removeItem(index[i]);}
		localStorage.removeItem('LocalStoreIndex-'+this.name);
	},

	removeItem: function(key){this.remove(key);},
	remove: function(key){
		var index = JSON.parse(localStorage.getItem('LocalStoreIndex-'+this.name)); // [key1, key2,...]
		for (var i in index) {if (index[i]==key) {delete index[i];}}
		localStorage.removeItem(key);
	},

	getItem: function(key){this.get(key);},
	get: function(key) {
		return JSON.parse(localStorage.get(key)).data;
	},

	setItem: function(key, val, time=0, url=null){this.get(key, val, time, url);},
	set: function(key, val, time=0, url=null) {
		var index = JSON.parse(localStorage.getItem('LocalStoreIndex-'+this.name));
		index.push(key);
		localStorage.setItem('LocalStoreIndex-'+this.name, JSON.stringify(index));
		localStorage.set(key, {data:JSON.stringify(val), setTime:this._dateNow(), time:time, url:url});
	},

	_dateNow: function() {
		return ((Date.now) ? Date.now() : (new Date()).getTime());
	}
};



var myStore = LocalStore.init('mystore');
myStore.set('id', 1);
myStore.get('id');


/*
var myStore = LocalStore({
	url: 'http://www.host.de/data.json',
	param: {},
	type: 'jsonp', // json, jsonp, xml, plain

	data: '',

	store: 3600*24
});
*/


