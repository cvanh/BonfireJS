const errors = require("../utils/errors");

module.exports.run = async (bot, message, args) => {
  message.delete();
  if (!message.member.hasPermission("MANAGE_MESSAGE")) {
    errors.noPerms(message, "MANAGE_MESSAGES");
  } else {
    let bm = args.join(" ");
    message.channel.send(bm);
  }
};

module.exports.help = {
  name: "say",
};
