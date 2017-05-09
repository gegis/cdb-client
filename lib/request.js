"use strict";

let _ = require('lodash');
let request = require('request');
let _private = {};
/**
 * Request service
 * @private
 */
_private = {

    /**
     * It makes a request with given parameters and passes it to the next callback
     *
     * @param {Function} next - A callback function
     * @param {Object} error - Request Error object
     * @param {Object} response - Response object
     * @param {string} body - Response body string
     *
     * @private
     */
    requestCallback(next, error, response, body) {

        var data = {
            success: false,
            headers: response.headers,
            statusCode: response.statusCode,
            result: body
        };

        if(error) {

            return next(error, data);
        }

        if(!body && response.statusCode >= 400) {

            return next(new Error('Status Code: ' + response.statusCode), data);
        }

        return _private.parseBody(body, data, next);
    },

    parseBody(body, data, next) {

        var json = {};

        if(_.isObject(body)) {

            json = body;
        } else if(body) {

            try {

                json = JSON.parse(body);
            } catch(e) {

                return next(new Error('Failed to parse JSON'), data);
            }
        }

        data.result = json;

        if(data.result.error) {

            return _private.handleJsonError(data, next);
        } else {

            data.success = true;
            return next(null, data);
        }
    },

    handleJsonError(data, next) {

        if(data.result.reason) {

            return next(new Error(data.result.reason), data);
        }

        return next(new Error(data.result.error), data);
    }
};

/**
 * Request service
 *
 * @param {Object} opts - Request options
 * @param {Function} next - A callback function
 *
 * @public
 */
let _public = function(opts, next) {

    request(opts, _private.requestCallback.bind(this, next));
};

module.exports = _public;