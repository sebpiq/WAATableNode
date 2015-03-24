WAATableNode
==============

Audio Node for more flexible sample playback.

`AudioBufferSourceNode` is good for simple playback of a sound sample. But when you want to read a sound back and forth, at varying playrates, jump around, etc ... it just doesn't cut it. 

`WAATableNode` plays a sound sample and the playback position is directly controlled by another audio node :

```javascript
var tableNode = new WAATableNode(context)
positionNode.connect(tableNode.position)
```

This might seem complicated at first, but in fact it is very simple, and extremely flexible. For example, if you want the table node to loop the sound at playrate 1, you can just use a sawtooth wave that oscillates between 0 and the sample length, and whose period is the same as the sample duration :

```javascript
var context = new AudioContext()
  , tableNode = new WAATableNode(context)
  , offsetNode = new WAAOffset(context)
  , positionNode = context.createGain()
  , sawtoothNode = context.createOscillator()

tableNode.table = aSound // can be an AudioBuffer or a Float32Array
positionNode.connect(tableNode.position)
tableNode.connect(context.destination)

sawtoothNode.type = 'sawtooth'
sawtoothNode.connect(positionNode)
sawtoothNode.start(0)

// Add an offset of 1, to bring back the sawtooth in the interval [0, 2]
offsetNode.connect(positionNode)
offsetNode.offset.value = 1

// Scale the sawtooth to [0, aSound.length]
positionNode.gain.value = aSound.length * 0.5

// sets the period of the sawtooth to the duration of the sample
sawtoothNode.frequency.value = 1 / aSound.duration
```

For a more complex example, you can [check this demo](http://sebpiq.github.io/WAATableNode/demos/cello-drone.html).