(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var WAATableNode = require('./lib/WAATableNode')
module.exports = WAATableNode
if (typeof window !== 'undefined') window.WAATableNode = WAATableNode
},{"./lib/WAATableNode":2}],2:[function(require,module,exports){
var WAAOffset = require('waaoffset')

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
},{"waaoffset":3}],3:[function(require,module,exports){
var WAAOffset = require('./lib/WAAOffset')
module.exports = WAAOffset
if (typeof window !== 'undefined') window.WAAOffset = WAAOffset
},{"./lib/WAAOffset":4}],4:[function(require,module,exports){
var WAAOffset = module.exports = function(context) {
  this.context = context

  // Ones generator
  this._ones = context.createOscillator()
  this._ones.frequency.value = 0
  this._ones.setPeriodicWave(context.createPeriodicWave(
    new Float32Array([0, 1]), new Float32Array([0, 0])))
  this._ones.start(0)

  // Multiplier
  this._output = context.createGain()
  this._ones.connect(this._output)
  this.offset = this._output.gain
  this.offset.value = 0
}

WAAOffset.prototype.connect = function() {
  this._output.connect.apply(this._output, arguments)
}

WAAOffset.prototype.disconnect = function() {
  this._output.disconnect.apply(this._output, arguments)
}
},{}]},{},[1]);
