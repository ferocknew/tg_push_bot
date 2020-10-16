const Service = require('egg').Service;
const _ = require('lodash');
const fs = require('fs');
const moment = require('moment');
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
        let ipfsUrl = app.config.ipfsUrl;
        // ctx.logger.info('FileService.getList || res= %j', res);

        let returnData = [];
        for (let item of res) {
            let fileBasePath = path.join(filePath, item);
            let fsInfo = fs.statSync(fileBasePath);
            let fileFlag = fsInfo.isFile();
            ctx.logger.info('FileService.getList || fsInfo= %j', fsInfo);
            let ipfsInfo = '';
            let ipfsFlag = false;
            if (path.extname(item) == ".ipfs") ipfsFlag = true;


            let returnObj = {};
            returnObj['name'] = item.replace(".ipfs", "");
            returnObj['lastModifiedDateTime'] = moment(fsInfo['mtime']).format("YYYY-MM-DD HH:mm:ss");
            returnObj['size'] = this.renderSize(fsInfo.size);
            returnObj['folder'] = (fileFlag) ? false : true;
            returnObj['extname'] = path.extname(returnObj['name']).toLowerCase();
            returnObj['ico'] = await this.getFileType(returnObj['extname']);
            returnObj['isImage'] = (returnObj['ico'] == 'image') ? true : false;
            returnObj['href'] = '#';

            if (ipfsFlag) {
                ipfsInfo = fs.readFileSync(fileBasePath, 'utf8');
                try {
                    ipfsInfo = JSON.parse(ipfsInfo);
                } catch (e) {
                    ipfsInfo = {};
                }
                let ipfsType = ipfsInfo['type'];
                let cid = ipfsInfo['cid'];
                let indexInfo = ipfsInfo['index'];
                ctx.logger.info('FileService.getList || ipfsInfo= %j', ipfsInfo);


                let urlObj = ipfsUrl[_.random(0, ipfsUrl.length - 1)];
                let httpTop = urlObj['httpTop'];

                switch (ipfsType) {
                    case "directory":
                        returnObj['href'] = `${httpTop}/ipfs/${cid}/${indexInfo}`;
                        break;
                }
            }

            ctx.logger.info('FileService.getList || returnObj= %j', returnObj);
            returnData.push(returnObj);
        }

        ctx.logger.info('FileService.getList || returnData= %j', returnData);
        return returnData;
    }

    async getFileType(extname) {
        extname = extname.replace(".", "");
        let imgArray = ['bmp', 'jpg', 'jpeg', 'png', 'gif', 'webp'];
        let videoArray = ['mp4', 'mkv', 'webm', 'avi', 'mpg', 'mpeg', 'rm', 'rmvb', 'mov', 'wmv', 'mkv', 'asf', 'flv', 'm3u8'];
        let muiscArray = ['ogg', 'mp3', 'wav', 'flac', 'aac', 'm4a', 'ape'];

        let returnStr = "";
        switch (true) {
            case (imgArray.indexOf(extname) != -1):
                returnStr = "image";
                break;
            case (videoArray.indexOf(extname) != -1):
                returnStr = "ondemand_video";
                break;
            case (muiscArray.indexOf(extname) != -1):
                returnStr = "audiotrack";
                break;
            default:
                returnStr = "insert_drive_file";
                break
        }

        return returnStr;
    }

    async renderSize(filesize) {
        if (null == value || value == '') {
            return "0 Bytes";
        }
        var unitArr = new Array("Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB");
        var index = 0;
        var srcsize = parseFloat(value);
        index = Math.floor(Math.log(srcsize) / Math.log(1024));
        var size = srcsize / Math.pow(1024, index);
        size = size.toFixed(2);//保留的小数位数
        return size + unitArr[index];
    }

}

module.exports = FileService;
