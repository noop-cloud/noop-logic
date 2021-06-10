const logic = require('./logic.js')
const iptool = require('node-cidr')
const useragent = require('useragent')
const urlparse = require('url-parse')
const qs = require('qs')
const dot = require('dot-object')
const { makeRe } = require('minimatch')

class NoopLogic {
  constructor () {
    // cidr
    // If 'cidr' is string, checks if IP address is included in given CIDR
    // If 'cidr' is array, checks if IP address is included in any of the supplied CIDRs
    // Returns a boolean
    logic.add_operation('cidr', (cidr, ip) => {
      if (!Array.isArray(cidr)) cidr = [cidr]
      for (const c of cidr) {
        if (iptool.cidr.includes(c, ip)) return true
      }
      return false
    })
    // useragent
    // Parses a User-Agent
    // If 'prop' is defined, returns an object representation of user-agent
    // If 'prop' is undefined, returns specified property in user-agent object
    logic.add_operation('useragent', (ua, prop) => {
      ua = useragent.parse(ua)
      return this.prop(prop, ua)
    })
    // qs
    // Parses querystring in URL/path
    // If 'prop' is defined, returns an object representation of querystring
    // If 'prop' is undefined, returns specified property in querystring object
    logic.add_operation('qs', (str, prop) => {
      const url = urlparse(str, null, query => {
        if (query[0] === '?') query = qs.parse(query.substr(1))
        return this.prop(prop, query)
      })
      if (!url || !url.query) return {}
      return url.query
    })
    // indexof
    // Finds index of 'a' in 'b', matches Javascript's indexOf behavior
    // Returns a number
    logic.add_operation('indexof', (a, b) => {
      if (!b || typeof b.indexOf === 'undefined') return false
      return b.indexOf(a)
    })
    // startswith
    // Finds if 'b' starts with 'a'
    // Returns a boolean
    logic.add_operation('startswith', (a, b) => {
      if (!b || typeof b.indexOf === 'undefined') return false
      return b.indexOf(a) === 0
    })
    // endswith
    // Finds if 'b' ends with 'a'
    // Returns a boolean
    logic.add_operation('endswith', (a, b) => {
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
      return this.prop(prop, obj)
    })
    // match
    // Wildcard match of a string against one or more patterns
    // Returns boolean if any patterns match
    logic.add_operation('match', (string, patterns) => {
      if (!Array.isArray(patterns)) patterns = [patterns]
      for (const p of patterns) {
        if (!(p in NoopLogic._cache.matchers)) NoopLogic._cache.matchers[p] = makeRe(p)
        if (NoopLogic._cache.matchers[p].test(string)) return true
      }
      return false
    })
  }

  // prop function used throughout Noop Logic operations
  prop (prop, obj) {
    if (!obj) return {}
    if (!prop) return obj
    return dot.pick(prop, obj)
  }

  apply (condition, data) {
    return logic.apply(condition, data)
  }
}

NoopLogic._cache = {
  matchers: {}
}

module.exports = new NoopLogic()
