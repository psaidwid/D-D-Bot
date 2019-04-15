const Discord = require('discord.js');
const bot = new Discord.Client();
const settings = require('./settings.json');
const prefix = '&';
const admin = '155139566842413056';

var dndPlayers;
var votes = new Array();

function sleep(milliseconds) {
  var start = new Date().getTime();
  for (var i = 0; i < 1e7; i++) {
    if ((new Date().getTime() - start) > milliseconds){
      break;
    }
  }
}

function getNickname()
{

}

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

		message.channel.send('<@' + message.author.id + '>' + messageString + dice);
		console.log(message.author.username + messageString + dice);
	}

	if (message.content.startsWith(prefix + 'setname')) {
		message.channel.send('Sorry this isn\'t ready yet');
	}

	if (message.content.startsWith(prefix + 'sv')) {

		var messageContent = message.content.split(" ");
		var newVote = new Vote(messageContent[1]);

		newVote.voters = messageContent[2];

		message.channel.send('A new vote \'' + newVote.name + '\' has been created for \'' + newVote.voters + '\' voters with the options\n')

		for (var i = 3; i < messageContent.length; i++)
		{
			message.channel.send('```' + messageContent[i] + '```');
			newVote.options.push(messageContent[i]);
		}

		for (var i = 3; i < messageContent.length; i++)
			newVote.votes.push(0);


		votes.push(newVote);
		//console.log(votes);
	}

  if (message.content.startsWith(prefix + 'log')) {
    console.log(votes);
  }

	if (message.content.startsWith(prefix + 'vote')) {
		var voteEnd = false;
		var voteName = new String();
    var vote = new Array();
		for (var voteIndex = 0; voteIndex < votes.length; voteIndex++) {
      if (votes[voteIndex].name = message.content.split(" ")[1]) {
        vote = votes[voteIndex];
      }
		}

    vote.votes[message.content.split(" ")[2] - 1] += 1;

    var totalVotes = new Number();
    var winner = vote.options[0];
    var winnerVotes = new Number();

    for (var i = 0; i < vote.votes.length; i++) {
      totalVotes += vote.votes[i];
      if (vote.votes[i] > winnerVotes)
        winner = vote.options[i];
    }

    if (totalVotes == vote.voters)
    {
      voteEnd = true;
      voteName = vote.name;
      message.channel.send('The vote \'' + vote.name + '\' has ended and the winner is ' + winner);
    }
    else {
      message.channel.send('The current stats are \n')
      var stats = '```';
      for (var i = 0; i < vote.options.length; i++)
        stats += vote.options[i] + ': ' + vote.votes[i];
      stats += '```';
      message.channel.send(stats);
    }

		if (voteEnd)
		{
			votes.splice(voteIndex, 1);
		}

		console.log(votes);
	}
});


bot.login(settings.token);


class Vote {
	constructor(vName, vVoters)
	{
		this.name = vName;
		this.options = new Array();
		this.votes = new Array();
		this.voters = new Number();
	}
}

class Player {
	constructor(pName, pID) {
		this.name = pName;
		this.id = pID;
	}
}