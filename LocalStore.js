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

	getRawItem: function(key) {
		var item = JSON.parse(localStorage.getItem(this.getItemName(key)));
		//console.log(key, this.getItemName(key));
		return item ? item : null;
	},

	setItem: function(key, val, time, listen){this.get(key, val, time, listen);},
	set: function(key, val, time, listen) {
		var oldRawItem = this.getRawItem(key);
		var index = JSON.parse(localStorage.getItem(this.getIndexName())) || [];
		if (index.indexOf(key) === -1) { index.push(key); }
		localStorage.setItem(this.getIndexName(), JSON.stringify(index));
		var listen = listen ? listen.toString() : null;
		var data = {data:val, setTime:this._dateNow(), time:time, listen:listen};
		localStorage.setItem(this.getItemName(key), JSON.stringify(data));
		if (listen && !this.listened) { this._listen(); this.listened = true; }
		//console.log('Verleich: ', oldRawItem.data, data.data);
		if (oldRawItem && 'data' in oldRawItem && oldRawItem.data != data.data) { // vergleich is falsch... objekte vergleichen
			//this._listenHandler({key:this.getItemName(key), oldValue:JSON.stringify(rawItem), newValue:JSON.stringify(data), url:location.hostname});
		}
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

	_listen: function() {
		var self = this;
		if (window.addEventListener) {
			window.addEventListener("storage", function(e){self._listenHandler(e);}, false);
		} else {
			window.attachEvent("onstorage", function(e){self._listenHandler(e);});
		};
	},

	_listenHandler: function(e) {
		//console.log('listenerCalled', e);
		if (!e) { e = window.event; }
		var key = e.key.split(this.getIndexName()).join('').split(this.getItemName('')).join('');
		var rawOldValue = JSON.parse(e.oldValue);
		var rawNewValue = JSON.parse(e.newValue);
		if (key.length>0 && rawOldValue!=null && rawNewValue!=null) {
			if ('listen' in rawNewValue) {
				console.log(key);
				//console.log(key, rawOldValue, rawNewValue, typeof rawOldValue, typeof rawNewValue);
				new Function('('+rawNewValue.listen+')()')();
			}
		}
	},

	_dateNow: function() {
		return ((Date.now) ? Date.now() : (new Date()).getTime());
	}	
};



