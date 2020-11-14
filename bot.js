const Discord = require("discord.js");
const fs = require("fs");
const bot = new Discord.Client();
const botconfig = require("./botconfig.json");
bot.commands = new Discord.Collection();
require("dotenv").config();
const mysql = require("mysql");
const con = mysql.createConnection(process.env.JAWSDB_URL);
let prefix = botconfig.prefix;

con.connect((e) => {
  if (e) console.error(e);
  console.log("Connected to database ^^");
});
fs.readdir("./commands", (err, files) => {
  if (err) console.error(err);
  let jsfile = files.filter((f) => f.split(".").pop() === "js");
  if (jsfile.length <= 0) {
    console.log("No commands");
    return;
  }

  jsfile.forEach((f, i) => {
    let props = require(`./commands/${f}`);
    console.log(`${f} loaded`);
    bot.commands.set(props.help.name, props);
  });
});

bot.on("ready", async () => {
  console.log(`${bot.user.username} is online on ${bot.guilds.size} servers`);

  bot.user.setActivity("with marshmallow's", {
    type: "PLAYING",
  });
});

// Basic setup
bot.on("message", async (message) => {
  if (message.author.bot) return;
  if (message.channel.type === "dm") return;
  let prefixes = JSON.parse(fs.readFileSync("./prefixes.json", "utf8"));
  if (!prefixes[message.guild.id]) {
    prefixes[message.guild.id] = {
      prefixes: botconfig.prefix,
    };
  }
  let prefix = prefixes[message.guild.id].prefixes;
  if (!message.content.startsWith(prefix)) return;

  let messageArray = message.content.split(" ");
  let cmd = messageArray[0];
  let args = messageArray.slice(1);

  let commandfile = bot.commands.get(cmd.slice(prefix.length));
  if (commandfile) commandfile.run(bot, message, args);
});

//Add Channels
bot.on("guildCreate", async (guild) => {
  if (!guild.channels.exists("name", "bonfire")) {
    $: category = await guild.createChannel("bonfire", {
      type: "category",
      permissionOverwrites: [
        {
          id: guild.id,
          deny: [
            "SEND_MESSAGES",
            "SEND_TTS_MESSAGES",
            "MANAGE_MESSAGES",
            "ATTACH_FILES",
            "ADD_REACTIONS",
            "VIEW_CHANNEL",
          ],
        },
      ],
    });
  }
  if (!guild.channels.exists("name", "🏕️")) {
    $: channel = await guild.createChannel("🏕️", {
      type: "text",
      permissionOverwrites: [
        {
          id: guild.id,
          deny: [
            "SEND_MESSAGES",
            "SEND_TTS_MESSAGES",
            "MANAGE_MESSAGES",
            "ATTACH_FILES",
            "ADD_REACTIONS",
          ],
        },
      ],
    });
  }

  await channel.setParent(category);

  await channel.lockPermissions();

  await channel.sendMessage(
    `hello! thank you so much for adding me to your server. In this channel my developer will post status updated and other important things. if you find any bugs don't be afraid to report them through the github repository (https://github.com/app-bonfire/BonfireJS/issues) or by adding my developer (gio#1234). stay cozy. This channel is only visible for administratos ^-^`
  );
});

bot.login(process.env.TOKEN);
