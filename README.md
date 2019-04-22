# D&D Bot

## Commands
All of these must be prefixed with value contained inside the const
  * roll - roll any number between x and 0
  * list - list common things
    * polls
    * players
    * initiatives
  * setname - set a players character name
  * setinitiative - set a players initiative
  * spoll - start a poll
  * dmpoll - start a vote to set the dm
  * vote - vote on a polls

## Extra info
Players can set their own info, but once a DM is voted on and chosen through dmpoll he can edit their info by using the same set commands along with a mention.
Example
(prefix)setinitiative 10 @player_name



## Classes
### Player
	* id (int)
	* name (String)
	* initiative (int)

### Poll
	* name (String)
	* voters (Array)
	* options (Array)
	* votes (Array)
