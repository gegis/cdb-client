"use strict";

let path = require('path');
let _ = require('lodash');
let request = require('./request');
let helpers = require('./helpers');

module.exports = function(uri) {

    var _private = {

        uri: null
    };

    var _public = {

        save(doc, next) {

            var opts = {
                method: 'POST',
                uri: _private.uri,
                json: true,
                body: doc
            };

            request(opts, (err, data) => {

                if(err) {

                    return helpers.handleError(err, next);
                }

                if(_.isFunction(next)) {

                    return next(null, data);
                }
            });
        },

        getAll(next) {

            var opts = {
                method: 'GET',
                uri: [_private.uri, '_all_docs'].join('/')
            };

            helpers.validateCallback(next);

            request(opts, next);
        },

        get(key, next) {

            var opts = {
                method: 'GET',
                uri: [_private.uri, key].join('/')
            };

            helpers.validateCallback(next);

            request(opts, next);
        },

        delete(doc, next) {

            var opts = {
                method: 'DELETE',
                uri: [_private.uri, doc._id].join('/'),
                qs: {
                    rev: doc._rev
                }
            };

            request(opts, (err, data) => {

                if(err) {

                    helpers.handleError(err, next);
                }

                if(_.isFunction(next)) {

                    return next(null, data);
                }
            });
        },

        view(data, next) {

            var opts = {
                method: 'GET',
                uri: '',
                qs: {}
            };

            helpers.validateViewData(data);
            helpers.validateCallback(next);

            opts.uri = [_private.uri, '_design', data.design, '_view', data.view].join('/');

            if(data.get) {

                console.warn(`Design View query: 'get' will be deprecated, please use 'options' instead`);
                //TODO remove data.get, which is replaced with data.options
                opts.qs = data.get;
            }

            if(data.options) {

                opts.qs = data.options;
            }

            if(data.post) {

                opts.method = 'POST';
                opts.json = true;
                opts.body = data.post;
            }

            request(opts, next);
        },

        saveDesign(ddoc, name, next) {

            var opts = {
                method: 'PUT',
                uri: [_private.uri, '_design', name].join('/'),
                json: true,
                body: ddoc
            };

            request(opts, (err, data) => {

                if(err) {

                    helpers.handleError(err, next);
                }

                if(_.isFunction(next)) {

                    return next(null, data);
                }
            });
        },

        getDesign(name, next) {

            var opts = {
                method: 'GET',
                uri: [_private.uri, '_design', name].join('/')
            };

            helpers.validateCallback(next);

            request(opts, next);
        },

        setSecurity(data, next) {

            var opts = {
                method: 'PUT',
                uri: [_private.uri, '_security'].join('/'),
                json: true,
                body: data
            };

            request(opts, (err, data) => {

                if(_.isFunction(next)) {

                    return next(err, data);
                }
            });
        }
    };

    _private.uri = uri;

    return _public;
};