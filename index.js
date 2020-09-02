const jsonlogic = require('json-logic-js')
const iptool = require('node-cidr')

class NoopLogic {
  constructor () {
    jsonlogic.add_operation('cidr', (cidr, ip) => {
      return iptool.cidr.includes(cidr, ip)
    })
  }

  apply (condition, data) {
    return jsonlogic.apply(condition, data)
  }
}

module.exports = new NoopLogic()
