"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.lookupUser = lookupUser;
exports.fetchTweets = fetchTweets;
Object.defineProperty(exports, "execute", {
  enumerable: true,
  get: function () {
    return _languageCommon.execute;
  }
});
Object.defineProperty(exports, "alterState", {
  enumerable: true,
  get: function () {
    return _languageCommon.alterState;
  }
});
Object.defineProperty(exports, "dataPath", {
  enumerable: true,
  get: function () {
    return _languageCommon.dataPath;
  }
});
Object.defineProperty(exports, "dataValue", {
  enumerable: true,
  get: function () {
    return _languageCommon.dataValue;
  }
});
Object.defineProperty(exports, "dateFns", {
  enumerable: true,
  get: function () {
    return _languageCommon.dateFns;
  }
});
Object.defineProperty(exports, "each", {
  enumerable: true,
  get: function () {
    return _languageCommon.each;
  }
});
Object.defineProperty(exports, "field", {
  enumerable: true,
  get: function () {
    return _languageCommon.field;
  }
});
Object.defineProperty(exports, "fields", {
  enumerable: true,
  get: function () {
    return _languageCommon.fields;
  }
});
Object.defineProperty(exports, "fn", {
  enumerable: true,
  get: function () {
    return _languageCommon.fn;
  }
});
Object.defineProperty(exports, "http", {
  enumerable: true,
  get: function () {
    return _languageCommon.http;
  }
});
Object.defineProperty(exports, "lastReferenceValue", {
  enumerable: true,
  get: function () {
    return _languageCommon.lastReferenceValue;
  }
});
Object.defineProperty(exports, "merge", {
  enumerable: true,
  get: function () {
    return _languageCommon.merge;
  }
});
Object.defineProperty(exports, "sourceValue", {
  enumerable: true,
  get: function () {
    return _languageCommon.sourceValue;
  }
});

var _languageCommon = require("@openfn/language-common");

/** @module Adaptor */
const {
  axios
} = _languageCommon.http;
exports.axios = axios;
/**
 * Lookup a user id from a user name
 * Writes to the data objcet
 * Wraps `language-common/execute`, and prepends initial state for http.
 * @example
 * lookupUser(
 *   'taylordowns2000'
 * )(state)
 * @function
 * @param {String} userName - The name of the user to be found
 * @returns {Promise}
 */

function request(state, endpoint) {
  const config = {
    headers: {
      'Authorization': `Bearer ${state.configuration.key}`
    }
  };
  const url = `https://api.twitter.com/2/${endpoint}/`;
  return axios.get(url, config).then(response => response.data.data);
} // The public API wil use usernames to stuff
// But we'll do like an ensureUserId using hthus


function lookupUser(userName) {
  return state => {
    if (!state.users) {
      state = { ...state,
        users: {}
      };
    } // exit early if the user is defined


    if (state.users[userName]) {
      return Promise.resolve(state);
    }

    return request(state, `users/by/username/${userName}`).then(({
      id
    }) => {
      return { ...state,
        users: { ...state.users,
          [userName]: id
        }
      };
    });
  };
} // should tweets be stored in the same way?
// state.data.tweets[userName]


function fetchTweets(userName) {
  return state => {
    return lookupUser(userName)(state).then(state => {
      return request(state, `users/${state.users[userName]}/tweets`).then(data => {
        return { ...state,
          data: { ...state.data,
            tweets: {
              // ...(state.data.tweets ?? {}),
              [userName]: data
            }
          }
        };
      });
    });
  };
} // What functions do you want from the common adaptor?