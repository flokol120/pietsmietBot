const Discord = require('discord.js');
const fs = require('fs');
const key = require('./key');
const client = new Discord.Client();

var clientID = '402225466108411936';

//invite URL
var inviteURL = 'https://discordapp.com/oauth2/authorize?&client_id=' + clientID +
				'&scope=bot' + 
				'&permissions=0';

//on client ready. Sets the current game.

client.on('ready', () => {
  console.log('I am ready!');
  client.user.setPresence({game: {name: 'mit dem YT-Money', type: 0}});
});

//on message emmits

client.on('message', message => {
  //cpre command '!pietsmiet'
  var messageCommands = message.content.split(' ');
  if (messageCommands[0] === '!pietsmiet') {
	if(messageCommands[1] === 'gif'){
		//reads all avalible gifs from the '/gifs/' folder
		fs.readdir('./gifs/', function (err, files) {
		  //generates a random number from 0 to the length of the avalible files - 1
		  //to get the proper index
		  var random = Math.floor(Math.random() * (files.length - 1));
		  //sends the gif into the channel where the command was executed
		  message.channel.send("", {file: './gifs/' + files[random]});
		});
	}else if(messageCommands[1] === 'invite' || messageCommands[1] === 'einladen'){
		message.channel.send('Hier ist der invite-link des Bots: ' + inviteURL);
	}else if(messageCommands[1] === 'help' || messageCommands[1] === 'hilfe'){
    	message.channel.send('Folgende Commands stehen mit dem command ´!pietsmiet´ zur Verfügung:\n' +
						 	 'gif  -  gibt dir eins der geilen GIFs der PietSmiet Truppe!\n' +
						 	 'invite ODER einladen  -  schickt dir denn invite link zu.\n' +
						 	 'help ODER hilfe  -  zeige diesen Text an.');
	}
  }
});

//logs to console when added to a new server
client.on('guildCreate', function (guild) {
  console.log('joined the server ' + guild.name);
});

//logs in with the secret bot token
client.login(key.botToken);
