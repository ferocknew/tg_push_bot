const Service = require('egg').Service;

class TgbotService extends Service {
    async command(commandText) {
        const {ctx, app} = this;
        ctx.logger.info('TgbotService.command || commandText = %j', commandText);

        console.info(typeof (this[commandText]));
        console.info(2);
        await this[commandText]();
        console.info(3);
    }

    async start() {
        const {ctx, app} = this;
        console.info(1);
        ctx.logger.info('TgbotService.start || init');

    }
}

module.exports = TgbotService;
