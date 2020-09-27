'use strict'
const Service = require('egg').Service;

class PiwigoService extends Service {
    constructor(ctx) {
        super(ctx);
    }

    async uploadImg(filePath) {
        const {ctx, app} = this;
        ctx.logger.info('PiwigoService.uploadImg || filePath = %j', filePath);

        return true;
    }
}

module.exports = PiwigoService;
