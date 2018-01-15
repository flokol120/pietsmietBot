const Discord = require('discord.js');
const fs = require('fs');
const key = require('./key');
const mysql = require('mysql');
const client = new Discord.Client();

var connection = mysql.createConnection(key.mysql);

connection.connect(function (err) {
    if(err){
        console.error('error connecting to Database: ' + err.stack);
        return;
    }
    console.log('connected as id ' + connection.threadId);
    return connection;
});

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

//on message emits

client.on('message', message => {
  var messageCommands = message.content.split(' ');
  //core command '!pietsmiet' or '!ps'
  var guildID = message.channel.guild.id;
  var guildName = message.channel.guild.name;

  //get saved prefix from mySQL Server
  var sql = `SELECT prefix FROM servers WHERE SID = ${guildID}`;
  connection.query(sql, function (err, results, fields) {
  	  //if any error occurs the command will be set to default
      var prefix = '!pietsmiet';
      if(err){
      	console.error(err.stack);
      }else {
      	prefix = results[0].prefix;
	  }

	  //check if first word matches the prefix
      if (messageCommands[0] === prefix) {
          console.log('command was issued from guild id: ' + guildID + ' name: ' + guildName);
          if(messageCommands[1] === 'gif'){
              //reads all avalible gifs from the '/gifs/' folder
              fs.readdir('./gifs/', function (err, files) {
                  //generates a random number from 0 to the length of the avalible files - 1
                  //to get the proper index
                  var random = Math.floor(Math.random() * (files.length - 1));
                  //sends the gif into the channel where the command was executed
                  message.channel.send("", {file: './gifs/' + files[random]});
                  console.log('GIF was sent to ' + message.channel.name)
              });
          }else if(messageCommands[1] === 'invite' || messageCommands[1] === 'einladen'){
          	  //sends the invite URL in the chat
              message.channel.send('Hier ist der invite-link des Bots: ' + inviteURL);
          }else if(messageCommands[1] === 'set'){
          	  //sets a new command
			  //check if there are less than 3 arguments
			  if(messageCommands.size < 3){
			  	message.channel.send('Du musst schon den neuen Command eingeben!');
			  //checks if there are more than 3 arguments
			  }else if(messageCommands.size > 3){
                  message.channel.send('Das war jetzt so viel! Achte darauf, dass dein Command keine Leerzeichen enthält!');
			  }else {
			  	//check for permission
			    if(message.member.roles.some(r=>["Dev", "Mod", "Server Staff", "Owner", "Boss"].includes(r.name))){
                    //changes the command
                    if(changePrefix(messageCommands[2], guildID)){
                        message.channel.send('Der neue Command ist jetzt ' + messageCommands[2]);
                    }else {
                        message.channel.send('Da ist was falsch gelaufen! Versuche es erneut, mit einem anderem Command!');
                    }
				}else{
                      message.channel.send('Du Schlingel! Dafür hast Du aber nicht genug Rechte :P');
			    }
			  }
		  //fires the help command
          }else if(messageCommands[1] === 'help' || messageCommands[1] === 'hilfe'){
              message.channel.send('Folgende Commands stehen mit dem command ´!pietsmiet´ oder ´!ps´ zur Verfügung:\n' +
                  'gif  -  gibt dir eins der geilen GIFs der PietSmiet Truppe!\n' +
                  'invite ODER einladen  -  schickt dir denn invite link zu.\n' +
                  'help ODER hilfe  -  zeige diesen Text an.' +
                  'set [neuer Prefix]  -  setze deinen eigenen Prefix für den bot (es wird kein "!" hinzugefügt)');
          }
      }
  });
  


});

//logs to console when added to a new server
client.on('guildCreate', function (guild) {
  	console.log('joined the server ' + guild.name);

  	var sql = `INSERT INTO servers (SID, name) VALUES (${guild.id}, '${guild.name}')`
	connection.query(sql, function (err, result) {
		if(err){
			console.error('fail!: ' + err.stack);
			return;
		}
		console.log('Added server successfully to the database.')
    });
});

//changes the bot prefix
function changePrefix(newPrefix, guildID) {
    var sql = `UPDATE servers SET prefix = '${newPrefix}' WHERE SID = ${guildID}`;
    console.log(sql);
    connection.query(sql, function (err, result) {
        if(err){
            console.error('fail!: ' + err.stack);
            return false;
        }
        console.log('prefix was changed to ' + newPrefix + ' on ' + guildID);
    });
    return true;
}

//logs in with the secret bot token
client.login(key.botToken);
