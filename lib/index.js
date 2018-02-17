#!/usr/bin/env node
/**
 * Module dependencies.
 */

import http from 'http';
import config from 'config';
import logger from './logger';
import app from './app';

/**
 * Normalize a port into a number, string, or false.
 */

function normalizePort(val) {
  const pt = parseInt(val, 10);

  if (isNaN(pt)) {
    // named pipe
    return val;
  }

  if (pt >= 0) {
    // port number
    return pt;
  }

  return false;
}


/**
 * Get port from environment and store in Express.
 */

const port = normalizePort(config.get('port') || '4100');
app.set('port', port);

/**
 * Create HTTP server.
 */

const server = http.createServer(app);

/**
 * Event listener for HTTP server 'error' event.
 */

function onError(error) {
  if (error.syscall !== 'listen') {
    throw error;
  }

  const bind = typeof port === 'string'
    ? `Pipe ${port}`
    : `Port ${port}`;

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case 'EACCES':
      logger.error(`${bind} requires elevated privileges`);
      process.exit(1);
      break;
    case 'EADDRINUSE':
      logger.error(`${bind} is already in use`);
      process.exit(1);
      break;
    default:
      throw error;
  }
}

/**
 * Event listener for HTTP server 'listening' event.
 */

function onListening() {
  const addr = server.address();
  const bind = typeof addr === 'string'
    ? `'pipe ${addr}`
    : `port ${addr.port}`;
  logger.debug(`Service is listening on ${bind}`);
}

/**
 * Listen on provided port, on all network interfaces.
 */

server.listen(port);
server.on('error', onError);
server.on('listening', onListening);

