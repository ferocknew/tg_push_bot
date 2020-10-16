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
        for (let item of res) {
            let fsInfo = fs.statSync(path.join(filePath, item));
            let fileFlag = fsInfo.isFile();
            ctx.logger.info('FileService.getList || fsInfo= %j', fsInfo);
            ctx.logger.info('FileService.getList || fileFlag= %j', fileFlag);
            let returnObj = {};
            returnObj['name'] = item.replace(".ipfs", "");
            returnObj['lastModifiedDateTime'] = moment(fsInfo['mtime']).format("YYYY-MM-DD HH:mm:ss");
            returnObj['size'] = fsInfo.size;
            returnObj['folder'] = (fileFlag) ? false : true;
            returnObj['extname'] = path.extname(returnObj['name']).toLowerCase();
            returnObj['ico'] = await this.getFileType(returnObj['extname']);

            returnData.push(returnObj);
        }

        ctx.logger.info('FileService.getList || returnData= %j', returnData);
        return returnData;
    }

    async getFileType(extname) {
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
        // if (imgArray.indexOf(extname) != -1) return "image";

        /*
        function file_ico($item){
  $ext = strtolower(pathinfo($item['name'], PATHINFO_EXTENSION));
  if(in_array($ext,)){
  	return "image";
  }
  if(in_array($ext,)){
  	return "ondemand_video";
  }
  if(in_array($ext,)){
  	return "audiotrack";
  }
  return "insert_drive_file";
}
         */
    }

}

module.exports = FileService;
