
let htmlParser = require('node-html-parser');

export function convert(str) {
    const root = htmlParser.parse(str);
    console.log(root)
    const imgs = root.querySelectorAll('img');
    imgs.forEach(img=> {
        const src = img.attrs['src']
        img.setAttribute('src', 'http://127.0.0.1:7788/ithome/data?uri=' + encodeURIComponent(src))        
        
    })
    console.log(root.toString())
    return root.toString();
}