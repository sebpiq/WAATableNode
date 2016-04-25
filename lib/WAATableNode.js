var WAAOffset = require('waaoffsetnode')

var WAATableNode = module.exports = function(context) {
  this.context = context
  this._output = context.createWaveShaper()
  this._positionNode = new WAAOffset(context)
  this._positionNode.connect(this._output)
  this._positionNode.offset.value = -1
  this.position = context.createGain()
  this.position.connect(this._positionNode.offset)
  this.position.gain.value = 0
  
  this._table = null
  Object.defineProperty(this, 'table', {
    get: function() { return this._table },
    set: function(table) { this._setTable(table) },
  })
}

WAATableNode.prototype.connect = function() {
  this._output.connect.apply(this._output, arguments)
}

WAATableNode.prototype.disconnect = function() {
  this._output.disconnect.apply(this._output, arguments)
}

WAATableNode.prototype._setTable = function(table) {
  if (table instanceof AudioBuffer)
    table = table.getChannelData(0)
  this._table = table
  if (table === null) return
  this._output.curve = table
  this.position.gain.setValueAtTime(2 / (table.length - 1), 0)
}