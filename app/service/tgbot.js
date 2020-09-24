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

    async botInit(chatId) {
        this.bot = this.bot || new TelegramBot(app.config.bot.token, {polling: false});
        this.chatId = this.chatId || chatId;
    }

    async command(commandText, messageObj) {
        if (!messageObj) messageObj = {};
        const {ctx, app} = this;
        ctx.logger.info('TgbotService.command || commandText = %j', commandText);
        let botCommandList = app.config.botCommandList;

        if (!botCommandList.hasOwnProperty(commandText)) {
            ctx.logger.info('TgbotService.command || 请求的命令不在命令白名单内！');
            return false;
        }
        if (typeof (this[commandText]) != 'function') return false;

        let token = app.config.bot.token;
        // ctx.logger.info('TgbotService.command || token = %j', token);

        this.bot = new TelegramBot(token, {polling: false});
        let chatObj = messageObj['chat'] || {"id": 117166873};
        this.chatId = chatObj['id'];
        await this[commandText](messageObj);
        return true;
    }

    async help(messageObj) {
        const {ctx, app} = this;

        let keys = Object.keys(app.config.botCommandList);
        for (let v of keys) {
            let showString = app.config.botCommandList[v];
            ctx.logger.info('TgbotService.command || showString = %j', showString);
            ctx.logger.info('TgbotService.command || v = %j', v);
        }
        this.sendMessage(this.chatId, `展示帮助列表：`);
        return true;
    }

    async start(messageObj) {
        const {ctx, app} = this;
        // ctx.logger.info('TgbotService.command || app.config = %j', app.config);

        let startMsg = app.config.botUi.startMsg || '';
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

    async sendMessage(chatId, text, parseMode) {
        const {ctx, app} = this;
        parseMode = parseMode || 'Markdown';
        this.botInit(chatId);

        // text = encodeURI(text);
        let res = await this.bot.sendMessage(this.chatId, text, {parse_mode: parseMode}).catch((error) => {
            ctx.logger.warn('TgbotService.sendMessage || sendMessage error !!');  // => 'ETELEGRAM'
            ctx.logger.warn(error.code);  // => 'ETELEGRAM'
            ctx.logger.warn(error.response.body); // => { ok: false, error_code: 400, description: 'Bad Request: chat not found' }

            return error.response.body;
        });
        ctx.logger.info('TgbotService.sendMessage || res = %j', res);
        return res;
    }

    async sendPhoto(chatId, photo) {
        const {ctx, app} = this;
        this.botInit(chatId);
        photo = encodeURI(photo);

        let res = await this.bot.sendPhoto(this.chatId, photo).catch((error) => {
            ctx.logger.warn('TgbotService.sendMessage || sendMessage error !!');  // => 'ETELEGRAM'
            ctx.logger.warn(error.code);  // => 'ETELEGRAM'
            ctx.logger.warn(error.response.body); // => { ok: false, error_code: 400, description: 'Bad Request: chat not found' }

            return error.response.body;
        });
        ctx.logger.info('TgbotService.sendMessage || res = %j', res);
        return res;

    }
}

module.exports = TgbotService;
