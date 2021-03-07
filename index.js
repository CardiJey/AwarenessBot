const Discord = require("discord.js");
const config = require("./config.json");

const client = new Discord.Client();

const prefix = "!";
var awarenessTextChannels = [];
var awarenessVoiceChannels = [];
var awarenessDestination = "none";

client.on("voiceStateUpdate", (oldState, newState) => {
	for(var i = 0; i < awarenessVoiceChannels.length; i++){
		var thisVoiceChannel = client.channels.cache.get(awarenessVoiceChannels[i]);
		
		if(thisVoiceChannel){
			if(thisVoiceChannel.members.size >= thisVoiceChannel.userLimit && thisVoiceChannel.userLimit > 0){
				thisVoiceChannel.updateOverwrite(thisVoiceChannel.guild.roles.everyone, { VIEW_CHANNEL: false });
			}else{
				thisVoiceChannel.updateOverwrite(thisVoiceChannel.guild.roles.everyone, { VIEW_CHANNEL: true });
			}
		}
	}
});
	
	
client.on("message", function(message) {
  if (message.author.bot) return;
  
  const commandBody = message.content.slice(prefix.length);
  const args = commandBody.split(' ');
  const command = args.shift().toLowerCase();
  
  if (message.content.startsWith(prefix) && message.member.hasPermission("ADMINISTRATOR")){
	  switch(command){
		  case "setawarenessgoal" :
		  case "setawarenessdestination" :
		  case "setawarenessteamchannel" :
			awarenessDestination = message.channel.id;
			message.reply("Awareness messages will now arrive here!");
		  break;

		  case "addawarenesschannel" :
		  case "addawareness" :
		  case "addawachannel" :
		  case "addawa" :
			if(awarenessDestination == "none"){
				message.reply("Please set an awareness destination channel first!");
			}else{
				if(awarenessTextChannels.indexOf(message.channel.id) == -1){
					awarenessTextChannels.push(message.channel.id);
					message.reply("This Channel is now an Awareness Channel!");
				}else{
					message.reply("This Channel is already an Awareness Channel!");
				}
			}
		  break;
		  
		  case "removeawarenesschannel" :
		  case "removeawareness" :
		  case "removeawachannel" :
		  case "removeawa" :
			if(awarenessTextChannels.indexOf(message.channel.id) == -1){
				message.reply("This Channel is not an Awareness Channel!");
			}else{
				awarenessTextChannels.splice(awarenessTextChannels.indexOf(message.channel.id),1);
				message.reply("This Channel is not an Awareness Channel anymore!");
			}
		  break;
		  
		  case "resetawarenesschannels" :
			awarenessTextChannels = [];
			message.reply("All Awareness Channels have been reset!");
		  break;
		  
		  case "resetawarenessvoicechannels" :
			for(var i = 0; i < awarenessVoiceChannels.length; i++){
				var awaVoiceChannel = client.channels.cache.get(awarenessVoiceChannels[i]);
				
				awaVoiceChannel.updateOverwrite(awaVoiceChannel.guild.roles.everyone, { VIEW_CHANNEL: true });
			}
			
			awarenessVoiceChannels = [];
			message.reply("All Awareness Voice Channels have been reset!");
		  break;
		  
		  case "removeawarenessvoicechannel" :
		  case "removeawarenessvoice" :
		  case "removeawavoicechannel" :
		  case "removeawavoice" :
			var awaVoiceChannel = message.member.voice.channel;
			
			if (!awaVoiceChannel) {
				return message.reply('Please join a voice channel, that should not be an Awareness Voice Channel anymore!');
			}
			
			if(awarenessVoiceChannels.indexOf(awaVoiceChannel.id) == -1){
				message.reply("This Channel is not an Awareness Channel!");
			}else{
				awaVoiceChannel.updateOverwrite(awaVoiceChannel.guild.roles.everyone, { VIEW_CHANNEL: true });
				awarenessVoiceChannels.splice(awarenessVoiceChannels.indexOf(awaVoiceChannel.id),1);
				message.reply("This Channel is not an Awareness Channel anymore!");
			}
		  break;
		  
		  case "addawarenessvoicechannel" :
		  case "addawarenessvoice" :
		  case "addawavoicechannel" :
		  case "addawavoice" :
			var awaVoiceChannel = message.member.voice.channel;
			
			if (!awaVoiceChannel) {
				return message.reply('Please join a voice channel, that should become an Awareness Voice Channel!');
			}
		  
			if(awarenessVoiceChannels.indexOf(awaVoiceChannel.id) == -1){
				awarenessVoiceChannels.push(awaVoiceChannel.id);
				message.reply(awaVoiceChannel.name + " is now an Awareness Voice Channel!");
			}else{
				message.reply("This Voice Channel is already an Awareness Channel!");
			}
		  break;
		  
		  default:
			message.reply("Unknown command!");
		  break;
	  }
  }else{
	  if (awarenessTextChannels.indexOf(message.channel.id) != -1) {
		const channel = client.channels.cache.get(awarenessDestination);
		channel.send(message.author.username + " wrote in " + message.channel.name + ": " + message.content);
		message.delete();
	  }
  }
  
  
});

client.login(config.BOT_TOKEN);