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
        pathValue = path.join(app.config.ipfsConfig.rootDir, pathValue);
        let filePath = path.join(app.config.baseDir, pathValue);
        ctx.logger.info('FileService.getList || filePath= %j', filePath);

        let res = fs.readdirSync(filePath);
        ctx.logger.info('FileService.getList || res= %j', res);
    }

}

module.exports = FileService;
