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

bot.login(process.env.TOKEN);
