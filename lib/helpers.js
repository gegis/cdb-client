"use strict";

let _ = require('lodash');

let _public = {

    handleError(err, next) {

        if(_.isFunction(next)) {

            return next(err);
        } else {

            throw err;
        }
    },

    validateCallback(next) {

        if(!_.isFunction(next)) {

            throw new Error('Please specify a callback function!');
        }
    },

    validateViewData(data) {

        if(!data.design) {

            throw new Error('Please specify design!');
        }

        if(!data.view) {

            throw new Error('Please specify design view!');
        }
    }
};

module.exports = _public;