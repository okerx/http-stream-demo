import { createServer } from 'node:http';
import fs from 'node:fs';
import path from 'node:path';

const PORT = parseInt(process.env.PORT || '3000', 10);
const HOST = process.env.HOST || '0.0.0.0';

const publicPath = path.resolve('public');
const getPublicFile = (url: string) => path.join(publicPath, url);

const server = createServer((req, res) => {
  if (req.url === '/') {
    res.writeHead(200, { 'Content-Type': 'text/html' });
    const stream = fs.createReadStream(getPublicFile('index.html'));
    return stream.pipe(res);
  }

  if (req.url === '/story') {
    res.writeHead(200, { 'Content-Type': 'text/plain; charset=utf-8' });
    const stream = fs.createReadStream(getPublicFile('story.txt'));
    return stream.on('readable', () => {
      const interval = setInterval(() => {
        const chunk = stream.read(1);
        if (chunk !== null) {
          res.write(chunk);
        } else {
          clearInterval(interval);
          res.end();
        }
      }, 2);
    });
  }

  res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
  res.end('Not Found');
});

server.listen(PORT, HOST, () => {
  console.log(`Server listening on http://${HOST}:${PORT}`);
});
