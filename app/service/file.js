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
        // ctx.logger.info('FileService.getList || res= %j', res);

        let returnData = [];
        let returnObj = {};
        returnObj['name'] = '';
        returnObj['lastModifiedDateTime'] = '';
        returnObj['size'] = '';
        returnObj['fileType'] = '';
        returnObj['extname'] = '';
        returnObj['folder'] = true;

        for (let item of res) {
            let fsInfo = fs.statSync(path.join(filePath, item));
            let fileFlag = fsInfo.isFile();
            ctx.logger.info('FileService.getList || fsInfo= %j', fsInfo);
            ctx.logger.info('FileService.getList || fileFlag= %j', fileFlag);
            returnObj['name'] = item;
            returnObj['lastModifiedDateTime'] = moment(fsInfo['mtime'], "YYYY-MM-DD HH:mm:ss");
            returnObj['size'] = fsInfo.size;
            if (fileFlag) returnObj['folder'] = false;
            returnObj['extname'] = path.extname(item);

            ctx.logger.info('FileService.getList || returnObj= %j', returnObj);
            returnData.push(returnObj);
        }

        return returnData;
    }

    async getFileType(fileName) {
        /*
        function file_ico($item){
  $ext = strtolower(pathinfo($item['name'], PATHINFO_EXTENSION));
  if(in_array($ext,['bmp','jpg','jpeg','png','gif','webp'])){
  	return "image";
  }
  if(in_array($ext,['mp4','mkv','webm','avi','mpg', 'mpeg', 'rm', 'rmvb', 'mov', 'wmv', 'mkv', 'asf', 'flv', 'm3u8'])){
  	return "ondemand_video";
  }
  if(in_array($ext,['ogg','mp3','wav','flac','aac','m4a','ape'])){
  	return "audiotrack";
  }
  return "insert_drive_file";
}
         */
    }

}

module.exports = FileService;
