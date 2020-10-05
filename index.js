const logic = require('./logic')
const iptool = require('node-cidr')
const useragent = require('useragent')
const urlparse = require('url-parse')
const qs = require('qs')
const dot = require('dot-object')

class NoopLogic {
  constructor () {
    // cidr
    // Checks if an IP address is included in a CIDR
    // Returns a boolean
    logic.add_operation('cidr', (cidr, ip) => {
      return iptool.cidr.includes(cidr, ip)
    })
    // useragent
    // Parses a User-Agent
    // Returns an object
    logic.add_operation('useragent', string => {
      return useragent.parse(string)
    })
    // qs
    // Parses querystring in URL/path
    // Returns an object
    logic.add_operation('qs', string => {
      const url = urlparse(string, null, str => {
        if (str[0] === '?') str = str.substr(1)
        return qs.parse(str)
      })
      if (!url || !url.query) return {}
      return url.query
    })
    // index_of
    // Finds index of 'a' in 'b'. Matches Javascript's indexOf behavior
    // Returns a number
    logic.add_operation('index_of', (a, b) => {
      if (!b || typeof b.indexOf === 'undefined') return false
      return b.indexOf(a)
    })
    // starts_with
    // Finds if'b' starts with 'a'
    // Returns a boolean
    logic.add_operation('starts_with', (a, b) => {
      if (!b || typeof b.indexOf === 'undefined') return false
      return b.indexOf(a) === 0
    })
    // ends_with
    // Finds if 'b' ends with 'a'
    // Returns a boolean
    logic.add_operation('ends_with', (a, b) => {
      if (!b || typeof b.indexOf === 'undefined') return false
      return b.substr(b.length - a.length) === a
    })
    // length
    // Finds length of a string
    // Returns a number
    logic.add_operation('length', string => {
      return string.length
    })
    // prop
    // Reference property of resulting object from another operation
    logic.add_operation('prop', (prop, obj) => {
      if (!prop) return obj
      return dot.pick(prop, obj)
    })
  }

  apply (condition, data) {
    return logic.apply(condition, data)
  }
}

module.exports = new NoopLogic()
