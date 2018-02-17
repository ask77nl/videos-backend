import express from 'express';
import bodyParser from 'body-parser';
import logger from './logger';

import VideosREST from './controllers/v1/videos';

const app = express();

app.use(bodyParser.json({ limit: '500kb' }));
app.use(bodyParser.urlencoded({ extended: false }));

const router = express.Router();
app.use('/', router);

const videosEndpoint = new VideosREST();

router.get('/v1/api/videos',
  videosEndpoint.controller.bind(videosEndpoint));
logger.info('Videos endpoint registered');
// catch wrong endpoints and send 404
app.use((req, res) => {
  logger.error('Attempt to access an unsupported endpoint');
  const err = 'Wrong endpont format. Use GET /v1/api/videos';
  res.status(404).send({
    message: err,
  });
});

// error handlers
app.use((err, req, res) => {
  logger.error(`Server crashed with error ${err.message}`);
  logger.error(`Server crashed with error ${err}`);
  res.status(err.status || 500).send({
    message: err.message,
  });
});

module.exports = app;
