// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = require('vscode');
const vad = require('node-vad')
const deepSpeech = require('deepspeech')
const mic = require('node-audiorecorder')

const axios = require('axios')
const NLPUtil = require('./nlpUtil').NLPUtility
const env = require('./environment').Environment

const nlp = require('node-nlp')

const vadMode = vad.Mode.AGGRESSIVE
let model;
let modelStream;
let chunks = 0
let silenceStart = null


// this method is called when your extension is activated
// your extension is activated the very first time the command is executed

function initVoiceModel() {
	if(!process.env.PRETRAINED_ENG_MODEL_PATH) {
		process.env.PRETRAINED_ENG_MODEL_PATH = __dirname + "\\DeepSpeechPreTrainedModel"
	}

	model = new deepSpeech.Model(process.env.PRETRAINED_ENG_MODEL_PATH + "\\deepspeech-0.7.4-models.pbmm")
	model.enableExternalScorer(process.env.PRETRAINED_ENG_MODEL_PATH + "\\deepspeech-0.7.4-models.scorer")
	console.log("Model initialized with path")
	console.log("Sample rate is: " + model.sampleRate())
	return model
}

let microphone;
let options = { // Change this configuration to resolve any hardware related issues with mic access. 
	program: `sox`,
	device: null,
	driver: `waveaudio`,
	bits: 16,
	channels: 1,
	rate: 16000,
	encoding: `signed-integer`,
	type: `wav`,
	silence: 0,
	keepSilence: true
}

function initMic() {
	microphone = new mic(options, console)
	
	var inputStream = microphone.start().stream()
	modelStream = model.createStream()

	console.log("event names are" + inputStream.eventNames())
	
	inputStream.on('data', (data) => {
		beginListening(data)
	})
	console.log("Microphone initialized")
}


function beginListening(data) {

	let listen = new vad(vadMode)
	listen.processAudio(data, 16000).then((res) => {
		switch(res) {
			case vad.Event.VOICE:
				console.log("Voice detected")
				silenceStart = null
				// modelStream = model.createStream()
				data = addBufferedSilence(data)
				modelStream.feedAudioContent(data)
				chunks++
				break;

			case vad.Event.ERROR:
				console.log("Error from node-vad")
				break;

			case vad.Event.NOISE:
				console.log("VAD Noise")
				break

			case vad.Event.SILENCE:
				// console.log("silence...")
				processSilence(data)
				break
		}
	}
		
	);
}


function processSilence(data) {
	
	if(chunks > 0) {
		if(silenceStart === null) { // First instance of silence after hearing voice prior
			silenceStart = new Date().getTime()
			modelStream.feedAudioContent(data)
		}
		else { // Checking to see whether enough silence has passed or not.
			if(new Date().getTime() - silenceStart > 1000) { // Defined threshold in milliseconds (ms)
				silenceStart = null
				
				var res = modelStream.finishStream()
				if(res) {
					console.log("Result is: " + res)
					interpretRequest(res)
				}
				else {
					console.log("No result :(" + res)
				}
				
				modelStream = model.createStream()
				chunks = 0
			} 
		}
		
	}
	else {
		// console.log("Just silence......")
		bufferSilence(data)
	}
}

let language = null
let classifier = null
function interpretRequest(input) {
	if(language !== env.language && language !== null) { // Language has changed, can't go further
		console.log("Target language has changed: " + language)
	}
	else {
		debugger;
		if(!language) {
			language = env.language
		}
		if(!classifier) {
			classifier = NLPUtil.loadModel()
		}

		console.log('language is ' + language)
		
		let res = classifier.getClassifications(input)
		let sum = 0;
		for(var i in res) {
			sum += res[i]['value']
		} 
		if(sum < .80) {
			console.log('couldnt recognize vcs command')
			let response = NLPUtil.stackOverflowQuery(input)

			console.log(response)
		}
		else {
			console.log('recognized vcs command')
			env.editor.edit((editBuilder) => {
				editBuilder.insert()
			})
		}
		
	}

}

function categorize() {

}


let silenceBuffers = []
function bufferSilence(data) {
	// VAD has a tendency to cut the first bit of audio data from the start of a recording
	// so keep a buffer of that first bit of audio and in addBufferedSilence() reattach it to the beginning of the recording
	silenceBuffers.push(data);
	if (silenceBuffers.length >= 3) {
		silenceBuffers.shift();
	}
}

function audioTest() { // Works fine!! "C:\\Users\\Saad Mufti\\Downloads\\audio-0.7.4.tar\\audio-0.7.4\\audio\\8455-210777-0068.wav"

	const Fs = require('fs')
	const Wav = require('node-wav')
	const Duplex = require('stream').Duplex
	const Sox = require('sox-stream')
	const MemoryStream = require('memory-stream')

	let audioFilePath = "C:\\Users\\Saad Mufti\\Downloads\\new-file.wav" //__dirname + "\\new-file.wav"
	if(!Fs.existsSync(audioFilePath)) {
		console.log("Audio file missing.")
	}
	else {
		let buffer = Fs.readFileSync(audioFilePath)
		let result = Wav.decode(buffer) 
		if(result.sampleRate != model.sampleRate()) {
			console.log("Sample rates of model and audio file not equal")
		}
		let audioStream = new MemoryStream()
		let stream = new Duplex()
		stream.push(buffer)
		stream.push(null)
		stream.pipe(Sox({
			global: {
				'no-dither': true,
			},
			output: {
				bits: 16,
				rate: 16000,
				channels: 1,
				encoding: 'signed-integer',
				endian: 'little',
				compression: 0.0,
				type: 'wav'
			}
		})).pipe(audioStream);

		audioStream.on('finish',() => {
			let audioBuffer = audioStream.toBuffer();
	
			const audioLength = (audioBuffer.length / 2) * (1 / 16000);
			console.log('audio length', audioLength);

			let result = model.stt(audioBuffer);
			console.log('result:', result);
		} )
	}
}

function addBufferedSilence(data) {
	let audioBuffer;
	if (silenceBuffers.length) {
		silenceBuffers.push(data);
		let length = 0;
		silenceBuffers.forEach(function (buf) {
			length += buf.length;
		});
		audioBuffer = Buffer.concat(silenceBuffers, length);
		silenceBuffers = [];
	}
	else audioBuffer = data;
	return audioBuffer;
}

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {

	
	// The command has been defined in the package.json file
	// Now provide the implementation of the command with  registerCommand
	// The commandId parameter must match the command field in package.json
	let beginListening = vscode.commands.registerCommand('voice-dev.beginListening', function () {
		
		console.log("Listening now")
		model = initVoiceModel()
		classifier =NLPUtil.vcsTrain()
		// audioTest()
		initMic()
	});

	let stopListening = vscode.commands.registerCommand('voice-dev.stopListening', () => {
		if(modelStream) {
			modelStream.finishStream()
		}
		microphone.stop()
	})

	context.subscriptions.push(beginListening);
	context.subscriptions.push(stopListening);
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
