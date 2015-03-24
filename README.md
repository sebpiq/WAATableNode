WAATableNode
==============

Audio Node for more flexible sample playback.

`AudioBufferSourceNode` is good for simple playback of a sound sample. But when you want to read a sound back and forth, at varying playrates, jump around, etc ... it just doesn't cut it. 

`WAATableNode` plays a sound sample and the playback position is directly controlled by another audio node :

```javascript
var tableNode = new WAATableNode(context)
positionNode.connect(tableNode.position)
```

This might seem complicated at first, but in fact it is very simple, and extremely flexible. For example, if you want the table node to loop the sound at playrate 1, you can just use a phasor that oscillates between 0 and the sample length, and whose period is the same as the sample duration :

```javascript
var context = new AudioContext()
  , tableNode = new WAATableNode(context)
  , positionNode = context.createBufferSource(context)

tableNode.table = aSound // can be an AudioBuffer or a Float32Array
tableNode.connect(context.destination)

// The buffer will just contain a ramp that will be looped, essentially resulting
// in a phasor [0, aSound.length] controlling the playback position.
positionBuffer = context.createBuffer(1, aSound.length, context.sampleRate)
for (var i = 0; i < aSound.length; i++) positionBuffer.getChannelData(0)[i] = i

positionNode.connect(tableNode.position)
positionNode.buffer = positionBuffer
positionNode.loop = true
positionNode.start(0)
```

See the complete example [here](http://sebpiq.github.io/WAATableNode/demos/simple.html)

For a more complex example, you can [check this demo](http://sebpiq.github.io/WAATableNode/demos/cello-drone.html).