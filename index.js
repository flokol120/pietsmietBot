const Discord = require('discord.js');
const fs = require('fs');
const key = require('./key');
const client = new Discord.Client();

//invite URL = https://discordapp.com/oauth2/authorize?&client_id=402225466108411936&scope=bot&permissions=0

//on client ready. Sets the current game.

client.on('ready', () => {
  console.log('I am ready!');
  client.user.setPresence({game: {name: 'mit dem YT-Money', type: 0}});
});

//on message emmits

client.on('message', message => {
  //command '!pietsmiet'
  if (message.content === '!pietsmiet') {
    //reads all avalible gifs from the '/gifs/' folder
    fs.readdir('./gifs/', function (err, files) {
      //generates a random number from 0 to the length of the avalible files - 1
      //to get the proper index
      var random = Math.floor(Math.random() * (files.length - 1));
      //sends the gif into the channel where the command was executed
      message.channel.send("", {file: './gifs/' + files[24]});
    });
  }
});

//logs to console when added to a new server
client.on('guildCreate', function (guild) {
  console.log('joined the server ' + guild.name);
});

//logs in with the secret bot token
client.login(key.botToken);
