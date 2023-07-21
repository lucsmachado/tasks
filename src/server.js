import http from 'node:http';

import { routes } from './routes.js';
import json from "./middleware/json.js"

const server = http.createServer(async (req, res) => {
  const { method, url } = req;

  const route = routes.find(route => route.method === method && route.path.test(url))

  if (route) {
    await json(req, res);

    const routeParams = req.url.match(route.path)
    req.params = { ...routeParams.groups }

    route.handler(req, res);
  } else {
    res.writeHead(404).end();
  }
});

server.listen(3333)

