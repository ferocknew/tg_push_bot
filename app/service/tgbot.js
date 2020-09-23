const Service = require('egg').Service;

class TgbotService extends Service {
    async command(commandText, messageObj) {
        const {ctx, app} = this;
        ctx.logger.info('TgbotService.command || commandText = %j', commandText);

        if (typeof (this[commandText]) != 'function') return false;
        await this[commandText](messageObj);
    }

    async start(messageObj) {
        const {ctx, app} = this;
        ctx.logger.info('TgbotService.start || messageObj = %j', messageObj);

    }
}

module.exports = TgbotService;
