var utils = require('waatest').utils
  , WAATableNode = require('../index')
  , WAAOffset = require('waaoffset')

describe('WAATableNode', function() {

  var plugOutput = function(context, node1, node2) {
    var channelMerger = context.createChannelMerger(2)
    channelMerger.connect(context.destination)
    node1.connect(channelMerger, 0, 0)
    node2.connect(channelMerger, 0, 1)
  }

  it('should output the table elements if the index is exact', function(done) {
    var tableNode, positionNode, output
    utils.expectSamples(
      function(context) {
        tableNode = new WAATableNode(context)
        tableNode.table = new Float32Array([0, 0.02, 0.04, 0.06, 0.08, 0.1, 0.12, 0.14, 0.16, 0.18])
        positionNode = new WAAOffset(context)
        positionNode.connect(tableNode.position)
        positionNode.offset.setValueAtTime(0, 0)
        positionNode.offset.linearRampToValueAtTime(context.sampleRate, 1)
        plugOutput(context, tableNode, positionNode)
      },
      [
        [0, 0.02, 0.04, 0.06, 0.08, 0.1, 0.12, 0.14, 0.16, 0.18],
        [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]
      ],
      done
    )
  })

  it('should output interpolated elements from the table', function(done) {
    var tableNode, positionNode, output
    utils.expectSamples(
      function(context) {
        tableNode = new WAATableNode(context)
        tableNode.table = new Float32Array([0, 0.02, 0.04, 0.06, 0.08, 0.1, 0.12, 0.14, 0.16, 0.18])
        positionNode = new WAAOffset(context)
        positionNode.connect(tableNode.position)
        positionNode.offset.setValueAtTime(0, 0)
        positionNode.offset.linearRampToValueAtTime(context.sampleRate / 2, 1)
        plugOutput(context, tableNode, positionNode)
      },
      [
        [0, 0.01, 0.02, 0.03, 0.04, 0.05, 0.06, 0.07, 0.08, 0.09],
        [0, 0.5, 1, 1.5, 2, 2.5, 3, 3.5, 4, 4.5]
      ],
      done
    )
  })

  it('should output interpolated elements from the table', function(done) {
    var tableNode, positionNode, output
    utils.expectSamples(
      function(context) {
        tableNode = new WAATableNode(context)
        tableNode.table = new Float32Array([0, 0.02, 0.04, 0.06, 0.08, 0.1, 0.12, 0.14, 0.16, 0.18])
        positionNode = new WAAOffset(context)
        positionNode.connect(tableNode.position)
        positionNode.offset.setValueAtTime(0, 0)
        positionNode.offset.linearRampToValueAtTime(context.sampleRate / 2, 1)
        plugOutput(context, tableNode, positionNode)
      },
      [
        [0, 0.01, 0.02, 0.03, 0.04, 0.05, 0.06, 0.07, 0.08, 0.09],
        [0, 0.5, 1, 1.5, 2, 2.5, 3, 3.5, 4, 4.5]
      ],
      done
    )
  })

  it('should output the bounds of the table if index is out of bounds', function(done) {
    var tableNode, positionNode, output
    utils.expectSamples(
      function(context) {
        tableNode = new WAATableNode(context)
        tableNode.table = new Float32Array([-1.2, -1.1, -1, -0.9, -0.8, -0.9, -1, -1.1, -1.2, -1.3])
        positionNode = new WAAOffset(context)
        positionNode.connect(tableNode.position)
        positionNode.offset.setValueAtTime(-10, 0)
        positionNode.offset.setValueAtTime(50, 5 * 1 / context.sampleRate)
        plugOutput(context, tableNode, positionNode)
      },
      [
        [-1.2, -1.2, -1.2, -1.2, -1.2, -1.3, -1.3, -1.3, -1.3, -1.3],
        [-10, -10, -10, -10, -10, 50, 50, 50, 50, 50]
      ],
      done
    )
  })

})