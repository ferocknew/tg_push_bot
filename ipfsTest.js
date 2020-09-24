'use strict'
const pathString = `/Users/fuyingjun/Downloads/_tmp/1/`;

const ipfsClient = require('ipfs-http-client');
const ipfs = ipfsClient('/ip4/127.0.0.1/tcp/5001');

// const IPFS = require('ipfs');
const {globSource} = ipfsClient;
const files = [{
    path: pathString,
    content: 'ABC'
}];

(async function () {
    // for await (const result of ipfs.add(files)) {
    //     console.log(result)
    // }
    const file = await ipfs.add(globSource(pathString, {recursive: true}));
    console.log(file);
})();

