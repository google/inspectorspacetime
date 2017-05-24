# Inspector Spacetime
Motion specs are a necessary part of the engineering process. It's often difficult and time consuming to deliver the data required to replicate motion on device. With Inspector Spacetime you can generate this data along side the reference quicktime, with just one click.

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
![Panel](https://knowledge-ux-prototyping.teams.x20web.corp.google.com/motion/tools/inspectorspacetime/img/Panel.png)

Select a pair or several pairs of keyframes and click the button. Your comp will be duplicated and resized to create space for all the useful spec data to live right along side the reference animation.

A new text layer is generated with all the selected element data. Raw text may be edited. Enabling the expression will update style and live values.

### Live Text
![Start Time](https://knowledge-ux-prototyping.teams.x20web.corp.google.com/motion/tools/inspectorspacetime/gif/StartTime.gif)

Spec data is based on the overall transition time. Markers are created at the time of the first and last selected keyframes as a reference for the transition time. Moving the Start and End markers update:

- Total Duration
- Delay
- Time Counter
-
**Spec Layer Name** heading comes from the layer name itself.

### Data output
![Data Output](https://knowledge-ux-prototyping.teams.x20web.corp.google.com/motion/tools/inspectorspacetime/gif/DataOutput.gif)

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
![Iso Layer](https://knowledge-ux-prototyping.teams.x20web.corp.google.com/motion/tools/inspectorspacetime/gif/IsoLayer.gif)

If your comp is really busy it can be tough to clearly see what's being spec'd. An isolation layer is just an adjustment layer that will grey out everything below it to get a little more focus on what you're showing.

## Time Counter
![Time Counter](https://knowledge-ux-prototyping.teams.x20web.corp.google.com/motion/tools/inspectorspacetime/gif/TimeCounter.gif)

Created with every spec, a counter is also available as it's own layer. Create a millisecond counter with a defined start and end point. Start the timer at the beginning of the transition to easily illustrate the global start time.

## Pointer
![Pointer](https://knowledge-ux-prototyping.teams.x20web.corp.google.com/motion/tools/inspectorspacetime/img/Pointer.png)

Everyone names things differently which can lead to confusion. So draw a line from spec data to the visual element and save yourself a lot of explaining. This button will get you started, or just draw your own. Either way, it'll make your life easier.

___
## Why the dumb name?

Named after the Doctor Who parody from the underrated NBC comedy Community. It was a really great show.

In`spec`tor Spacetime. It's a bad pun. I'm a dad. I can't help it.

[![IMAGE ALT TEXT HERE](https://img.youtube.com/vi/YOUTUBE_VIDEO_ID_HERE/0.jpg)](https://youtu.be/WQAgPaJvvHU)
___

## License
Apache 2.0
