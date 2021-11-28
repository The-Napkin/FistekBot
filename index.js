const Discord = require("discord.js");
const { prefix, token } = require("./config.json");
const ytdl = require("ytdl-core");
const search = require('youtube-search');
const yt = require('youtube-search-without-api-key');
const { count } = require("console");

var opts = {
  maxResults: 1,
  key: 'AIzaSyDIt_D6NvgaOnRij9pHr_qlWIMWYKNKBPI'
};



const client = new Discord.Client();

const queue = new Map();

client.once("ready", () => {
  console.log("Reaady!");
});

client.once("reconnecting", () => {
  console.log("Reconnecting!");
});

client.once("disconnect", () => {
  console.log("Disconnect!");
});
client.on("message", async message => {
  if (message.author.bot) return;
  if (!message.content.startsWith(prefix)) return;

  const serverQueue = queue.get(message.guild.id);


  if  (message.content.startsWith(`${prefix}p `)) {
    execute(message, serverQueue);
    return;
  }else if  (message.content.startsWith(`${prefix}help`) || message.content.startsWith(`${prefix}h`)) {
    help(message, serverQueue);
    return;
  }else if (message.content.startsWith(`${prefix}reset`)){
    resetBot(message.channel, serverQueue);
    return;
  }
  else if (message.content.startsWith(`${prefix}skip`)) {
    skip(message, serverQueue);
    return;
  } else if (message.content.startsWith(`${prefix}fuckyou`)) {
    message.channel.send("NO, Fuck **YOU!**");
    return;
  }
  else if (message.content.startsWith(`${prefix}queue`) || message.content.startsWith(`${prefix}q`)) {
    queuels(message, serverQueue);
    return;
  }  
  else if (message.content.startsWith(`${prefix}s`)) {
    skip(message, serverQueue);
    return;
  }
  else if (message.content.startsWith(`${prefix}pause`) || message.content.startsWith(`${prefix}pss`)) {
    ps(message, serverQueue);
    return;
  }
  else if (message.content.startsWith(`${prefix}stop`)) {
    stop(message, serverQueue);
    return;
  }else if (message.content.startsWith(`${prefix}ds`) ||message.content.startsWith(`${prefix}disconnect`)) {
    stop(message, serverQueue);
    return;
  } else if (message.content.startsWith(`${prefix}resume`) || message.content.startsWith(`${prefix}r`)) {
    r(message, serverQueue);
    return;
  } else if (message.content.startsWith(`${prefix}volume`) || message.content.startsWith(`${prefix}v`)) {
    v(message, serverQueue);
    return;
  }else if (message.content.startsWith(`${prefix}pop `)) {
  pop(message, serverQueue);
  return;
  }
  else {
    message.channel.send("You need to enter a valid command!");
  }
});

async function execute(message, serverQueue) {
  const args = message.content.split("!p ");
  if (args[1] == null){
    return;
  }

  const voiceChannel = message.member.voice.channel;
  if (!voiceChannel)
    return message.channel.send(
      "You need to be in a voice channel to play music!"
    );
  const permissions = voiceChannel.permissionsFor(message.client.user);
  if (!permissions.has("CONNECT") || !permissions.has("SPEAK")) {
    return message.channel.send(
      "I need the permissions to join and speak in your voice channel!"
    );
  }

  try{
    const songInfo = await ytdl.getInfo(args[1]); 
    var song = {
        title: songInfo.videoDetails.title,
        url: songInfo.videoDetails.video_url + "&",
        pic: songInfo.videoDetails.thumbnail,
   }
    }catch{
    arraycons = message.content.split("!p ");
    arr = arraycons.toString().replace(",", "").split(" ");
    
    console.log(arr.join("-"));
    const videos = await yt.search(arr.join("-"));
    var songInfs = await ytdl.getInfo(videos[0].url);

    var song = { 
         title: songInfs.videoDetails.title,
         url: songInfs.videoDetails.video_url,
         pic: songInfs.videoDetails.thumbnails,
   }
  
  }
   if (!serverQueue) {
    const queueContruct = {
      textChannel: message.channel,
      voiceChannel: voiceChannel,
      connection: null,
      songs: [],
      volume: 10,
      playing: true
    };


   queue.set(message.guild.id, queueContruct);

   queueContruct.songs.push(song);

   try {
    var connection = await voiceChannel.join();
    queueContruct.connection = connection;
    play(message.guild, queueContruct.songs[0]);
  } catch (err) {
    console.log(err);
    queue.delete(message.guild.id);
    return message.channel.send(err);
  }
} else {
  serverQueue.songs.push(song);
  return message.channel.send(`${song.title} has been added to the queue!`);
}

    
}
function ps(message, serverQueue){
  serverQueue.connection.dispatcher.pause();
  message.channel.send("Music has been paused!");

}
function r(message, serverQueue){
  serverQueue.connection.dispatcher.resume();
  message.channel.send("Music has been resumed!");

}

