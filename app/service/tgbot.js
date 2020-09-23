'use strict'
const TelegramBot = require('node-telegram-bot-api');
const Service = require('egg').Service;
const uniqid = require('uniqid');

class TgbotService extends Service {
    constructor(ctx) {
        super(ctx);
        this.chatId = null;
        // 如果需要在构造函数做一些处理，一定要有这句话，才能保证后面 `this.ctx`的使用。
        // 就可以直接通过 this.ctx 获取 ctx 了
        // 还可以直接通过 this.app 获取 app 了

        this.bot = null;
    }

    async command(commandText, messageObj) {
        if (!messageObj) messageObj = {};
        const {ctx, app} = this;
        ctx.logger.info('TgbotService.command || commandText = %j', commandText);

        if (typeof (this[commandText]) != 'function') return false;

        let token = app.config.bot.token;
        // ctx.logger.info('TgbotService.command || token = %j', token);

        this.bot = new TelegramBot(token, {polling: false});
        let chatObj = messageObj['chat'] || {"id": 117166873};
        this.chatId = chatObj['id'];
        await this[commandText](messageObj);
        return true;
    }

    async start(messageObj) {
        const {ctx, app} = this;

        let startMsg = app.config.bot.ui.startMsg || '';
        let chatId = this.chatId;
        let res = await app.mysql.get("users", {chatId});
        let chatToken = '';
        // ctx.logger.info('TgbotService.start || res = %j', res);
        if (!res) {
            // 新建聊天关系
            chatToken = uniqid();
            const result = await this.app.mysql.insert('users', {chatId, chatToken});
        } else {
            chatToken = res['chatToken'];
        }
        this.sendMessage(this.chatId, `${startMsg} ${chatToken}`);
        return true;
    }

    async getChatId(chatToken) {
        let chatId = null;
        const {ctx, app} = this;
        let res = await app.mysql.get("users", {chatToken});
        if (res) chatId = res['chatId'];

        return chatId;
    }

    async sendMessage(chatId, text) {
        const {ctx, app} = this;

        chatId = this.chatId || chatId;
        let bot = this.bot || new TelegramBot(app.config.bot.token, {polling: false});

        this.bot.sendMessage(chatId, text);
        return true;
    }
}

module.exports = TgbotService;
