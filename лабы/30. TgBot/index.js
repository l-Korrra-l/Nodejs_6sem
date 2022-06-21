const TeleBot = require('node-telegram-bot-api');
const Token = '5343109536:AAG9DJrNUXZ1GCnl0paKQrDqueQwRGu1jUQ';

const bot = new TeleBot(Token, {  polling: true });

bot.on('message', (msg) => {
    console.log(msg);
    bot.sendMessage(msg.chat.id, `echo: ${msg.text}`);
});