function v(message, serverQueue){
  
  if(serverQueue){
    if (!message.member.voice.channel){
      message.channel.send("You have to be in voice channel!")
    }
    if(message.content.includes("!volume")){
      arraycons = message.content.split("!volume ");
      if(arraycons[1] == null){
        message.channel.send("Current music volume is: " + serverQueue.connection.dispatcher.volume*100);return;
      }
      if(arraycons[1] >= 1 && arraycons[1] <=100){
        serverQueue.connection.dispatcher.setVolume(arraycons[1]/100)
      message.channel.send("Volume chaned to: " + arraycons[1]);
      
    }
    else{
      message.channel.send("Volume has to be a number value.")
      return;
    }
    return;
    }
    if(message.content.includes("!v")){
      arraycons = message.content.split("!v ");
      if(arraycons[1] == null){
        message.channel.send("Current music volume is: " + serverQueue.connection.dispatcher.volume*100);return;
      }
      if(arraycons[1] >= 1 && arraycons[1] <=100){
        serverQueue.connection.dispatcher.setVolume(arraycons[1]/100)
      message.channel.send("Volume changed to: " + arraycons[1]);
      
    }
    else{
      message.channel.send("Volume has to be a numeric value.")
      return;
    }
    return;
    }
    
  }
  else{
  message.channel.send("There is no music playing!");return;
}}

function pop(message, serverQueue){
  arraycons = message.content.split("!pop ");
  if (!message.member.voice.channel){
    message.channel.send("You have to be in voice channel!")
  }
  if(!serverQueue){
    message.channel.send("There is nothing to pop.")
  }
  else if(arraycons[1] >= 2 && arraycons[1] <= 10){
  var ars = arraycons[1]-=1;
  if ((arraycons[1]+2)>serverQueue.songs.length){
    message.channel.send("Number has to be lower or equal to " + serverQueue.songs.length);
  }
  else{
  serverQueue.songs.splice(ars);
  message.channel.send("You have popped number " + (arraycons[1]+=1) + " from the queue.");
  }
  }
  //else if(arraycons[1]>serverQueue.songs.length){
  //  message.channel.send("Number has to be lower than " + serverQueue.songs.length);
  //}
  else if(arraycons[1] == 1){
    message.channel.send("You cannot pop currently playing song.");
  } 
  else{
    console.log("UHH")
  }

}

