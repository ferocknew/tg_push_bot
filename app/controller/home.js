const Controller = require('egg').Controller;

class HomeController extends Controller {
    async index() {
        let userId = 11;
        const user = await ctx.service.user.find(userId);
        this.ctx.body = 'Hello world';
    }
}

module.exports = HomeController;
