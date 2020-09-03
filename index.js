const jsonlogic = require('json-logic-js')
const iptool = require('node-cidr')
const useragent = require('useragent')
const urlparse = require('url-parse')
const qs = require('qs')
const dot = require('dot-object')

class NoopLogic {
  constructor () {
    jsonlogic.add_operation('cidr', (cidr, ip) => {
      return iptool.cidr.includes(cidr, ip)
    })
    jsonlogic.add_operation('useragent', (string) => {
      return useragent.parse(string)
    })
    jsonlogic.add_operation('qs', (string) => {
      const url = urlparse(string, null, (str) => {
        if (str.startsWith('?')) str = str.substr(1)
        return qs.parse(str)
      })
      if (!url || !url.query) return {}
      return url.query
    })
    jsonlogic.add_operation('prop', (prop, obj) => {
      if (!prop) return obj
      return dot.pick(prop, obj)
    })
  }

  apply (condition, data) {
    return jsonlogic.apply(condition, data)
  }
}

module.exports = new NoopLogic()
