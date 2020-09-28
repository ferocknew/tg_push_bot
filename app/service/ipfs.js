'use strict'
const Service = require('egg').Service;

const _ = require('lodash');
const fs = require('fs');
const path = require('path');
const ipfsClient = require('ipfs-http-client');
const uniqid = require('uniqid');
const {globSource} = ipfsClient;

class IpfsService extends Service {
    constructor(ctx) {
        super(ctx);
        this.retryNum = 10;
        this.retryTimeout = 1500;
        this.saveToCheveretoTimeout = 30000;
        this.ipfs = null;
    }

    async saveUrl(url) {
        const {ctx, app} = this;
        let returnUrl = "ok";

        let extname = path.extname(url);
        let fileName = uniqid();
        let saveDirPath = `/tmp/${fileName}_1`;
        let saveFilePath = `${saveDirPath}/${fileName}${extname}`;

        if (!fs.existsSync(saveDirPath)) fs.mkdirSync(saveDirPath);

        const result = await app.curl(url);
        let fileData = result.data;
        let hash = '';
        try {
            fs.writeFileSync(saveFilePath, fileData);
            ctx.logger.info('IpfsService.saveUrl || 文件写入成功 saveFilePath = %j', saveFilePath);
            // let linkString = app.config.ipfsConfig.linkString;
            let linkObj = app.config.ipfsConfig.linkObj;
            // ctx.logger.info('IpfsService.saveUrl || linkString = %j', linkString);
            ctx.logger.info('IpfsService.saveUrl || linkObj = %j', linkObj);

            this.ipfs = ipfsClient(linkObj);
            const file = await this.ipfs.add(globSource(saveDirPath, {recursive: true}));
            hash = file.cid.toString();
            ctx.logger.info('IpfsService.saveUrl || ipfs 添加成功 cid = %j', hash);
        } catch (e) {
            ctx.logger.warn('IpfsService.saveUrl || e = %j', e);
        }
        let ipfsUrl = app.config.ipfsUrl;
        let urlObj = ipfsUrl[_.random(0, ipfsUrl.length - 1)];
        let httpTop = urlObj['httpTop'];
        // ctx.logger.info('IpfsService.saveUrl || urlObj = %j', urlObj);
        let uri = `/ipfs/${hash}/${fileName}${extname}`;
        returnUrl = `${httpTop}${uri}`;
        try {
            // this.saveToCheveretoAPI(uri);
            // ctx.service.piwigo.uploadImg(saveFilePath);
            ctx.service.piwigo.uploadImgFromUrl(returnUrl);

        } catch (e) {
            ctx.logger.warn('IpfsService.saveUrl || e = %j', e);
        }

        return returnUrl;
    }

    async saveToCheveretoAPI(uri) {
        const {ctx, app} = this;
        let cheveretoConfig = app.config.chevereto;
        if (!cheveretoConfig.flag) return false;

        let host = cheveretoConfig.host;
        let apiKey = cheveretoConfig.apiKey;
        let ownHost = cheveretoConfig.ownHost;
        let apiSaveURL = `${host}/api/1/upload/?key=${apiKey}&source=${ownHost}${uri}&format=json`;

        let retryFlag = true;
        for (var i = 0; i < this.retryNum; i++) {
            try {
                ctx.logger.info('IpfsService.saveToCheveretoAPI || saveToChevereto 请求地址, apiSaveURL = %j', apiSaveURL);

                const result = await app.curl(apiSaveURL, {
                    dataType: 'json',
                    timeout: this.saveToCheveretoTimeout
                });
                let jsonData = result.data;
                if (jsonData.success) {
                    let msg = jsonData.success.message;
                    ctx.logger.info('IpfsService.saveToCheveretoAPI || saveToChevereto success, msg = %j', msg);
                } else {
                    ctx.logger.info('IpfsService.saveToCheveretoAPI || jsonData = %j', jsonData);
                    // retryFlag false;
                }
                retryFlag = false;
            } catch (e) {
                ctx.logger.warn('IpfsService.saveToCheveretoAPI || e = %j', e);
                retryFlag = true;
            }
            if (retryFlag == false) {
                break;
            } else {
                ctx.logger.info('IpfsService.saveToCheveretoAPI || 请求失败需要重试！, this.retryTimeout = %j', this.retryTimeout);
                ctx.logger.info('IpfsService.saveToCheveretoAPI || 请求失败需要重试！重试次数 i = %j', i);
                await this.sleep(this.retryTimeout);
            }
        }
    }

    async sleep(time) {
        return new Promise(function (resolve, reject) {
            setTimeout(function () {
                resolve()
            }, time)
        })
    }
}

module.exports = IpfsService;
