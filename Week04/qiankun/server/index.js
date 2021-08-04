let http = require('http');
let https = require('https');
let xmlParser = require('fast-xml-parser');
let htmlParser = require('node-html-parser');

const { URLSearchParams } = require('url');

http.createServer(function (req, res) {
    if (req.url.match(/^\/ithome\/rss/)) {
        return ithomeRss(req, res);
    }
    if (req.url.match(/^\/data\?/)) {
        return getData(req, res);
    }
    if (req.url.match(/^\/article\?/)) {
        return getArticle(req, res);
    }
}).listen(8099);

function ithomeRss(request, response) {
    response.setHeader("Content-type", 'text/plain; charset=utf-8');
    let req = https.get('https://www.ithome.com/rss',
        function (res) {
            let body = "";
            res.on('data', chunk => {
                body += (chunk.toString());
            })
            res.on('end', chunk => {
                let jsonObj = xmlParser.parse(body);
                response.write(unescape(JSON.stringify(jsonObj['rss']['channel']['item'])));
                response.end();
            })
        });
    req.end();
}

function getData(request, response) {
    let params = new URLSearchParams(request.url.match(/^\/data\?([\s\S]+)$/)[1]);
    let html = params.get('uri');
    let req = https.get(decodeURIComponent(html),
        function (res) {
            res.on('data', chunk => {
                response.write(chunk)
            })
            res.on('end', chunk => {
                response.end();
            })
        });
    req.end();
}

function getArticle(request, response) {
    response.setHeader("Content-type", 'text/plain; charset=utf-8');
    let params = new URLSearchParams(request.url.match(/^\/article\?([\s\S]+)$/)[1]);
    let html = params.get('html');
    let req = https.get(decodeURIComponent(html),
        function (res) {
            let body = "";
            res.on('data', chunk => {
                body += (chunk.toString());
            })
            res.on('end', chunk => {
                let article = getArticleJSONString(body);
                response.write(article)
                response.end();
            })
        });
    req.end();
}

function getArticleJSONString(html) {
    const root = htmlParser.parse(html)
    root.querySelector('.fl .content')
    root.querySelector('.fl .content')
    let title = root.querySelector('.fl.content h1').innerHTML;
    let article = root.querySelector('#paragraph');
    let imgs = root.querySelector('#paragraph img');
    root.querySelectorAll('#paragraph img').forEach(el=>el.attrs['src'] = el.attrs['data-original']) 
    return JSON.stringify({title, content: root.querySelector('#paragraph').innerHTML.trim()})
}

function unescape(str) {
    return str.replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&amp;/g, "&").replace(/&quot;/g, '"').replace(/&apos;/g, "'");
}