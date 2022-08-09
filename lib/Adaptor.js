"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
var _exportNames = {
  lookupUser: true,
  fetchTweets: true
};
exports.lookupUser = lookupUser;
exports.fetchTweets = fetchTweets;

var _languageCommon = require("@openfn/language-common");

Object.keys(_languageCommon).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  if (key in exports && exports[key] === _languageCommon[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _languageCommon[key];
    }
  });
});

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
    const resolvedUserName = (0, _languageCommon.expandReferences)(userName)(state);

    if (!state.users) {
      state = { ...state,
        users: {}
      };
    } // exit early if the user is defined


    if (state.users[resolvedUserName]) {
      return Promise.resolve(state);
    }

    return request(state, `users/by/username/${resolvedUserName}`).then(({
      id
    }) => {
      return { ...state,
        users: { ...state.users,
          [resolvedUserName]: id
        }
      };
    });
  };
} // should tweets be stored in the same way?
// state.data.tweets[userName]


function fetchTweets(userName) {
  return state => {
    const resolvedUserName = (0, _languageCommon.expandReferences)(userName)(state);
    return lookupUser(resolvedUserName)(state).then(state => request(state, `users/${state.users[resolvedUserName]}/tweets`)).then(data => ({ ...state,
      data: { ...state.data,
        tweets: {
          // ...(state.data.tweets ?? {}),
          [resolvedUserName]: data
        }
      }
    }));
  }; //   return lookupUser(resolvedUserName)(state).then((state) => {
  //     return request(state, `users/${state.users[resolvedUserName]}/tweets`).then((data) => {
  //       return {
  //         ...state,
  //         data: {
  //           ...state.data,
  //           tweets: {
  //             // ...(state.data.tweets ?? {}),
  //             [resolvedUserName]: data
  //           }
  //         }
  //       }
  //     })
  //   })
  // }
} // What functions do you want from the common adaptor?