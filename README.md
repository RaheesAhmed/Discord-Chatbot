
## Discord Chatbot with OpenAI GPT-3
This is a Discord bot that uses OpenAI's GPT-3 to interact with users in a Discord server. The bot listens to messages in a specific channel and responds using GPT-3 and also store the conversation in a log.txt file.

### Requirements
```
Node.js
npm
Discord.js library
OpenAI library
Environment Variables
```
Create a .env file in your project root and add the following:
```
DISCORD_TOKEN=your_discord_bot_token
OPENAI_API_KEY=your_openai_api_key
CHANNEL_ID=your_channel_id
```
### Installation
Clone the repository
```
git clone https://github.com/RaheesAhmed/Discord-Chatbot.git
```
Go to the Directory:
```
cd Discord-Chatbot
```

Run npm install to install dependencies
```
npm install openai dotenv discord.js
```

### Run node index.js to start the bot
```
node index.js
```

## Code Explanation

#### Importing Dependencies
```
require("dotenv/config");
const { Client, IntentsBitField } = require("discord.js");
const { OpenAI } = require("openai");
const fs = require("fs");

```
```
`dotenv/config`: Loads environment variables from a .env file
`discord.js`: Discord.js library for interacting with Discord API
`openai`: OpenAI library for interacting with OpenAI API
`fs`: Node.js built-in file system module
```
#### Initializing Discord Client
```
const client = new Client({
  intents: [
    IntentsBitField.Flags.Guilds,
    IntentsBitField.Flags.GuildMessages,
    IntentsBitField.Flags.MessageContent,
  ],
});
```
Initializes the Discord client with specific intents.

#### Bot Ready Event
```
client.on("ready", () => {
  console.log("The bot is online!");
});
```
Logs a message when the bot is online.

#### OpenAI Initialization
```
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});
```
Initializes the OpenAI API with the API key.

Message Handling and OpenAI API Call
The bot listens for messages, filters out messages from bots, and those that don't meet certain conditions. It then sends the conversation history to the OpenAI API and receives a generated message as a response.

#### Logging
```
const logFilePath = 'log.txt';
const formattedLogEntry = `User: ${logEntry.user}\nQuestion: ${logEntry.question}\nAnswer: ${logEntry.response}\n\n`;
fs.appendFileSync(logFilePath, formattedLogEntry);
```
Logs the conversation to a local text file.

#### Sending the Response
```
await message.reply(chunk);
```
Sends the generated message back to the Discord channel.

























