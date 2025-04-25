const { Client, GatewayIntentBits } = require("discord.js");
const { DisTube } = require("distube");
const { YtDlpPlugin } = require("@distube/yt-dlp");

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildVoiceStates,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

const distube = new DisTube(client, {
  plugins: [new YtDlpPlugin()],
  leaveOnStop: false,
  emitNewSongOnly: true,
});

client.once("ready", () => {
  console.log(`✅ Bot siap sebagai ${client.user.tag}`);
});

client.on("messageCreate", async (message) => {
  if (!message.content.startsWith("!")) return;

  const args = message.content.slice(1).trim().split(/ +/);
  const command = args.shift().toLowerCase();

  if (command === "play") {
    if (!message.member.voice.channel)
      return message.reply("❌ Kamu harus join voice channel dulu.");
    distube.play(message.member.voice.channel, args.join(" "), {
      textChannel: message.channel,
      member: message.member,
    });
  }

  if (command === "stop") {
    distube.stop(message);
    message.channel.send("⏹️ Musik dihentikan.");
  }

  if (command === "skip") {
    distube.skip(message);
    message.channel.send("⏭️ Musik di-skip.");
  }
});

client.login("YOUR_BOT_TOKEN"); // Ganti dengan token bot kamu
