const path = require('path');
module.exports = {
    security: {
        csrf: {
            enable: false,
        },
    },
    botUi: {
        startMsg: "用户信息已登记，你的推送链接Token 为："
    },
    botCommandList: {
        start: "用户开始机器人对话！",
        help: "帮助列表",
        ipfsOpen: "打开当前会话的 ipfs 保存功能。"
    },
    ipfs: {
        address: "/ip4/127.0.0.1/tcp/5001"
    }
};

