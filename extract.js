const fs = require('fs');

const html = fs.readFileSync('index.html', 'utf8');

const styleTags = html.match(/<style[^>]*>([\s\S]*?)<\/style>/gi) || [];
const styles = styleTags.map(tag => tag.replace(/<\/?style[^>]*>/gi, '')).join('\n\n');
fs.writeFileSync('client/src/index.css', styles);

let bodyMatch = html.match(/<body[^>]*>([\s\S]*?)<\/body>/i);
if (bodyMatch) {
    let body = bodyMatch[1];
    const scriptTags = body.match(/<script[^>]*>([\s\S]*?)<\/script>/gi) || [];
    const scripts = scriptTags.map(tag => tag.replace(/<\/?script[^>]*>/gi, '')).join('\n\n');
    fs.writeFileSync('client/src/extracted-scripts.js', scripts);

    body = body.replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '');
    fs.writeFileSync('client/src/extracted-body.html', body);
} else {
    console.log("No body found");
}

console.log("Extraction complete.");
