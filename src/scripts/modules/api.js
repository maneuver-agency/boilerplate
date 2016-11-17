let $ = require('jquery')

let API = {

  // Settings.
  version: 1,
  path: '/api/boilerplate',
  host: window.location.host,
  protocol: window.location.protocol,
  datatype: 'json',

  /**
   * Retrieve regular posts by optional page and limit.
   **/
  getPosts: (page, limit) => {
    let args = {
      'page': page || 1,
      'limit': limit || -1
    }
    return makeCall('posts', args)
  },

  /**
   * Cancels all pending requests.
   **/
  abort: () => {
    for (var i in requests) {
      requests[i].abort()
    }
    requests = []
  }
}

// TODO: Create instaniatable class?
module.exports = API

/**
 * Holds all pending requests.
 **/
let requests = []

/**
 * Makes the actual request.
 **/
let makeCall = (endpoint, data, method, datatype) => {
  var url = API.protocol + '//' + API.host + API.path + '/v' + API.version + '/' + endpoint
  var xhr = $.ajax({
    url: url,
    method: method || 'GET',
    data: data,
    dataType: datatype || API.datatype
  })

  requests.push(xhr)

  xhr.done(() => {
    // TODO: remove xhr from array when done.
  })

  return xhr
}
