const ms = require("ms");

module.exports.run = async (bot, message, args) => {
  let reminder = args.join(" ").slice(3);
  let remindTime = args[0];

  if (ms(remindTime)) {
    message.channel.send(
      `I will remind you about **${reminder}** in **${remindTime}**`
    );

    setTimeout(() => {
      message.author.send(
        `You asked me to remind you about **${reminder}** **${remindTime}** ago.`
      );
    }, ms(remindTime));
  }
};

module.exports.help = {
  name: "remind",
};
