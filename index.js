'use strict'

const express = require('express')
const bodyParser = require('body-parser')
const request = require('request')
const app = express()

app.set('port',(process.env.PORT || 5000))
app.use(bodyParser.urlencoded({extended:false}))
app.use(bodyParser.json())

app.get('/',function(req,res){
	res.send("Hello World from Echo-CHAT-BOT!")
})

app.get('/webhook/', function (req, res) {
	if (req.query['hub.verify_token'] === 'beyrambg') {
		res.send(req.query['hub.challenge'])
	} else {
		res.send('Error ! token is wrong')
	}
})
const token = "EAAO0uD2DpOkBAJbGeOM81emLDYpR9ZAjzD8gRY97lV1NVR1JFIuT4XZB8ppM8NFhrajJUZB2IK6s2jruKYSnGpFtneq3U4GkIWENta3ig60LG0DYYKtKQM9fTuJLJwr18orfTxPL7mU4HQZBo3hsNzjlHWaQTx9Ro14mSI4ZCDwZDZD"

app.post('/webhook/', function (req, res) {
	let messaging_events = req.body.entry[0].messaging
	for (let i = 0; i < messaging_events.length; i++) {
		let event = req.body.entry[0].messaging[i]
		let sender = event.sender.id
		if (event.message && event.message.text) {
			let text = event.message.text
			sendTextMessage(sender, "Text received : " + text.substring(0, 100))
		}
	}
	res.sendStatus(200)
})



function sendTextMessage(sender, text) {
	let messageData = { text:text }
	request({
		url: 'https://graph.facebook.com/v2.9/me/messages',
		qs: {access_token:token},
		method: 'POST',
		json: {
			recipient: {id:sender},
			message: messageData,
		}
	}, function(error, response, body) {
		if (error) {
			console.log('Error sending message: ', error)
		} else if (response.body.error) {
			console.log('Error: ', response.body.error)
		}
	})
}


app.listen(app.get('port'), function() {
	console.log('running on port', app.get('port'))
})