function queuels(message, serverQueue) {
  if (!message.member.voice.channel)
    return message.channel.send(
      "You have to be in a voice channel to view the queue!"
    );
    
  if (!serverQueue)
    return message.channel.send("The queue is empty!");

  if(serverQueue.songs.length == 1){
    let ale = "1." + serverQueue.songs[0].title;
    message.channel.send(ale);
  }
  if(serverQueue.songs.length == 2){
    let ale = "1." + serverQueue.songs[0].title;
    let ales = "2." + serverQueue.songs[1].title;
    message.channel.send(ale + "\n" + ales);
  }if(serverQueue.songs.length == 3){
    let ale = "1." + serverQueue.songs[0].title;
    let ales = "2." + serverQueue.songs[1].title;
    let aless = "3." + serverQueue.songs[2].title;
    message.channel.send(ale + "\n" + ales + "\n" + aless);
  }if(serverQueue.songs.length == 4){
    let ale = "1." + serverQueue.songs[0].title;
    let ales = "2." + serverQueue.songs[1].title;
    let aless = "3." + serverQueue.songs[2].title;
    let alesss = "4." + serverQueue.songs[3].title;
    message.channel.send(ale + "\n" + ales + "\n" + aless + "\n" + alesss);
  }if(serverQueue.songs.length == 5){
    let ale = "1." + serverQueue.songs[0].title;
    let ales = "2." + serverQueue.songs[1].title;
    let aless = "3." + serverQueue.songs[2].title;
    let alesss = "4." + serverQueue.songs[3].title;
    let alessss = "5." + serverQueue.songs[4].title;
    message.channel.send(ale + "\n" + ales + "\n" + aless + "\n" + alesss + "\n" + alessss);
  }if(serverQueue.songs.length == 6){
    let ale = "1." + serverQueue.songs[0].title;
    let ales = "2." + serverQueue.songs[1].title;
    let aless = "3." + serverQueue.songs[2].title;
    let alesss = "4." + serverQueue.songs[3].title;
    let alessss = "5." + serverQueue.songs[4].title;
    let alesssss = "6." + serverQueue.songs[5].title;
    message.channel.send(ale + "\n" + ales + "\n" + aless + "\n" + alesss + "\n" + alessss + "\n" + alesssss);
  }if(serverQueue.songs.length == 7){
    let ale = "1." + serverQueue.songs[0].title;
    let ales = "2." + serverQueue.songs[1].title;
    let aless = "3." + serverQueue.songs[2].title;
    let alesss = "4." + serverQueue.songs[3].title;
    let alessss = "5." + serverQueue.songs[4].title;
    let alesssss = "6." + serverQueue.songs[5].title;
    let alessssss = "7." + serverQueue.songs[6].title;
    message.channel.send(ale + "\n" + ales + "\n" + aless + "\n" + alesss + "\n" + alessss + "\n" + alesssss + "\n" + alessssss);
  }if(serverQueue.songs.length == 8){
    let ale = "1." + serverQueue.songs[0].title;
    let ales = "2." + serverQueue.songs[1].title;
    let aless = "3." + serverQueue.songs[2].title;
    let alesss = "4." + serverQueue.songs[3].title;
    let alessss = "5." + serverQueue.songs[4].title;
    let alesssss = "6." + serverQueue.songs[5].title;
    let alessssss = "7." + serverQueue.songs[6].title;
    let alesssssss = "8." + serverQueue.songs[7].title;
    message.channel.send(ale + "\n" + ales + "\n" + aless + "\n" + alesss + "\n" + alessss + "\n" + alesssss + "\n" + alessssss + "\n" + alesssssss);
  }
  if(serverQueue.songs.length == 9){
    let ale = "1." + serverQueue.songs[0].title;
    let ales = "2." + serverQueue.songs[1].title;
    let aless = "3." + serverQueue.songs[2].title;
    let alesss = "4." + serverQueue.songs[3].title;
    let alessss = "5." + serverQueue.songs[4].title;
    let alesssss = "6." + serverQueue.songs[5].title;
    let alessssss = "7." + serverQueue.songs[6].title;
    let alesssssss = "8." + serverQueue.songs[7].title;
    let alessssssss = "9." + serverQueue.songs[8].title;
    message.channel.send(ale + "\n" + ales + "\n" + aless + "\n" + alesss + "\n" + alessss + "\n" + alesssss + "\n" + alessssss + "\n" + alesssssss + "\n" + alessssssss);
  }if(serverQueue.songs.length >= 10){
    let ale = "1." + serverQueue.songs[0].title;
    let ales = "2." + serverQueue.songs[1].title;
    let aless = "3." + serverQueue.songs[2].title;
    let alesss = "4." + serverQueue.songs[3].title;
    let alessss = "5." + serverQueue.songs[4].title;
    let alesssss = "6." + serverQueue.songs[5].title;
    let alessssss = "7." + serverQueue.songs[6].title;
    let alesssssss = "8." + serverQueue.songs[7].title;
    let alessssssss = "9." + serverQueue.songs[8].title;
    let alesssssssss = "10." + serverQueue.songs[9].title;
    let parazit = serverQueue.songs.length - 10;
    message.channel.send(ale + "\n" + ales + "\n" + aless + "\n" + alesss + "\n" + alessss + "\n" + alesssss + "\n" + alessssss + "\n" + alesssssss + "\n" + alessssssss + "\n" +alesssssssss + "\n" + "*And " + parazit + " more song/s*");
  }
}
function help(message, serverQueue) {
  message.channel.send("**FistekBot documentation** \n **!p** - Play \n **!q/!queue** - See the queue \n **!stop** - Stops music and clears the queue \n **!reset** - When bug occures resets the bot's cache \n **!skip/!s** - Skip to next song \n **!ds/!disconnect** - Disconnects bot \n **!pause/resume** - Pauses/Resumes the music \n **!volume/!v [value]** - Changes volume \n **!pop [song number in queue]** - Removes specific song from queue")
}
function skip(message, serverQueue) {
  if (!message.member.voice.channel){
    return message.channel.send(
      "You have to be in a voice channel to skip the music!"
    );}
  if (!serverQueue){
    return message.channel.send("There is no song that I could skip!");
  }
  serverQueue.connection.dispatcher.end();
}

function stop(message, serverQueue) {
  if (!message.member.voice.channel)
    return message.channel.send(
      "You have to be in a voice channel to stop the music!"
    );

    serverQueue.songs = [];
    serverQueue.connection.dispatcher.end();
    serverQueue.voiceChannel.leave();
    queue.delete(guild.id);
}

function play(guild, song) {
  const serverQueue = queue.get(guild.id);
  if (!song) {
    setTimeout(() => {  serverQueue.voiceChannel.leave();queue.delete(guild.id);return;}, 6000000);// edit the number for how long should bot idle
  }
try{
  const dispatcher = serverQueue.connection
  
    .play(ytdl(song.url, {quality: 'highestaudio', highWaterMark: 1 << 25}))
  
    .on("finish", () => {
      serverQueue.songs.shift();
      play(guild, serverQueue.songs[0]);
    })
    .on("error", error => console.error(error));
    serverQueue.connection.dispatcher.setVolume(serverQueue.volume/100);
    serverQueue.textChannel.send(`Now is playing: **${song.title}**`);
}
catch{
  serverQueue.songs = [];
  queue.delete(guild.id);
  console.log("Caught weird stuff" + serverQueue.songs)
}
  
}
function resetBot(channel, serverQueue) {
  // send channel a message that you're resetting bot [optional]
  channel.send('Resetting...')
  setTimeout(() => { process.exit();}, 5);//end this function, restart is handled by papa.py code
  
}

client.login(token);
