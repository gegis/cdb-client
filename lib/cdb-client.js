"use strict";

let _ = require('lodash');
let helpers = require('./helpers');
let request = require('./request');
let db = require('./db');

module.exports = function(config) {

    if(!config) {

        throw new Error('config is not provided');
    }

    if(!config.hasOwnProperty('host')) {

        throw new Error(`'host' in config is not provided, additional params: 'protocol', 'port'`);
    }

    var _private = {

        getUri(data) {

            var uri = 'http://';

            if(config.protocol) {

                uri = config.protocol + '://';
            }

            if(data.user && data.pass) {

                uri += data.user + ':' + data.pass + '@';
            }

            uri += config.host;

            if(config.port) {

                uri += ':' + config.port;
            }

            if(data.db) {

                uri += '/' + data.db;
            }

            return uri;
        }
    };

    var _public = {
        
        dbExists(dbConfig, next) {

            var opts = {
                method: 'HEAD',
                uri: _private.getUri(dbConfig)
            };

            helpers.validateCallback(next);

            request(opts, next);
        },

        createDb(dbConfig, next) {

            var opts = {
                method: 'PUT',
                uri: _private.getUri(dbConfig)
            };

            request(opts, (err, data) => {

                if(_.isFunction(next)) {

                    return next(err, data);
                }
            });
        },
        
        getDb(dbConfig, next) {

            if(!dbConfig) {

                throw new Error('dbConfig is not provided');
            }

            if(!dbConfig.hasOwnProperty('db')) {

                throw new Error(`'db' in config is not provided, additional params: 'user', 'pass'`);
            }

            if(next) {


                _public.dbExists(dbConfig, (err, data) => {

                    if(err) {

                        return next(err, data);
                    }

                    next(null, db(_private.getUri(dbConfig)));
                });
            } else {

                return db(_private.getUri(dbConfig));
            }
        }
    };

    return _public;
};