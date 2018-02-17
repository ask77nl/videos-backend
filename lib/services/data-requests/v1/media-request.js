import config from 'config';
import rp from 'request-promise';
import logger from '../../../logger';
import resultCodes from '../../search-logic/v1/result-codes';
import MediaResponseModel from '../../../models/v1/media-response-model';

export default class MediaRequest {
  static async retrieve() {
    const options = {
      uri: `${config.get('cmsSvc.host')}${config.get('cmsSvc.path')}mediaApi.json`,
      method: 'GET',
      json: true,
      resolveWithFullResponse: true,
      timeout: config.get('dataRequestTimeout'),
    };

    let mediaDocument;
    const startTime = new Date();
    try {
      logger.info('Sending request to Media service');
      mediaDocument = await rp(options);
      const finishTime = new Date();
      logger.info(`Request to Media service completed in ${(finishTime - startTime)} ms`);
    } catch (err) {
      logger.error(`Request to Media service failed with error ${err.message}`);
      logger.debug(`Request to Media service failed with error ${err}`);
      return Promise.resolve({
        status: resultCodes.DATA_REQUESTS_ERROR,
        message: err.message,
      });
    }
    switch (mediaDocument.statusCode) {
      case 400:
        logger.error(`Media service doesn't accept our parameters: ${mediaDocument.body.error.message}`);
        return Promise.reject({
          status: resultCodes.DATA_REQUESTS_ERROR,
          message: mediaDocument.body.error.message,
        });
      case 200: {
        let parcedDocument;
        try {
          // TODO the incoming data is not exactly in a valid JSON format
          // due to special characters in ids,
          // need to review later
          parcedDocument = JSON.parse(mediaDocument.body.replace(/\\"/gi, '"').replace(/\\"/gi, '"'));
        } catch (err) {
          return Promise.reject({
            status: resultCodes.DATA_REQUESTS_ERROR,
            message: 'Returned result is not in JSON format',
          });
        }
        if (parcedDocument.items.length < 1) {
          return Promise.reject({
            status: resultCodes.DATA_REQUESTS_ERROR,
            message: 'No videos returned',
          });
        }
        const cmsResponse = parcedDocument.items.map(video => new MediaResponseModel(video));
        return Promise.resolve({
          status: resultCodes.SEARCH_SUCCESSFULL,
          data: cmsResponse,
        });
      }
      default:
        logger.error(`Media service returned unknown status code  ${mediaDocument.statusCode}`);
        return Promise.reject({
          status: resultCodes.DATA_REQUESTS_ERROR,
          message: `Unknown status code ${mediaDocument.statusCode}`,
        });
    }
  }
}

