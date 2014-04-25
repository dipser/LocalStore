LocalStore
==========

Eine mini localStorage Hülle.


<br />
### Funktionen
* Kürzere Befehle! *...Reduktion!*
* Namensräume! *...auch mit Prefixen!*
* Ablaufzeiten! *...für alle und einzelne!*
* *Es rockt!*

<br />
### Benutzung

```
<script src="LocalStore.js"></script>
<script>
  // Starten des localStorage mit Namensraum 'mystore' und der 
  // optionalen Angabe einer Standard-Ablaufzeit und eines Prefixes.
  var store = LocalStore.init('mystore', {time: 60*60*24, prefix: 'LocalStore'});
  store.set('id', 1);
  store.set('name', 'aurel');
  store.remove('name');
  console.log(store.get('name'));
  store.clear(); // Löscht alles aus dem Namensraum 'mystore'
</script>
```

<br />
---
### Autor
Aurel *'[dipser](http://github.com/dipser)'* Hermand
