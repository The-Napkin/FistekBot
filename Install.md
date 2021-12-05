#On windows 7+
git clone https://github.com/The-Napkin/FistekBot.git
install node.js from https://nodejs.org/ 
install python3 from python.org
open cmd(if you have set global variable for node)/node.js console
npm install discord.js@^12.5.3 ffmpeg fluent-ffmpeg @discordjs/opus ytdl-core --save (Older version of discord.js, less features but essentials are here, doesnt work with newer discord.js)
npm install youtube-search-without-api-key
npm install opusscript
npm install node-opus
edit your config.json file under token paste your discord bot token from discord.com/developers and edit your guild id to your server
download https://www.gyan.dev/ffmpeg/builds/ and paste near your index.js
change your path in papa.py python file to path where you have index.js
node index.js
//Bot should be working now.


#In Linux (100% working on Ubuntu, edit commands for your distro)
sudo apt-get update
git clone https://github.com/The-Napkin/FistekBot.git
sudo apt-get install node.js
sudo apt-get install npm 
sudo apt-get install python3
sudo npm install discord.js@^12.5.3 ffmpeg fluent-ffmpeg @discordjs/opus ytdl-core --save (Older version of discord.js, less features but essentials are here, doesnt work with newer discord.js)
npm install youtube-search-without-api-key
sudo npm install opusscript
sudo npm install node-opus
sudo nano config.json (edit your guild id, edit your token to your bot token, discord.com/developers)
sudo nano papa.py (change to your bot directory)
sudo node index.js
//Bot should be working now
