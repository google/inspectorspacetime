<img src="https://google.github.io/inspectorspacetime/images/Inspector_Spacetime_logo.png" width="100" alt="Inspector Spacetime logo">

# [Inspector Spacetime][4e4c540d]
Motion specs are a necessary part of the engineering process. It's often difficult and time consuming to deliver the data required to replicate motion on device. With Inspector Spacetime it is possible to generate this data in the most usable formats, with just one click.

  [4e4c540d]: https://google.github.io/inspectorspacetime/ "Inspector Spacetime"

> This is not an official Google product. Motion designers at Google just kinda like it a lot. Built by [Adam Plouff][8638464d].

  [8638464d]: http://www.battleaxe.co/ "Battle Axe"

---
## Installation


### CC2019+
In newer versions of After Effects, it is possible to install Inspector Spacetime and other scripts without digging through your hard drive.

`File > Scripts > Install Script UI Panel…`

Restart Ae and InspectorSpacetime will be available in the Window menu at the top of the screen. Scroll down to find the installed scripts


### CC2018 and older
1. Close After Effects
2. Drag the `InspectorSpacetime.jsx` file into Applications > Adobe After Effects [version number] > Scripts > ScriptUI Panels
3. Fire up After Effects again
4. Navigate to the Window menu up top. At the bottom you'll see `InspectorSpacetime.jsx`

---
## Usage

### Basics
<img src="https://google.github.io/inspectorspacetime/images/Panel.jpg" width="280">

Select pairs of keyframes and click the big button. These keyframe values will be collected within the panel and may be copied out in one of the format versions (Text, Markdown, or JSON).

Note- this JSON is not the same as Lottie JSON. It is just a verbose look at all the details of the spec data. An engineer might want this or you might want to build your own converter.

### Collected data
```
Comp name
Transition duration

Layer name
- PropertyName: StartValue → EndValue
  Duration (in milliseconds)
  Easing curve as cubic bezier
  Delay (in milliseconds) from the playhead

- PropertyName: StartValue → EndValue
  Duration (in milliseconds)
  ...
```

### New in 2.5
Since its initial release in 2017 as one of the first attempts at speccing motion, the ways motion designers work with engineering have matured. Inspector Spacetime is now much simpler than previous versions.

The dynamic expressions and spec sidebar are gone and have been replaced with a few different varieties of plain text formatting.

#### Improvements
- Lots of simplicity 
- Cubic bezier easing accuracy
- Support for named easing curves
- Markdown formatting of text
- Transparent object notation of the spec
- Removed a bunch of unnecessary stuff

#### Now supporting
- Color as hex
- Pseudo effects
- All Ae properties except paths


## Addons

### New Counter
<img src="https://google.github.io/inspectorspacetime/images/TimeCounter.gif" width="380">

Having a visual representation of the elapsed time on screen can often be helpful. Click to a add a new time counter layer at the playhead, and drag the Start and End markers to the beginning of the transition to easily illustrate the global start time.

Alternatively, select a set of keyframes and click to automatically place the Start and End markers around the selected keys.

### Eas library
<img src="https://google.github.io/inspectorspacetime/images/Ease-library.jpg" width="380">

The system generates easing curves as cubic bezier easing functions. This is a common format, but your team might have developed its own short-hand terminology for these curves.

A Linear curve is a good example of one you might not need numbers for.

To auto-detect reusable curves, click the ✱ button at the bottom of the panel to open the /config folder. Open the ease-library.json file in a text editor and add new curves in JSON format.

```
"material standard": [
  0.4,
  0,
  0.2,
  1
],
```

___
## Why the dumb name?

Named after the Doctor Who parody from the underrated NBC comedy [Community][a97544c1]. The series really falls apart at the end but it's mostly pretty amazing.

  [a97544c1]: https://youtu.be/WQAgPaJvvHU "Community - Inspector Spacetime'"

In**spec**tor Spacetime. It's a bad pun. But I'm a dad. I can't help it.
___

## License
Apache 2.0
