LocalStore
==========

Eine mini localStorage Hülle. 


<br />
### Funktionen
* Reduzierte Schreibarbeit *...ultrafast!*
* Wunderbar einfache Syntax!
* Namensräume mit Prefix!
* Ablaufzeiten für alle und für einzelne Daten!
* Es rockt!

<br />
### Benutzung

```
<script src="LocalStore.js"></script>
<script>
  // Starten des localStorage mit Namensraum 'myStore' und der optionalen Angabe einer Standard-Ablaufzeit und eines Prefixes.
  var myStore = LocalStore.init('mystore', {time: 60*60*24, prefix: 'LocalStore'});
  myStore.set('id', 1);
  myStore.set('name', 'aurel');
  myStore.remove('name');
  console.log(myStore.get('name'));
  myStore.clear(); // Löscht alles aus dem Namensraum 'mystore'
</script>
```

<br />
---
### Autor
Aurel *'[dipser](http://github.com/dipser)'* Hermand
