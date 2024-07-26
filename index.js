// index.js
const { Telegraf } = require('telegraf');
const { Connection, PublicKey, clusterApiUrl } = require('@solana/web3.js');
const TradingBot = require('./tradingBot');

// Initialize the Telegram bot with your token
const bot = new Telegraf('7215576316:AAGnyDBRVdWHFiElUK_qF_gdimEpOJGfSEk');

// Solana setup: Connecting to the Solana blockchain
const connection = new Connection(clusterApiUrl('mainnet-beta'));

// Initialize the trading bot
const tradingBot = new TradingBot();

// Function to get Solana balance
const getSolanaBalance = async (address) => {
  const balance = await connection.getBalance(address);
  return balance / 1e9; // Convert from lamports to SOL (1 SOL = 1e9 lamports)
};

// Define the /start command
bot.start((ctx) => {
  ctx.reply(`Hello, ${ctx.from.first_name}! 👋

Welcome to the Solana Telegram Bot. Here are the functionalities available:

1. **Balance**: Check the balance of your Solana wallet. Use /balance <WALLET_ADDRESS> to get your wallet balance.
2. **Borrow**: This feature is coming soon! Stay tuned for updates.
3. **Lend**: This feature is coming soon! Stay tuned for updates.
4. **Swap**: Swap tokens on the Solana network. Use /swap <AMOUNT> <SOURCE_TOKEN> <DESTINATION_TOKEN> to initiate a swap.
5. **Exit**: Use this option to end the interaction.

To get started, use /menu to see these options.`);
});

// Define the /menu command
bot.command('menu', (ctx) => {
  ctx.reply('Choose an option:', {
    reply_markup: {
      inline_keyboard: [
        [{ text: 'Balance', callback_data: 'balance' }],
        [{ text: 'Borrow', callback_data: 'borrow' }],
        [{ text: 'Lend', callback_data: 'lend' }],
        [{ text: 'Swap', callback_data: 'swap' }],
        [{ text: 'Exit', callback_data: 'exit' }],
      ],
    },
  });
});

// Handle actions for custom menu options
bot.action('balance', async (ctx) => {
  ctx.reply('Please provide your Solana wallet address to check the balance. Usage: /balance <WALLET_ADDRESS>');
  bot.on('text', async (ctx) => {
    const walletAddress = ctx.message.text;
    try {
      const address = new PublicKey(walletAddress);
      const balance = await getSolanaBalance(address);
      ctx.reply(`The balance of wallet ${walletAddress} is: ${balance} SOL`);
    } catch (error) {
      ctx.reply('Invalid Solana wallet address. Please try again.');
    }
  });
});

bot.action('borrow', (ctx) => {
  ctx.reply('This feature is coming soon. Stay tuned for updates!');
});

bot.action('lend', (ctx) => {
  ctx.reply('This feature is coming soon. Stay tuned for updates!');
});

bot.action('swap', (ctx) => {
  ctx.reply('To swap tokens, please specify the amount, source token, and destination token. Example usage: /swap <AMOUNT> <SOURCE_TOKEN> <DESTINATION_TOKEN>');
  bot.on('text', async (ctx) => {
    const [amount, sourceToken, destinationToken] = ctx.message.text.split(' ');
    // Implement your swapping functionality here
    ctx.reply(`Swapping ${amount} ${sourceToken} for ${destinationToken}. This is a placeholder response.`);
  });
});

bot.action('exit', (ctx) => {
  ctx.reply('Thank you! Use /menu to navigate back.');
});

// Start the bot
bot.launch();

// Enable graceful stop for the bot
process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));

