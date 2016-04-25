(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var WAATableNode = require('./lib/WAATableNode')
module.exports = WAATableNode
if (typeof window !== 'undefined') window.WAATableNode = WAATableNode
},{"./lib/WAATableNode":2}],2:[function(require,module,exports){
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
},{"waaoffsetnode":3}],3:[function(require,module,exports){
var WAAOffsetNode = require('./lib/WAAOffsetNode')
module.exports = WAAOffsetNode
if (typeof window !== 'undefined') window.WAAOffsetNode = WAAOffsetNode
},{"./lib/WAAOffsetNode":4}],4:[function(require,module,exports){
var WAAOffsetNode = module.exports = function(context) {
  this.context = context

  // Ones generator. We use only a single generator 
  // for all WAAOfsetNodes in the same AudioContext
  this._ones = WAAOffsetNode._ones.filter(function(ones) {
    return ones.context === context
  })[0]
  if (this._ones) this._ones = this._ones.ones 
  else {
    var buffer = context.createBuffer(1, 1024, context.sampleRate)
      , i, channelArray = buffer.getChannelData(0)
    for (i = 0; i < buffer.length; i++) channelArray[i] = 1
    this._ones = context.createBufferSource()
    this._ones.buffer = buffer
    this._ones.loop = true
    this._ones.start(0)
    WAAOffsetNode._ones.push({ context: context, ones: this._ones })
  }

  // Multiplier
  this._output = context.createGain()
  this._ones.connect(this._output)
  this.offset = this._output.gain
  this.offset.value = 0
}

WAAOffsetNode.prototype.connect = function() {
  this._output.connect.apply(this._output, arguments)
}

WAAOffsetNode.prototype.disconnect = function() {
  this._output.disconnect.apply(this._output, arguments)
}

WAAOffsetNode._ones = []
},{}]},{},[1]);
