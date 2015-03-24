(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var WAAOffset = require('./lib/WAAOffset')
module.exports = WAAOffset
if (typeof window !== 'undefined') window.WAAOffset = WAAOffset
},{"./lib/WAAOffset":2}],2:[function(require,module,exports){
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
},{}]},{},[1]);
