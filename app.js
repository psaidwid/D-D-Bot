const Discord = require('discord.js');
const bot = new Discord.Client();
const settings = require('./settings.json');
const prefix = '&';

var DM = 0;
var Players = new Array();
var Polls = new Array();

bot.on('ready',() => {
	console.log('D&D Bot Online');
	bot.user.setActivity(prefix + 'help');
});


bot.on('message', message => {
	if (message.author === bot.user)
		return;

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

	if (message.content.startsWith(prefix + 'list') && (message.content.split(" ").length == 2)) {
		listCommand = message.content.split(" ")[1];

		switch (listCommand)
		{
			case 'polls':

				for (poll of Polls)
					message.channel.send(poll.name);

			 	break;
			case 'players':

				for (player of Players)
					message.channel.send(player.name + ' is <@' + player.id + '>');

 			 	break;
			case 'initiatives':

				for (player of Players)
					message.channel.send(player.name + ' has an initiative of ' + player.initiative);

 			 	break;
		}
	}
	else if (message.content.startsWith(prefix + 'list')) {
		console.log(message.content.split(" "));
    message.channel.send('Sorry, wrong arguments, use ```&list object_name``` to start a poll');
	}

	if (message.content.startsWith(prefix + 'setname') && (message.content.split(" ").length > 1)) {
    setCharacterName(message.author.id, message.content.split(" ")[1]);
    console.log(message.author.username + ' set their character name to ' + getCharacterName(message.author.id));
    message.channel.send('Hello ' + getCharacterName(message.author.id));
	}
  else if (message.content.startsWith(prefix + 'setname')) {
    console.log(message.content.split(" "));
    message.channel.send('Sorry, wrong arguments, use ```&setname char_name``` to set your character name');
  }

	if (message.content.startsWith(prefix + 'setinitiative') && (message.content.split(" ").length == 2)) {
    setCharacterInitiative(message.author.id, message.content.split(" ")[1]);
    console.log(message.author.username + ' set their initiative to ' + getCharacterInitiative(message.author.id));
    message.channel.send('Initiative set to ' + getCharacterInitiative(message.author.id));
	}
  else if (message.content.startsWith(prefix + 'setinitiative')) {
    console.log(message.content.split(" "));
    message.channel.send('Sorry, wrong arguments, use ```&setname char_name``` to set your character name');
  }

	if (message.content.startsWith(prefix + 'test')) {
		if (message.author.id == DM) {
			message.channel.send("Hello DM");
		}
		else {
			message.channel.send("You are not the chosen one");
		}
	}

	if (message.content.startsWith(prefix + 'getMembers'))
		for (var [snowflake, role] of message.mentions.roles)
			for (var [snowflake, member] of role.members)
				message.channel.send('<@' + member.id + '>');

	if (message.content.startsWith(prefix + 'spoll') && (message.content.split(" ").length > 3) && message.content.includes('[')  && message.content.includes(']')) {

		newVoters = new Array();

		for (var [snowflake, role] of message.mentions.roles)
			for (var [snowflake, member] of role.members)
				newVoters.push(member.id);

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

		Polls.push(newPoll);
    console.log(newPoll);

		message.channel.send('A new poll \'' + newPoll.name + '\' has been created.\nHere are the options');
		voteNum = 1;
		for (option of newPoll.options) {
			message.channel.send(voteNum + ') ' + option);
			voteNum++;
		}
	}
  else if (message.content.startsWith(prefix + 'spoll')) {
  	console.log(message.content.split(" "));
    message.channel.send('Sorry, wrong arguments, use ```&spoll vote_name group_name [option1, option2]``` to start a poll');
  }

	if (message.content.startsWith(prefix + 'vote') && (message.content.split(" ").length == 3)) {

		pollIndex = 0;
		for (i = 0; i < Polls.length; i++)
			if (Polls[i].name == message.content.split(" ")[1]) {
				pollIndex = i;
				break;
			}

		poll = Polls[i];

		for (i = 0; i < poll.voters.length; i++) {
			if (poll.voters[i] == message.author.id) {
				poll.voters.splice(i, 1);
				break;
			}
		}

		poll.votes[message.content.split(" ")[2] - 1] += 1;

		if (poll.voters.length == 0)
		{
			pollWinner = 0;
			pollWinnerVotes = 0;

			for (i = 0; i < poll.votes.length; i++)
				if (poll.votes[i] > pollWinnerVotes)
				{
					pollWinnerVotes = poll.votes[i];
					pollWinner = i;
				}

			message.channel.send(poll.name + " has finished Finished");
			if (poll.name == 'DM') {
				DM = poll.options[pollWinner];
				console.log("DM set to " + DM);
				message.channel.send("The new DM is <@" + DM + ">");
			}
			else
				message.channel.send("The winner is " + poll.options[pollWinner]);
		}

	}
  else if (message.content.startsWith(prefix + 'vote')) {
  	console.log(message.content.split(" "));
    message.channel.send('Sorry, wrong arguments, use ```&vote vote_name option_name``` to start a poll');
  }

	if (message.content.startsWith(prefix + 'dmvote') && (message.content.split(" ").length == 2)) {

		newVoters = new Array();
		newOptions = new Array();
		numVotes = new Array();
		numTotalVotes = 0;

		for (var [snowflake, role] of message.mentions.roles)
			for (var [snowflake, member] of role.members)
			{
				newOptions.push(member.id);
				numVotes.push(0);
				newVoters.push(member.id);
			}

		newPoll = new Poll("DM", newVoters, newOptions, numVotes);

		Polls.push(newPoll);
    console.log(newPoll);

		message.channel.send('A new poll \'' + newPoll.name + '\' has been created.\nHere are the options');
		voteNum = 1;
		for (option of newPoll.options) {
			message.channel.send(voteNum + ') <@' + option + '>');
			voteNum++;
		}
	}
  else if (message.content.startsWith(prefix + 'dmvote')) {
  	console.log(message.content.split(" "));
    message.channel.send('Sorry, wrong arguments, use ```&dmvote group_name``` to start a poll for the new DM');
  }

});


bot.login(settings.token);

class Player {
	constructor(pID) {
    this.id = pID;
		this.name = '';
		this.initiative = 0;
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
  for (var i = 0; i < 1e7; i++)
    if ((new Date().getTime() - start) > milliseconds)
      break;
}

function getCharacterInitiative(userID) {
  for (i = 0; i < Players.length; i++)
    if (Players[i].id == userID)
      return Players[i].initiative;

  return '';
}

function setCharacterInitiative(userID, charInit) {
  for (i = 0; i < Players.length; i++)
    if (Players[i].id == userID) {
      Players[i].initiative = charInit;
      return;
    }

	newChar = new Player(userID);
	newChar.initiative = charInit;

  Players.push(newChar);
  return;
}

function getCharacterName(userID) {
  for (i = 0; i < Players.length; i++)
    if (Players[i].id == userID)
      return Players[i].name;

  return '';
}

function setCharacterName(userID, charName) {
  for (i = 0; i < Players.length; i++)
    if (Players[i].id == userID) {
      Players[i].name = charName;
      return;
    }

	newChar = new Player(userID);
	newChar.name = charName;

  Players.push(newChar);

  return;
}
