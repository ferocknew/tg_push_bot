const http = require('http');
const request = require('request');
const https = require('https');
const fs = require('fs');
const express = require('express');
const bodyParser = require('body-parser');
const uniqid = require('uniqid');
const sqlite3 = require('sqlite3');
const util = require('util');
const config = require('./config');
const path = require('path');

const privateKey = fs.readFileSync(config.https.privateKey, 'utf8');
const certificate = fs.readFileSync(config.https.certificate, 'utf8');

const app = express();
const db = new sqlite3.Database('bot.db');

app.use(express.static('static'));

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({
    extended: false
}));

// parse application/json
app.use(bodyParser.json());

async function sendResponse(uid, text, parse_mode, reply_markup, disable_web_page_preview, photo, disable_notification, callback) {
    parse_mode = parse_mode || 'Markdown';
    disable_web_page_preview = disable_web_page_preview || false;
    disable_notification = disable_notification || false;
    let method = 'sendMessage';
    let postData = {
        chat_id: uid,
        text: text,
        parse_mode: parse_mode,
        reply_markup: reply_markup,
        disable_web_page_preview: disable_web_page_preview,
        disable_notification: disable_notification
    };
    reply_markup = reply_markup || {};
    if (photo) {
        if (photo.startsWith('https')) {
            postData.photo = photo;
            method = 'sendPhoto';
            delete postData.text;
            postData.caption = text;
        } else {
            postData.text = photo;
        }
        // postData.caption = text
    }
    console.info(`sendResponse || method = ${method}`);
    // console.info(`sendResponse || postData = ` + JSON.stringify(postData));
    request.post(config.bot.token + method, {
            json: postData
        },
        (error, response, body) => {
            if (callback) {
                if (error) callback(error);
                else {
                    console.info("request.post || response = " + JSON.stringify(response));
                    callback(response);
                }
            }
        }
    )
}

let getUserToken = function (uid) {
    console.info(`getUserToken || uid = ${uid}`);
    return new Promise((resolve, reject) => {
        db.get('SELECT * FROM users WHERE chatId = ?', [uid], (error, row) => {
            if (error) {
                reject(error)
            } else {
                resolve(row)
            }
        });
    })
};

let genUserToken = function (chatId) {
    console.info(`genUserToken || chatId = ${chatId}`);
    return new Promise((resolve, reject) => {
        let token = uniqid();
        db.run('INSERT INTO users VALUES(?, ?)', [chatId, token], error => {
            if (error) {
                reject(error)
            } else {
                resolve(token)
            }
        })
    })
};

let removeUid = function (uid) {
    return new Promise((resolve, reject) => {
        db.run('DELETE FROM users WHERE chatId = ?', [uid], error => {
            if (error) reject(error)
            else resolve()
        })
    })
};

app.post('/inlineQuery', (req, resp) => {
    console.info(`/inlineQuery || req.body = ` + JSON.stringify(req.body));
    if (req.body.message.text) {
        let uid = req.body.message.chat.id;
        switch (req.body.message.text) {
            case "/start":
                let hintText = config.ui.startHint;
                getUserToken(uid).then(row => {
                    if (row) {
                        sendResponse(uid, util.format(hintText, row.chatToken), 'Markdown', undefined, true)
                        return Promise.reject(1)
                    } else {
                        console.log('app.post(/inlineQuerynot) ||  exist', uid);
                        return genUserToken(uid)
                    }
                }).then(token => {
                    sendResponse(uid, util.format(hintText, token), 'Markdown', undefined, true)
                }).catch((error) => {
                    console.log('app.post(/inlineQuerynot) ||');
                    console.log(error);
                });
                break;
            case "/end":
                removeUid(uid).then(() => {
                    sendResponse(uid, config.ui.stopHint)
                }).catch(() => {
                    sendResponse(uid, config.ui.errorHint)
                });
                break;

        }
    }
    // if (req.body.message.text && req.body.message.text === '/start') {
    //
    // } else if (req.body.message.text && req.body.message.text === '/end') {
    //
    // }
    // resp.send('hello');
    resp.send('');
});

app.post('/sendMessage/:token', (req, resp) => {
    console.log('app.post(/sendMessage/) ||' + JSON.stringify(req.body));
    db.get('SELECT * FROM users WHERE chatToken = ?', [req.params.token], (error, row) => {
        if (!error) {
            try {
                sendResponse(row.chatId, req.body.text, req.body.parse_mode, req.body.reply_markup, req.body.disable_web_page_preview, req.body.photo, req.body.disable_notification, (res) => {
                    let respData = {
                        result: {
                            body: res.body,
                            statusCode: res.statusCode
                        }
                    };
                    resp.json(respData)
                });
            } catch (e) {
                console.log('app.post(/sendMessage/) || error !!');
                console.log(e);
            }
        } else {
            resp.json({
                result: config.ui.userNotExistHint
            })
        }
    });
    // resp.send('');
});

app.get('/test', (req, resp) => {
    let chatId = '-1001234170897';
    try {
        sendResponse(chatId, req.query.text, req.query.parse_mode, req.query.reply_markup, req.query.disable_web_page_preview, req.query.photo, req.query.disable_notification, (res) => {
            let respData = {
                result: {
                    body: res.body,
                    statusCode: res.statusCode
                }
            };
            resp.json(respData);

            // resp.send(JSON.stringify(res));
        });
    } catch (e) {
        console.log('app.get(/test/) || error !!');
        console.log(e);
        resp.send('');
    }
});

app.get('/sendMessage/:token', (req, resp) => {
    console.log('app.get(/sendMessage/) || ' + JSON.stringify(req.query));
    // console.log(req.params.token);
    db.get('SELECT * FROM users WHERE chatToken = ?', [req.params.token], (error, row) => {
        if (!error) {
            try {
                sendResponse(row.chatId, req.query.text, req.query.parse_mode, req.query.reply_markup, req.query.disable_web_page_preview, req.query.photo, req.query.disable_notification, (res) => {
                    let respData = {
                        result: {
                            body: res.body,
                            statusCode: res.statusCode
                        }
                    };
                    resp.json(respData)
                });
            } catch (e) {
                console.log('app.get(/sendMessage/) || error !!');
                console.log(e);
            }
        } else {
            resp.json({
                result: config.ui.userNotExistHint
            });
        }
    });
    resp.send('');
});

app.get('/', (req, resp) => {
    console.log(req.url);
    // console.log(req);
    resp.send(config.ui.httpsTestHint);
});

app.get('/redirectTo', (req, resp) => {
    resp.redirect(req.query.url)
});

app.get('/rulesets/smart/', (req, resp) => {
    console.log('app.get(/rulesets/smart/) || req.url = ' + req.url);
    let confFile = path.join(__dirname, 'potatso.json');
    fs.createReadStream(confFile).pipe(resp);
});

app.post('/rulesets/update/', (req, resp) => {
    resp.json({
        "status": 0,
        "data": []
    })
});

const httpsServer = https.createServer({
    key: privateKey,
    cert: certificate
}, app);

httpsServer.listen(8443, config.https.domain, () => {
    console.log('listening on port 8443')
});
