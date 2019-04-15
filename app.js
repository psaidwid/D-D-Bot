const Discord = require('discord.js');
const bot = new Discord.Client();
const settings = require('./settings.json');
const prefix = '&';
const admin = '155139566842413056';

var dndPlayers = new Array();

bot.on('ready',() => {
	console.log('D&D Bot Online');
	bot.user.setActivity(prefix + 'help');
});


bot.on('message', message => {
	if (message.author === bot.user)
		return;

	if (message.content.startsWith(prefix + 'ping')) {
		console.log(message.author.username + ' : ping : ' + message.createdAt);
		message.channel.send('pong');
	}

	if (message.content.startsWith(prefix + 'roll')) {
		var dice = (Math.floor(Math.random() * Math.floor(message.content.split(" ")[1])) + 1);
		var messageString = '';
		if (dice == 1 || dice == 20)
			messageString = ' rolled a NATURAL ';
		else
			messageString = ' rolled a ';

		message.channel.send(getCharacterName(message.author.id) + '(<@' + message.author.id + '>)' + messageString + dice);
		console.log(message.author.username + messageString + dice);
	}

	if (message.content.startsWith(prefix + 'setname') && (message.content.split(" ").length > 1)) {
    setCharacterName(message.author.id, message.content.split(" ")[1]);
    console.log(message.author.username + ' set their character name to ' + message.content.split(" ")[1]);
    message.channel.send('Hello ' + getCharacterName(message.author.id));
	}
  else if (message.content.startsWith(prefix + 'setname')) {
    console.log(message.content.split(" "));
    message.channel.send('Sorry, wrong arguments, use ```&setname bob``` to set your name to bob');
  }

});


bot.login(settings.token);

class Player {
	constructor(pID, pName) {
    this.id = pID;
		this.name = pName;
	}
}

function sleep(milliseconds) {
  var start = new Date().getTime();
  for (var i = 0; i < 1e7; i++) {
    if ((new Date().getTime() - start) > milliseconds){
      break;
    }
  }
}

function getCharacterName(userID) {
  charName = '';
  for (i = 0; i < dndPlayers.length; i++)
  {
    if (dndPlayers[i].id == userID)
    {
      return dndPlayers[i].name;
    }
  }
  return '';
}

function setCharacterName(userID, charName) {
  for (i = 0; i < dndPlayers.length; i++)
  {
    if (dndPlayers[i].id == userID)
    {
      dndPlayers[i].name = charName;
      return;
    }
  }

  dndPlayers.push(new Player(userID, charName));
  return;
}
