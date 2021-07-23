# Exemplo simples de utilização do mongo

## Incluíndo a classe
```node
var mongo = require("./src/db");
```

## Chamada por callback
```node
new mongo().ready(db => {
  var dados = await db.collection("minhacollection").find().toArray();
  console.log(dados);
});
```

## Chamada por promise
```node
var db = await new mongo().ready();
var dados = await db.collection("minhacollection").find().toArray();
console.log(dados);
```
