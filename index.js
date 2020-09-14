const logic = require('./logic')
const iptool = require('node-cidr')
const useragent = require('useragent')
const urlparse = require('url-parse')
const qs = require('qs')
const dot = require('dot-object')

class NoopLogic {
  constructor () {
    logic.add_operation('cidr', (cidr, ip) => {
      return iptool.cidr.includes(cidr, ip)
    })
    logic.add_operation('useragent', (string) => {
      return useragent.parse(string)
    })
    logic.add_operation('qs', (string) => {
      const url = urlparse(string, null, (str) => {
        if (str.startsWith('?')) str = str.substr(1)
        return qs.parse(str)
      })
      if (!url || !url.query) return {}
      return url.query
    })
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
