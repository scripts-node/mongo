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

## Passagem de parametros

Você pode fornecer parâmetros de configuração ao instanciar a classe. Os seguintes parametros estão disponíveis:

* **sleep**: *`<sup>`integer`<sup>`* Aguarda **x** segundos antes de iniciar a conexão;
* **MONGO_PORT**: *`<sup>`integer`<sup>`* Define a porta de conexão com o mongoDb;
* **MONGO_ADDRESS**: *`<sup>`string`<sup>`* Define o endereço de conexão com o mongoDb;
* **MONGO_USERNAME**: *`<sup>`string`<sup>`* Define o usuário de conexão com o mongoDb;
* **MONGO_PASSWORD**: *`<sup>`string`<sup>`* Define a senha de conexão com o mongoDb;
* **MONGO_NAME**: *`<sup>`string`<sup>`* Define a porta de conexão com o mongoDb;

Exemplo de utilização:

```node
new mongo({
  PARAMETRO: VALOR
}).ready();
```
