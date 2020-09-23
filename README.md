# Telegram Push Notifications Bot Update Log
TG推送机器人更新日志

[在VPS/ECS上搭建Bot Server](SETUP.md)

### 推送消息

```
// using get
curl -X GET https://tgbot.lbyczf.com/sendMessage/:Token/?text=HelloWorld

// using post
curl -d "text=Helloworld&photo=https%3A%2F%2Fgithub.com%2FFndroid%2Ftg_push_bot%2Fblob%2Fmaster%2Fimgs%2Fphoto_2018-04-21_15-29-55.jpg%3Fraw%3Dtrue" -X POST https://tgbot.lbyczf.com/sendMessage/:Token/
```


> GET调用的URL长度会有限制，所以如果要发送图片或者发送内容较长，请使用POST

### 配置

- config/config.local.js
```javascript
exports.mysql = {
    // 单数据库信息配置
    client: {
        // host
        host: '127.0.0.1',
        // 端口号
        port: '3306',
        // 用户名
        user: '',
        // 密码
        password: '',
        // 数据库名
        database: '',
    },
    // 是否加载到 app 上，默认开启
    app: true,
    // 是否加载到 agent 上，默认关闭
    agent: false,
};

exports.bot = {
    token: "bot token",
    ui: {
        startMsg: "start 显示的信息"
    }
};
```

- 建表ddl（mysql）

```sql
CREATE TABLE `users` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `chatId` int(10) unsigned NOT NULL DEFAULT '0',
  `chatToken` varchar(255) NOT NULL DEFAULT '',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB;
```

### 字段解释

参数|类型|必须|说明
-|-|-|-
text|String|True|发送的文字内容
photo|URL String|False|发送的图片地址，支持HTTPS/HTTP
parse_mode|String|False|发送文字内容的样式，可以是Markdown或HTML
reply_markup|JSON String|False|用于控制消息底下的操作按钮
disable_web_page_preview|Boolean|False|控制是否展示链接的卡片
disable_notification|Boolean|False|控制是否发送通知

> reply_markup可以参考：[Telegram Bot API](https://core.telegram.org/bots/api#sendmessage)

> 当photo存在时，text不必须存在（即可以单独发送图片）

### 隐私相关

Bot不会识别和储存任何用户推送的消息，只会将推送消息发送给Telegram服务器。Bot只会记录用户回话ID，此ID是向Telegram推送消息的凭据。

### 更新日志

#### 2018.04.20

1. 增加POST请求支持，接受格式为``JSON``或``x-www-form-urlencoded``
2. 增加属性``parse_mode``、``reply_markup``和``disable_web_page_preview``设置，具体参考：[Telegram Bot API](https://core.telegram.org/bots/api#sendmessage)
3. 增加通过URL发送图片，字段为``photo``，参考：[Telegram Bot API](https://core.telegram.org/bots/api#sendphoto)，(如果有photo字段，则text自动理解为caption)
4. 请求改为同步返回并将对Telegram的请求响应直接回复给请求者

#### 2018.04.21

1. 支持属性``disable_notification``，可以静默发送消息，采集记录用途

#### 2018.04.22

1. 增加Chrome插件支持，可以通过插件向Telegram推送图片、链接和文字内容，具体参考：[TG推送插件](https://github.com/Fndroid/tg_notification_chrome)

#### 2018.04.24

1. 当图片地址为Http时，当作``text``处理

#### 2018.04.26

1. 给Telegram X增加一个推送非HTTP(S)链接的折中方法，将链接URL编码后链接到``https://tgbot.lbyczf.com/redirectTo?url=``后，在Telegram X打开后会重定向

#### 2018.04.27

1. 代码已经上传，可以参考[配置说明](SETUP.md)在自己的VPS/ECS上搭建Bot后台


#### 原仓库（感谢原作者）
- https://github.com/Fndroid/tg_push_bot
