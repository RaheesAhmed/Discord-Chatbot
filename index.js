require("dotenv/config");
const { Client, IntentsBitField } = require("discord.js");
const { OpenAI } = require("openai");
const fs = require("fs");

const client = new Client({
  intents: [
    IntentsBitField.Flags.Guilds,
    IntentsBitField.Flags.GuildMessages,
    IntentsBitField.Flags.MessageContent,
  ],
});

client.on("ready", () => {
  console.log("The bot is online!");
});

const IGNORE_PREFUX = "!";
const CHANNELS = process.env.CHANNEL_ID;

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

client.on("messageCreate", async (message) => {
  console.log(message.content);
  if (message.author.bot) return;
  if (message.channel.id !== process.env.CHANNEL_ID) return;
  if (message.content.startsWith(IGNORE_PREFUX)) return;
  if (
    !CHANNELS.includes(message.CHANNEL_ID) &&
    message.mentions.users.has(client.user.id)
  )
    return;

  // Logging the question and response
  const logEntry = {
    user: `${message.author.username} (${message.author.id})`,
    question: message.content,
    response: "",
  };

  await message.channel.sendTyping();
  const sendTypingInteravl = setInterval(() => {
    message.CHANNELS.sendTyping();
  }, 5000);

  let conversation = [];
  conversation.push({
    role: "system",
    content: "Friendly Chatbot",
  });

  let prevMessages = await message.channel.messages.fetch({ limit: 10 });
  prevMessages.reverse();

  prevMessages.forEach((msg) => {
    if (msg.author.bot && msg.author.id !== client.user.id) return;
    if (msg.content.startsWith(IGNORE_PREFUX)) return;
    const username = msg.author.username.replace(/[^\w\s]/gi, "");
    if (msg.author.id == client.user.id) {
      conversation.push({
        role: "assistant",
        content: msg.content,
      });
      return;
    }
    conversation.push({
      role: "user",
      content: msg.content,
    });
  });

  const response = await openai.chat.completions
    .create({
      model: "gpt-3.5-turbo",
      messages: conversation,
    })
    .catch((error) => console.error("OPENAI ERROR:\n", error));

  clearInterval(sendTypingInteravl);
  if (!response) {
    message.reply(
      "I'm having trouble with the OpenaAI. Try again in a moment."
    );
    return;
  }

  const responseMessage = response.choices[0].message.content;
  logEntry.response = responseMessage;

  // Log the entry to a local file
  const logFilePath = 'log.txt';
  const formattedLogEntry = `User: ${logEntry.user}\nQuestion: ${logEntry.question}\nAnswer: ${logEntry.response}\n\n`;
  fs.appendFileSync(logFilePath, formattedLogEntry);

  const chunkSizeLimit = 2000;
  for (let i = 0; i < responseMessage.length; i += chunkSizeLimit) {
    const chunk = responseMessage.substring(i, i + chunkSizeLimit);
    await message.reply(chunk);
  }
});

client.login(process.env.DISCORD_TOKEN);
