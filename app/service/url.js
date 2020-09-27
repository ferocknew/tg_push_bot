'use strict'
const Service = require('egg').Service;

class UrlService extends Service {
    constructor(ctx) {
        super(ctx);
    }

    async main(url, messageObj) {
        const {ctx, app} = this;
        ctx.logger.info('UrlService.main || url = %j', url);
    }
}

module.exports = UrlService;
