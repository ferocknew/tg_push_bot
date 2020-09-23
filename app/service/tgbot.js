'use strict'
const TelegramBot = require('node-telegram-bot-api');
const Service = require('egg').Service;

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
        const {ctx, app} = this;
        ctx.logger.info('TgbotService.command || commandText = %j', commandText);

        if (typeof (this[commandText]) != 'function') return false;

        let token = app.config.bot.token;
        ctx.logger.info('TgbotService.command || token = %j', token);

        this.bot = new TelegramBot(token, {polling: true});
        this.chatId = messageObj['chat']['id'];
        await this[commandText](messageObj);
    }

    async start(messageObj) {
        const {ctx, app} = this;

        let chatId = this.chatId;
        let res = await app.mysql.get("users", {chatId});
        if (res) {
            // 新建
        }
        ctx.logger.info('TgbotService.start || res = %j', res);

    }
}

module.exports = TgbotService;
