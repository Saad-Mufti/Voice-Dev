# voice-dev

Streamline your development workflow by leveraging Voice-Dev. Voice-Dev is a VS Code Expansion where you can speak commands to your machine and expect an output of code for whichever language you are working in. 
The extension uses node-audiorecorder to get audio input, Mozilla's DeepSpeech pre-trained English model as a Speech-to-Text engine, and NLP.js to process and intelligently interpret requests using NLP classifications. 

## Features

-Get code directly from stackoverflow from spoken queries.

## Requirements

As of 7/14/2020, Mozilla's DeepSpeech library only mainly supports major releases of ElectronJS (5.0, 6.0, 7.0, etc), so VS Code running on ElectronJS 7.3 will not work. It is recommended that you install VS Code 1.43.2 (Feb Release) for the best experience with this extension. 

<!-- ## Extension Settings

Include if your extension adds any VS Code settings through the `contributes.configuration` extension point.

For example:

This extension contributes the following settings:

* `myExtension.enable`: enable/disable this extension
* `myExtension.thing`: set to `blah` to do something -->

## Known Issues

- Currently there may be an issue with accessing the built in Git API so using VCS related commands may not work. This is currently being investigated. 

--------------------------------------

## Release Notes

### 0.0.1

Initial Release! Windows audio input seems to work fine (other platforms need to be tested), and the deepspeech engine also seems to be working fine. 

<!-- ### 1.0.1

Fixed issue #.

### 1.1.0

Added features X, Y, and Z. -->

-----------------------------------------------------------------------------------------------------------

<!-- ## Working with Markdown

**Note:** You can author your README using Visual Studio Code.  Here are some useful editor keyboard shortcuts:

* Split the editor (`Cmd+\` on macOS or `Ctrl+\` on Windows and Linux)
* Toggle preview (`Shift+CMD+V` on macOS or `Shift+Ctrl+V` on Windows and Linux)
* Press `Ctrl+Space` (Windows, Linux) or `Cmd+Space` (macOS) to see a list of Markdown snippets

### For more information

* [Visual Studio Code's Markdown Support](http://code.visualstudio.com/docs/languages/markdown)
* [Markdown Syntax Reference](https://help.github.com/articles/markdown-basics/)

**Enjoy!** -->
