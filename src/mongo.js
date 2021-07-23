"use strict";

/**
 * Inclui o módulo mongo
 */
 var mongoDb = require('mongodb');

/**
 * Inclui o módulo debug
 */
var debug = require('debug')(process.env.SERVICE_NAME + ':src:db');

/**
 * Classe para controle de cache com db
 */
class Mongo {

    constructor() {

            /**
             * Transfere para variável a propriedade this para ser usada dentro das funções
             */
            var c = this;

            /**
             * Porta de conexão com Mongo
             */
            this.port = process.env.MONTO_PORT || 27017;

            /**
             * Ip de conexão com o mongo
             */
            this.address = process.env.MONTO_ADDRESS || '127.0.0.1';

            /**
             * Usuário de conexão com o mongo
             */
            this.username = process.env.MONGO_USERNAME || "";

            /**
             * Senha de conexão com o mongo
             */
            this.password = process.env.MONGO_PASSWORD || "";

            /**
             * Nome do db mongo
             */
            this.dbName = process.env.MONGO_NAME || "";

            /**
             * LOG
             */
             debug("Estabelecendo conexão com o mongo através da porta %s e endereço %s",this.port,this.address);
            
            if(this.username === ""){
                this.mongoString = `mongodb://${this.address}:${this.port}`
            }else{
                this.mongoString = `mongodb://${this.username}:${this.password}@${this.address}:${this.port}/writeapp?authSource=admin`
            }
            
            mongoDb.MongoClient.connect(this.mongoString,{useUnifiedTopology: true}).then(function(conn){
                c.db = conn.db(c.dbName);
                c.bucket = new mongoDb.GridFSBucket(c.db);
                debug('Conexão estabelecida com sucesso.');
                c.status = "connected";
            });
    }

    /**
     * Metodo que é executado quando a conexão com redis estiver pronta
     * @param {function} callback 
     * @returns 
     */
    ready(callback){
        
        /**
         * Transfere a manupulação da propriedade this para a variavel para usar dentro das funções
         */
        var r = this;

        /**
         * Retorna uma promise
         */
        return new Promise((resolve,reject)=>{

            /**
             * Se o db estiver conectado
             */
            if(r.status=="connected"){

                /**
                 * Retorna que está pronta
                 */
                if(callback)
                    callback(null,r.db);
                    return resolve(r.db);
            }else{

                /**
                 * Cria um controle com o número de tentativas de conexão com db
                 */
                this.attempt = 1;

                /**
                 * Cria um temporiazado
                 */
                var interval = setInterval(()=>{

                    /**
                     * Avalia se a conexão com db já está pronta
                     */
                    if(r.status=="connected"){

                        /**
                         * Finaliza o temporizador
                         */
                        clearInterval(interval)

                        /**
                         * Retorna que está pronta
                         */
                        if(callback)
                            callback(null,r.db);
                            return resolve(r.db);
                    }else{

                        /**
                         * Se o número máximo de tentativas de conexão for atingido
                         */
                        if(this.attempt>=150){

                            /**
                             * Finaliza o temporizador
                             */
                            clearInterval(interval);

                            /**
                             * Retorna que apresentou falha
                             */
                            if(callback)
                                return callback("Tempo esgotado para conexão com o banco de dados.");
                                return reject("Tempo esgotado para conexão com o mongo de dados.");
                        }else{

                            /**
                             * Incrementa mais tempo ao temporizador
                             */
                            this.attempt ++;
                        }
                    }
                },100);
            }
        }).catch((error) => {
            debug(error)
            process.exit(2)
        });
    }
}

module.exports = Mongo
