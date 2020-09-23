const Service = require('egg').Service;

class TgbotService extends Service {
    async command(commandText) {
        const {ctx, app} = this;
        ctx.logger.info('TgbotService.command || commandText = %j', commandText);
        await this[commandText]();
    }

    async start() {
        const {ctx, app} = this;
        ctx.logger.info('TgbotService.start || init');
    }
}

module.exports = TgbotService;
