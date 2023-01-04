const http = require ('http');
const host = 'testserver';
const port = 3000;
const log = require('fs');

const server = http.createServer((request, response) => {
    const url = request.url;
    const method = request.method;

    // add log for visit in log file
    log.appendFileSync('visitors.txt', `ip: ${request.socket.remoteAddress}, port: ${request.socket.remotePort}, state: ${request.socket.readyState}, http version: ${request.httpVersionMajor}, url: ${request.url} \n`);
    
    // display form for user input at root route
    if (url === '/') {
        response.write('<html>');
        response.write('<head><title>Enter Message</title><head>');
        response.write('<body><form action="/message" method="POST"><input type="text" name="message"><button type="submit">Send</button></form></body>');
        response.write('</html>');
        return response.end();
    }

    // check if route is /message
    if (method === 'POST' && url === '/message') {
        const content = [];

        // push chunk of data stream into array
        request.on('data', (chunk) => {
            content.push(chunk);
        });

        // upon end of the stream parse content into string
        request.on('end', () => {
            const parsedContent = Buffer.concat(content).toString().split('=')[1].split('+').join(' ');;
            console.log(parsedContent);

            // log input form in messages file
            log.appendFileSync('messages.txt', `ip: ${request.socket.remoteAddress}, message: ${parsedContent} \n`);

        });

        // set header location to root route
        response.setHeader('Location', '/')

        return response.end();     
    }
});

server.listen(port);
