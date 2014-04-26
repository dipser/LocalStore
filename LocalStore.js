/**
 * JS-Local-Storage Wrapper
 *
 *
 * Beispiel:
 *
 * <script src="LocalStore.js"></script>
 * <script>
 *   // Starten des localStorage mit Namensraum 'mystore' und der optionalen Angabe einer Standard-Ablaufzeit und eines Prefixes.
 *   var store = LocalStore.init('mystore', {time: 60*60*24, prefix: 'LocalStore'});
 *   store.set('id', 1);
 *   store.set('name', 'aurel');
 *   store.remove('name');
 *   console.log(store.get('name'));
 *   store.clear(); // Löscht alles aus dem Namensraum 'mystore'
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
		var index = JSON.parse(localStorage.getItem(this.getIndexName())) || [];
		localStorage.setItem(this.getIndexName(), JSON.stringify(index));
		for (var i in index) {
			var item = JSON.parse(localStorage.getItem(this.getItemName(index[i])));
			var time = (item && 'time' in item && 'setTime' in item) ? item.time : this.time;
			if (time && item.setTime + time > this._dateNow()) {
				this.remove(index[i]);
			}
		}
		return this;
	},

	getItem: function(key){this.get(key);},
	get: function(key) {
		var item = JSON.parse(localStorage.getItem(this.getItemName(key)));
		return item && 'data' in item ? item.data : null;
	},

	setItem: function(key, val, time){this.get(key, val, time);},
	set: function(key, val, time) {
		var index = JSON.parse(localStorage.getItem(this.getIndexName())) || [];
		if (index.indexOf(key) === -1) { index.push(key); }
		localStorage.setItem(this.getIndexName(), JSON.stringify(index));
		localStorage.setItem(this.getItemName(key), JSON.stringify({data:val, setTime:this._dateNow(), time:time}));
	},

	removeItem: function(key){this.remove(key);},
	remove: function(key){
		var index = JSON.parse(localStorage.getItem(this.getIndexName())) || []; // [key1, key2,...]
		if (index.indexOf(key) !== -1) {
			index = index.splice(key, 1);
			localStorage.setItem(this.getIndexName(), JSON.stringify(index));
		}
		localStorage.removeItem(this.getItemName(key));
	},

	clear: function() {
		var index = JSON.parse(localStorage.getItem(this.getIndexName())) || [];
		for (var i in index) {localStorage.removeItem(this.getItemName(index[i]));}
		localStorage.removeItem(this.getIndexName());
	},

	getIndexName: function() {
		return this.prefix + 'Index-' + this.name;
	},

	getItemName: function(key) {
		return this.prefix + 'Item-' + this.name + '-' + key;
	},

	_dateNow: function() {
		return ((Date.now) ? Date.now() : (new Date()).getTime());
	}
};



