const Service = require('egg').Service;

class UserService extends Service {
    async find(uid) {
        // const {ctx, app} = this;
        // let res = await app.mysql.query('select count(*) from users;');
        // ctx.logger.info('UserService.find || res = %j', res);
    }
}

module.exports = UserService;
