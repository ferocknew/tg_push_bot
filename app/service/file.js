const Service = require('egg').Service;
const _ = require('lodash');
const fs = require('fs');
const path = require('path');

class FileService extends Service {
    constructor(ctx) {
        super(ctx);
    }

    /**
     * 获取列表
     */
    async getList(pathValue) {
        const {ctx, app} = this;
        let config = app.confg;
        ctx.logger.info('FileService.getList || config= %j', config);

    }

}

module.exports = FileService;
