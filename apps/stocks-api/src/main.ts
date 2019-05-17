/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 **/
import { Server } from 'hapi';
import { environment } from './environments/environment';
var https = require('https');

const init = async () => {
  const server = new Server({
    port: 3333,
    host: 'localhost',
    routes: { cors: true } 
  });

  const data = async (symbol, period) => {
    let data="";

    return new Promise(function(resolve, reject) {
      https.get(`${environment.apiURL}/beta/stock/${symbol}/chart/${period}?token=${environment.apiKey}`, 
      function(response) {
      response
      .on("data",append=>data+=append)
      .on("end",()=>resolve(JSON.parse(data)))
      .on("error", (err) => {
        reject(err);
      });
    });
    })
  };
  server.method('getData', data, {
    cache: {
      expiresIn: 10 * 1000,
      generateTimeout: 2000
    }
  });

  server.route({
    method: 'GET',
    path: '/',
    handler: (request, h) => {
      return {
        hello: 'world'
      };
    }
  });

  server.route({
    method: 'GET',
    path: '/api/stock/{symbol}/chart/{period}',
    handler:  async(request, h) => {
      return await server.methods.getData(request.params.symbol, request.params.period);
    }
  });
  
  await server.start();
  console.log('Server running on %s', server.info.uri);
};

process.on('unhandledRejection', err => {
  console.log(err);
  process.exit(1);
});

init();
