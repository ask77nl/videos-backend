import logger from '../../logger';
import resultCodes from '../../services/search-logic/v1/result-codes';
import Videos from '../../services/search-logic/v1/search-videos';
import SearchParametersModel from '../../models/v1/search-parameters-model';

export default class VideosREST {
  constructor() {
    this.SearchLogic = Videos;
  }

  controller(req, res) {
    const startTime = new Date();
    logger.info('Received search request');
    const searchParametersModel = new SearchParametersModel(req);
    const search = new this.SearchLogic();

    let status;
    let payload;
    search.execute(searchParametersModel)
      .then((result) => {
        switch (result.status) {
          case resultCodes.DATA_REQUESTS_ERROR:
            logger.error(`Data requests error: ${result.message}`);
            status = 500;
            payload = {
              error: 'Internal data requests error',
              message: result.message,
            };
            break;
          case resultCodes.PARAMETERS_ERROR:
            logger.error(`Parameters error: ${result.message}`);
            status = 400;
            payload = {
              error: 'Parameters error',
              message: result.message,
            };
            break;
          case resultCodes.SEARCH_SUCCESSFULL:
            status = 200;
            payload = result.data;
            break;
          default:
            logger.error(`Unknown error core returned from search logic: ${result.status}`);
            status = 500;
            payload = {
              error: 'Unknown code returned from search logic',
              message: result.status,
            };
            break;
        }

        const finishTime = new Date();
        logger.info(`Video Search completed sucessfully in ${(finishTime - startTime)} ms`);
        res.status(status).send(payload);
      })
      .catch((err) => {
        const finishTime = new Date();
        logger.debug(`Video Search failed in ${(finishTime - startTime)} ms: ${err}`);
        res.status(500).send({
          persons: [],
          error: 'Internal Problem executing Video Search',
          message: err.message,
        });
      });
  }
}
