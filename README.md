![alt text][logo]

[logo]: https://github.com/google/inspectorspacetime/blob/gh-pages/gif/space_gif.gif "Inspector Spacetime logo"

# [Inspector Spacetime][4e4c540d]
Motion specs are a necessary part of the engineering process. It's often difficult and time consuming to deliver the data required to replicate motion on device. With Inspector Spacetime you can generate this data along side the reference quicktime, with just one click.

  [4e4c540d]: https://google.github.io/inspectorspacetime/ "Inspector Spacetime"

> This is not an official Google product. Motion designers at Google just kinda like it a lot. Built by [Adam Plouff][8638464d].

  [8638464d]: http://www.battleaxe.co/ "Battle Axe"

---
## Installation


### After Effects
1. Close After Effects
2. Drag the `InspectorSpacetime.jsx` file into Applications > Adobe After Effects [version number] > Scripts > ScriptUI Panels
3. Fire up After Effects again
4. Navigate to the Window menu up top. At the bottom you'll see `InspectorSpacetime.jsx`

---
## Usage

### Basics
<img src="https://google.github.io/inspectorspacetime/img/Panel.png" width="400">

Select a pair or several pairs of keyframes and click the giant button. These keyframe values will be collected within a floating panel and may be copied out as text or added to a renderable blue side panel in a duplicate comp.

### Pastable Text
<img src="https://google.github.io/inspectorspacetime/img/PropPanel.png" width="400">

Selected keyframe pairs are now added to the property list as plain text. Additional keys may be added to the list and the overall duration and delay of each key pair will update.

**Note: Live text is dead–** as of v2.1, the live text panel has been removed because it was a major pain to get useable data out with all those expressions.

### Data output
<img src="https://google.github.io/inspectorspacetime/gif/DataOutput.gif" width="400">

Keyframe data output:

- Property name
- Delay time (live value)
- Duration of keyframe pair
- Value change
- Cubic Bezier interpolation curve
#### Position
- May be coordinates or distance
- 3X is the default DP for working at 1080x1920

## Generator Buttons

### Isolation Layer
<img src="https://google.github.io/inspectorspacetime/gif/IsoLayer.gif" width="400">

If your comp is really busy it can be tough to clearly see what's being spec'd. An isolation layer is just an adjustment layer that will grey out everything below it to get a little more focus on what you're showing.

## Time Counter
<img src="https://google.github.io/inspectorspacetime/gif/TimeCounter.gif" width="400">

Created with every spec, a counter is also available as its own layer. Create a millisecond counter with a defined start and end point. Start the timer at the beginning of the transition to easily illustrate the global start time.

## Pointer
<img src="https://google.github.io/inspectorspacetime/img/Pointer.png" width="400">

Everyone names things differently, which can lead to confusion. So draw a line from spec data to the visual element and save yourself a lot of explaining. This button will get you started, or just draw your own. Either way, it'll make your life easier.

___
## Why the dumb name?

Named after the Doctor Who parody from the underrated NBC comedy [Community][a97544c1]. It was a really great show.

  [a97544c1]: https://youtu.be/WQAgPaJvvHU "Community - Inspector Spacetime'"

In**spec**tor Spacetime. It's a bad pun. But I'm a dad. I can't help it.
___

## License
Apache 2.0
