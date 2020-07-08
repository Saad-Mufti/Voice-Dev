// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = require('vscode');
// const vad = require('node-vad')
const deepSpeech = require('deepspeech')
const mic = require('mic')

let model;
let modelStream;



// this method is called when your extension is activated
// your extension is activated the very first time the command is executed

function initModel() {
	if(!process.env.PRETRAINED_ENG_MODEL_PATH) {
		process.env.PRETRAINED_ENG_MODEL_PATH = __dirname + "\\DeepSpeechPreTrainedModel"
	}

	model = new deepSpeech.Model(process.env.PRETRAINED_ENG_MODEL_PATH + "\\deepspeech-0.7.0-models.pbmm")
	model.enableExternalScorer(process.env.PRETRAINED_ENG_MODEL_PATH + "\\deepspeech-0.7.0-models.scorer")
	return model
}

let microphone

function initMic() {
	microphone = mic()
	var inputStream = microphone.getAudioStream()
	modelStream = model.createStream()
	inputStream.on('data', (data) => {
		console.log("Data received" + data)
		modelStream.feedAudioContent(data)
	})
	microphone.start()
}

// model = initModel()
// model.createStream().feedAudioContent()

function processResults() {
	model.createStream()
	
}

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "voice-dev" is now active!');

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with  registerCommand
	// The commandId parameter must match the command field in package.json
	let disposable = vscode.commands.registerCommand('voice-dev.beginListening', function () {
		// The code you place here will be executed every time your command is executed
		console.log("Listening now")
		model = initModel()
		initMic()
	});

	context.subscriptions.push(disposable);
}
exports.activate = activate;

// this method is called when your extension is deactivated
function deactivate() {
	vscode.window.showInformationMessage("It's quite sad to see you go :( \nWould you like to give some feedback so we can improve for next time?");
}

module.exports = {
	activate,
	deactivate
}
