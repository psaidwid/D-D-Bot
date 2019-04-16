const Discord = require('discord.js');
const PollManager = require('./pollmanager.js');
const bot = new Discord.Client();
const settings = require('./settings.json');
const prefix = '&';
const admin = '155139566842413056';

var dndPlayers = new Array();
var polls = new Array();

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
    message.channel.send('Sorry, wrong arguments, use ```&setname char_name``` to set your character name');
  }

	if (message.content.startsWith(prefix + 'getMembers')) {
		for (var [snowflake, role] of message.mentions.roles) {
			for (var [snowflake, member] of role.members) {
				message.channel.send('<@' + member.id + '>');
			}
		}
	}

	if (message.content.startsWith(prefix + 'spoll') && (message.content.split(" ").length > 3) && message.content.includes('[')  && message.content.includes(']')) {

		//Poll(pName, pVoters, pOptions, pVotes)

		newVoters = new Array();

		for (var [snowflake, role] of message.mentions.roles) {
			for (var [snowflake, member] of role.members) {
				newVoters.push(member.id);
			}
		}

		optionsString = message.content.substring(message.content.indexOf('[') + 1, message.content.lastIndexOf(']')).replace(' ', '');
		console.log(optionsString);

		newOptions = new Array();
		numVotes = new Array();
		numTotalVotes = 0;

		for (option of optionsString.split(',')) {
			newOptions.push(option);
			numVotes.push(0);
		}

		newPoll = new Poll(message.content.split(" ")[1], newVoters, newOptions, numVotes);

		polls.push(newPoll);
    console.log(newPoll);

		message.channel.send('A new poll \'' + newPoll.name + '\' has been created.\nHere are the options');
		voteNum = 1;
		for (option of newPoll.options) {
			message.channel.send(voteNum + ') ' + option);
			voteNum++;
		}

		for (player of newPoll.voters)
		{
			//message.channel.send('<@' + player + '>');
		}

	}
  else if (message.content.startsWith(prefix + 'spoll')) {
  	console.log(message.content.split(" "));
    message.channel.send('Sorry, wrong arguments, use ```&spoll vote_name group_name [option1, option2]``` to start a poll');
  }

	if (message.content.startsWith(prefix + 'vote') && (message.content.split(" ").length == 3)) {

		pollIndex = 0;
		for (i = 0; i < polls.length; i++) {
			if (polls[i].name == message.content.split(" ")[1]) {
				pollIndex = i;
				break;
			}
		}
		poll = polls[i];

		for (i = 0; i < poll.voters.length; i++) {
			if (poll.voters[i] == message.author.id) {
				poll.voters.splice(i, 1);
				break;
			}
		}

		poll.votes[message.content.split(" ")[2] - 1] += 1;

		console.log(polls);

		if (poll.voters.length == 0)
		{
			message.channel.send("Poll Finished");
		}
	}
  else if (message.content.startsWith(prefix + 'vote')) {
  	console.log(message.content.split(" "));
    message.channel.send('Sorry, wrong arguments, use ```&vote vote_name option_name``` to start a poll');
  }
});


bot.login(settings.token);

class Player {
	constructor(pID, pName) {
    this.id = pID;
		this.name = pName;
	}
}

class Poll {
  constructor(pName, pVoters, pOptions, pVotes) {
		this.name = pName;
    this.voters = pVoters;
    this.options = pOptions;
    this.votes = pVotes;
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
