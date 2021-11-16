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

  //if (message.content.startsWith(`${prefix}pause`) || message.content.startsWith(`${prefix}ps`)) {
    //ps(message, serverQueue);
    //return;
  //}else 
  if  (message.content.startsWith(`${prefix}p`)) {
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
  else if (message.content.startsWith(`${prefix}stop`)) {
    stop(message, serverQueue);
    return;
  }else if (message.content.startsWith(`${prefix}ds`)) {
    stop(message, serverQueue);
    return;
  } //else if (message.content.startsWith(`${prefix}resume`) || message.content.startsWith(`${prefix}r`)) {
    //r(message, serverQueue);
    //return;
  //}
  else {
    message.channel.send("You need to enter a valid command!");
  }
});

async function execute(message, serverQueue) {
  const args = message.content.split("!p ");

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
    //console.log(args[1]);
    const songInfo = await ytdl.getInfo(args[1]); 
    var song = {
        title: songInfo.videoDetails.title,
        url: songInfo.videoDetails.video_url + "&",
   }
    }catch{
    arraycons = message.content.split("!p ");
    arr = arraycons.toString().replace(",", "").split(" ");
    //search(arraycons, opts, async function(err, result){
    console.log(arr.join("-"));
    const videos = await yt.search(arr.join("-"));
    //console.log(videos);
    var songInfs = await ytdl.getInfo(videos[0].url);
    //console.log(err)
    //console.log(result[0].link);
    //console,console.log("a");
   // console.log(result.link)
   // console.log("e")
   // var objResults = JSON.parse(result);
   // console.log(objResults);
    //var url = `https://www.youtube.com/watch?v=${result.id.videoId}`;
   // var arr = arraycons.toString().replace(",", "");
    //const video = await yts( { videoId: '_4Vt0UGwmgQ' } )
    //console.log( video.title + ` (${ video.video_url })` )


  // console.log(result);
    //var strr = result.toString()
   // var uf = strr.get("link:")
    //console.log(url)
    var song = { 
         title: songInfs.videoDetails.title,
         url: songInfs.videoDetails.video_url,
   }
  }
   if (!serverQueue) {
    const queueContruct = {
      textChannel: message.channel,
      voiceChannel: voiceChannel,
      connection: null,
      songs: [],
      volume: 5,
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
  //);}
  //const songInfo = await ytdl.getInfo(args[1,2,3,4,5,6,7,8,9]);
  //console.log(args[1]);
  //search(args[1],opts, async function(results){console.log(results);});
  //console.log(results);
  //var songInfs = await ytdl.getInfo(results);
  //console.log(songInfs.videoDetails.video_url);

    
}
function ps(message, serverQueue){
  serverQueue.connection.dispatcher.pause();console.log(serverQueue.connection.dispatcher.paused + "1");
  setTimeout(() => serverQueue.connection.dispatcher.unpause(), 5_000);;console.log(serverQueue.connection.dispatcher.paused + "2");

}
function r(message, serverQueue){
  console.log(serverQueue.connection.dispatcher.paused + "3");
  serverQueue.connection.dispatcher.resume();
  serverQueue.connection.dispatcher.play();
  console.log(serverQueue.connection.dispatcher.paused + "4");
  //serverQueue.connection.dispatcher.setVolumeLogarithmic(10)

}
//Add uf level, basically an count of blocks called uflevel and message 

function queuels(message, serverQueue) {
  //var countminten = serverQueue.songs.length;
 // var counts = countminten - 10;
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

 // var ale = serverQueue.songs[0].title;
 // var ug = JSON.stringify(ale);
 // const json = JSON.parse(ug);
 // var x = json.title;
  //console.log(ale);
 // var uh = ug.replace('[{"title":"', ' ');
  //var ut = uh.replace('"url":"', ' ');
  //var un = ut.replace('"{"title":"', ' ');
 // var up = un.replace('"}]', ' ');
 // var trt = up.replace('"url":"', ' ');
 // var srd = trt.replace(",{", "")
 // var prd = trt.split("", trt)
 // console.log(trt)
 // message.channel.send(serverQueue.songs.length + "/n" + "<br>");//Watch out
  //message.channel.send(String(ug) + "<br>");
}
function help(message, serverQueue) {
  message.channel.send("**FistekBot documentation** \n **!p** - Play \n **!q/!queue** - See the queue \n **!ds/!stop** - End playing music \n **!reset** - When bug occures resets the bot's cache \n **!skip/!s** - Skip to next song")
}
function skip(message, serverQueue) {
  if (!message.member.voice.channel)
    return message.channel.send(
      "You have to be in a voice channel to skip the music!"
    );
  if (!serverQueue)
    return message.channel.send("There is no song that I could skip!");
  serverQueue.connection.dispatcher.end();
}

function stop(message, serverQueue) {
  if (!message.member.voice.channel)
    return message.channel.send(
      "You have to be in a voice channel to stop the music!"
    );
    
  if (!serverQueue)
    return message.channel.send("There is no song that I could stop!");
    
  
  else
    serverQueue.songs = [];
    serverQueue.connection.dispatcher.end();
    serverQueue.voiceChannel.leave();
    queue.delete(guild.id);
}

function play(guild, song) {
  const serverQueue = queue.get(guild.id);
  if (!song) {
    setTimeout(() => {  serverQueue.voiceChannel.leave();}, 1800000);
   // serverQueue.voiceChannel.leave();
    queue.delete(guild.id);
    return;
  }

  const dispatcher = serverQueue.connection
    .play(ytdl(song.url, { filter: 'audioonly', quality: 'lowestaudio' }))
    .on("finish", () => {
      serverQueue.songs.shift();
      play(guild, serverQueue.songs[0]);
    })
    .on("error", error => console.error(error));
  dispatcher.setVolumeLogarithmic(serverQueue.volume / 5);
  serverQueue.textChannel.send(`Now is playing: **${song.title}**`);
}
function resetBot(channel, serverQueue) {
  // send channel a message that you're resetting bot [optional]
  channel.send('Resetting...')
  setTimeout(() => { process.exit();}, 10000);
  
  //setTimeout(() => {  process.exit()}, 10000);
}

client.login(token);
