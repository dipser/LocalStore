/**
 * JS-Local-Storage Wrapper
 *
 *
 * Beispiel:
 *
 * <script src="res/js/LocalStore.js"></script>
 * <script>
 *   // Starten des localStorage mit Namensraum 'myStore' und der optionalen Angabe einer Standard-Ablaufzeit und eines Prefixes.
 *   var myStore = LocalStore.init('mystore', {time: 60*60*24, prefix: 'LocalStore'});
 *   myStore.set('id', 1);
 *   myStore.set('name', 'aurel');
 *   myStore.remove('name');
 *   console.log(myStore.get('name'));
 *   myStore.clear(); // Löscht alles aus dem Namensraum 'mystore'
 * </script>
 *
 *
 * @author Aurel Hermand, aurel@hermand.de
 * @version 1.0 - 25.04.2014 - Initial version
 *
 */


var LocalStore = {

	prefix: '',
	name: null, // Name-Postfix für den localStorage-Index
	time: null, // Ablaufzeit-Standard für localStorage-Items. null=permanent

	init: function(name, options) {
		this.name = name;
		this.prefix = options && 'prefix' in options ? options.prefix : '';
		this.time = options && 'time' in options ? options.time : null;
		var index = JSON.parse(localStorage.getItem(this.prefix+'Index-'+this.name)) || [];
		localStorage.setItem(this.prefix+'Index-'+this.name, JSON.stringify(index));
		for (var i in index) {
			var item = JSON.parse(localStorage.getItem(this.prefix+'Item-'+this.name+'-'+index[i]));
			var time = (item && 'time' in item && 'setTime' in item) ? item.time : this.time;
			if (time && item.setTime + time > this._dateNow()) {
				this.remove(index[i]);
			}
		}
		return this;
	},

	getItem: function(key){this.get(key);},
	get: function(key) {
		return JSON.parse(localStorage.getItem(this.prefix+'Item-'+this.name+'-'+key)).data;
	},

	setItem: function(key, val, time){this.get(key, val, time);},
	set: function(key, val, time) {
		var index = JSON.parse(localStorage.getItem(this.prefix+'Index-'+this.name)) || [];
		if (index.indexOf(key) === -1) { index.push(key); }
		localStorage.setItem(this.prefix+'Index-'+this.name, JSON.stringify(index));
		localStorage.setItem(this.prefix+'Item-'+this.name+'-'+key, JSON.stringify({data:val, setTime:this._dateNow(), time:time}));
	},

	removeItem: function(key){this.remove(key);},
	remove: function(key){
		var index = JSON.parse(localStorage.getItem(this.prefix+'Index-'+this.name)) || []; // [key1, key2,...]
		if (index.indexOf(key) !== -1) {
			index = index.splice(key, 1);
			localStorage.setItem(this.prefix+'Index-'+this.name, JSON.stringify(index));
		}
		localStorage.removeItem(this.prefix+'Item-'+this.name+'-'+key);
	},

	clear: function() {
		var index = JSON.parse(localStorage.getItem(this.prefix+'Index-'+this.name)) || [];
		for (var i in index) {localStorage.removeItem(this.prefix+'Item-'+this.name+'-'+index[i]);}
		localStorage.removeItem(this.prefix+'Index-'+this.name);
	},

	_dateNow: function() {
		return ((Date.now) ? Date.now() : (new Date()).getTime());
	}
};



