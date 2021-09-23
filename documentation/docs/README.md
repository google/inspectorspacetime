---
home: true
heroVideo: ./video/IST_Example.mp4
tagline: Generate motion specs from After Effects and become an engineer's best friend
actionText: Download
actionLink: https://github.com/google/inspectorspacetime/releases/latest/download/InspectorSpacetime.zip
# actionLink: ./download/InspectorSpacetime.zip
usage:
- img: ./images/Panel.jpg
- title: Usage
  details: Select pairs of keyframes and click the big button. These keyframe values will be collected within the panel and may be copied out in one of the format versions (Text, Markdown, or JSON).<br /><br />Note- this JSON is not the same as <a href="https://airbnb.io/lottie/#/">Lottie</a> JSON. It is just a verbose look at all the details of the spec data. An engineer might want this or you might want to build your own converter.
- title: Collected data
  # details: <ul><li>Comp name</li><li>Total transition duration</li><li>Layer name</li><ul><li>Property name - Value change</li><li>Duration of keyframe pair</li><li>Cubic bezier easing curve</li><li>Delay time (from the playhead)</li></ul></ul>
  details: <code>Comp name <br/ >Transition duration <br /><br />Layer name <br />- PropertyName&#58 StartValue → EndValue <br />&#160 Duration (in milliseconds) <br />&#160 Easing curve as cubic bezier <br />&#160 Delay (in milliseconds) from the playhead <br /><br />- PropertyName&#58 StartValue → EndValue <br />&#160 Duration (in milliseconds) <br />&#160 ...</code>
# - title: Pastable Text
#   img: ./images/PropPanel2.png
#   details: Selected keyframe pairs are now added to the property list as plain text. Additional keys may be added to the list and the overall duration and delay of each key pair will update <br /><br /><b>Note- Live text is dead</b> as of v2.1, the live text panel has been removed because it was a major pain to get useable data from all those expressions.
updates:
- title: New in v2.5
  details: Since its initial release in 2017 as one of the first attempts at speccing motion, the ways motion designers work with engineering have matured. Inspector Spacetime is now much simpler than previous versions. <br/><br/>The dynamic expressions and spec sidebar are gone and have been replaced with a few different varieties of plain text formatting.  
- title: Improvements
  details: <ul><li>Lots of simplicity</li><li>Cubic bezier easing accuracy</li><li>Support for named easing curves</li><li> Markdown formatting of text</li><li>Transparent object notation of the spec</li><li>Removed a bunch of unnecessary stuff</li></ul>
- title: Now supporting
  details: <ul><li>Color as hex</li><li>Pseudo effects</li><li>All Ae properties except paths</li></ul>
addons:
# - title: Generated data
#   img: ./images/DataOutput2.gif
- title: New Counter
  video: ./video/TimeCounter.mp4
  details: Having a visual representation of the elapsed time on screen can often be helpful. Click to a add a new time counter layer at the playhead, and drag the <code>Start</code> and <code>End</code> markers to the beginning of the transition to easily illustrate the global start time.<br /><br />Alternatively, select a set of keyframes and click to automatically place the <code>Start</code> and <code>End</code> markers around the selected keys.
- title: Ease library
  img: ./images/Ease-library.jpg
  details: The system generates easing curves as <a href="https://cubic-bezier.com/#.4,0,.2,1">cubic bezier</a> easing functions. This is a common format, but your team might have developed its own short-hand terminology for these curves. <br/><br/>A <b>Linear</b> curve is a good example of one you might not need numbers for. <br/><br/>To auto-detect reusable curves, click the <code>✱</code> button at the bottom of the panel to open the <code>/config</code> folder. Open the <code>ease-library.json</code> file in a text editor and add new curves in JSON format. <br/><br/> <code>"material standard"&#58 [<br />&#160 0.4,<br />&#160 0,<br />&#160 0.2,<br />&#160 1<br />],</code>
footer: Built by <a href="http://battleaxe.co">Adam Plouff</a> and your friends at <a href="https://wearesumux.appspot.com/">Google motion design</a>
---
