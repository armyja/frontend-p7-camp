

const EOF = Symbol("EOF");

let stack;
let currentToken = null;
let currentAttribute = null;
let currentTextNode = null;


// https://html.spec.whatwg.org/multipage/parsing.html#data-state 

function emit(token) {
    let top = stack[stack.length - 1];
    if (token.type === "startTag") {
        let element = {
            type: "element",
            children: [],
            attributes: []
        };
        element.tagName = token.tagName;
        for (let p in token) {
            if (p !== "type" && p !== "tagName" && p !== "isSelfClosing") {
                element.attributes.push({
                    name: p,
                    value: token[p]
                });
            }
        }

        top.children.push(element);
        element.parent = top;

        if (!token.isSelfClosing) {
            stack.push(element);
        }

        if (currentTextNode !== null) {
            currentTextNode.content = currentTextNode.content.trim();
        }
        currentTextNode = null;
    } else if (token.type === "endTag") {
        if (top.tagName != token.tagName) {
            throw new Error("Tag start end doesn't match!");
        }
        else {
            /**
             * 遇到 style 标签，执行添加 CSS 规则的操作
             */
            // if (top.tagName === "style") {
            //     addCSSRules(top.children[0].content);
            // }
            // layout(top);
            stack.pop();
        }
        currentTextNode = null;
    } else if (token.type === "text") {
        if (currentTextNode === null && token.content.trim() !== "") {
            currentTextNode = {
                type: "text",
                content: ""
            }
            top.children.push(currentTextNode);
        }
        if (currentTextNode) {
            currentTextNode.content += token.content;
        }
    }
}


function data(c) {
    if (c === "<") {
        return tagOpen;
    } else if (c === EOF) {
        emit({
            type: "EOF"
        });
        return;
    } else {
        emit({
            type: "text",
            content: c
        });
        return data;
    }
}

function tagOpen(c) {
    if (c === "/") {
        return endTagOpen;
    } else if (c.match(/^[a-zA-Z]$/)) {
        currentToken = {
            type: "startTag",
            tagName: ""
        }
        return tagName(c);
    } else {
        return data;
    }
}

function endTagOpen(c) {
    if (c.match(/^[a-zA-Z]$/)) {
        currentToken = {
            type: "endTag",
            tagName: ""
        }
        return tagName(c);
    } else if (c === ">") {

    } else if (c === EOF) {

    } else {

    }
}

function tagName(c) {
    // \f: prophibit
    if (c.match(/^[\t\n\f ]$/)) {
        return beforeAttributeName;
    } else if (c === "/") {
        return selfClosingStartTag;
    } else if (c.match(/^[a-zA-Z]$/)) {
        currentToken.tagName += c;
        return tagName;
    } else if (c === ">") {
        emit(currentToken);
        return data;
    } else {
        return tagName;
    }
}

function beforeAttributeName(c) {
    if (c.match(/^[\t\n\f ]$/)) {
        return beforeAttributeName;
    } else if (c === ">" || c === "/" || c === EOF) {
        return afterAttributeName(c);
    } else if (c === "=") {

    } else {
        currentAttribute = {
            name: "",
            value: ""
        }
        return attributeName(c);
    }
}

function attributeName(c) {
    if (c.match(/^[\t\n\f ]$/) || c === "/" || c === ">" || c === EOF) {
        return afterAttributeName(c);
    } else if (c === "=") {
        return beforeAttributeValue;
    } else if (c === "\u0000") {

    } else if (c === "\"" || c === "'" || c === "<") {

    } else {
        currentAttribute.name += c;
        return attributeName;
    }
}


function beforeAttributeValue(c) {
    if (c.match(/^[\t\n\f ]$/) || c === "/" || c === ">" || c === EOF) {
        return beforeAttributeValue;
    } else if (c === "\"") {
        return doubleQuotedAttributeValue;
    } else if (c === "\'") {
        return singleQuotedAttributeValue;
    } else if (c === ">") {
        // return data;
    } else {
        return UnQuotedAttributeValue(c);
    }

}

function doubleQuotedAttributeValue(c) {
    if (c === "\"") {
        currentToken[currentAttribute.name] = currentAttribute.value;
        return afterQuoteAtrributeValue;
    } else if (c === "\u0000") {

    } else if (c === EOF) {

    } else {
        currentAttribute.value += c;
        return doubleQuotedAttributeValue;
    }
}

// ?
function UnQuotedAttributeValue(c) {
    if (c.match(/^[\t\n\f ]$/)) {
        currentToken[currentAttribute.name] = currentAttribute.value;
        return beforeAttributeName;
    } else if (c === "/") {
        currentToken[currentAttribute.name] = currentAttribute.value;
        return selfClosingStartTag;
    } else if (c === ">") {
        currentToken[currentAttribute.name] = currentAttribute.value;
        emit(currentToken);
        return data;
    } else if (c === "\u0000") {

    } else if (c === "\"" || c === "'" || c === "<" || c === "=" || c === "`") {

    } else if (c === EOF) {

    } else {
        currentAttribute.value += c;
        return UnQuotedAttributeValue;
    }
}

function selfClosingStartTag(c) {
    if (c === ">") {
        currentToken.isSelfClosing = true;
        emit(currentToken);
        return data;
    } else if (c === EOF) {

    }
}

function singleQuotedAttributeValue(c) {
    if (c === "\'") {
        currentToken[currentAttribute.name] = currentAttribute.value;
        return afterQuoteAtrributeValue;
    } else if (c === "\u0000") {

    } else if (c === EOF) {

    } else {
        currentAttribute.value += c;
        return singleQuotedAttributeValue;
    }
}

function afterQuoteAtrributeValue(c) {
    if (c.match(/^[\t\n\f ]$/)) {
        return beforeAttributeName;
    } else if (c === "/") {
        return selfClosingStartTag;
    } else if (c === ">") {
        currentToken[currentAttribute.name] = currentAttribute.value;
        emit(currentToken);
        return data;
    } else if (c === EOF) {

    } else {
        return beforeAttributeName(c)
    }
}

function afterAttributeName(c) {
    if (c.match(/^[\t\n\f ]$/)) {
        return afterAttributeName;
    } else if (c === "/") {
        return selfClosingStartTag;
    } else if (c === "=") {
        return beforeAttributeValue;
    } else if (c === ">") {
        currentAttribute[currentAttribute.name] = currentAttribute.value;
        emit(currentToken);
        return data;
    } else if (c === EOF) {

    } else {
        currentToken[currentAttribute.name] = currentAttribute.value;
        currentAttribute = {
            name: "",
            value: ""
        }
        return attributeName(c);
    }
}

export function parseHTML(html) {
    stack = [{ type: "document", children: [] }];
    currentToken = null;
    currentAttribute = null;
    currentTextNode = null;
    let state = data;
    for (let c of html) {
        state = state(c);
    }
    state = state(EOF);
    return stack[0];
}