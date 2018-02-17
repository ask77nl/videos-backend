import config from 'config';
import rp from 'request-promise';
import logger from '../../../logger';
import resultCodes from '../../search-logic/v1/result-codes';
import CMSResponseModel from '../../../models/v1/cms-response-model';

export default class CMSRequest {
  static async retrieve() {
    const options = {
      uri: `${config.get('cmsSvc.host')}${config.get('cmsSvc.path')}cms.json`,
      method: 'GET',
      json: true,
      resolveWithFullResponse: true,
      timeout: config.get('dataRequestTimeout'),
    };

    let cmsDocument;
    const startTime = new Date();
    try {
      logger.info('Sending request to CMS service');
      cmsDocument = await rp(options);
      const finishTime = new Date();
      logger.info(`Request to CMS service completed in ${(finishTime - startTime)} ms`);
    } catch (err) {
      logger.error(`Request to CMS service failed with error ${err.message}`);
      logger.debug(`Request to CMS service failed with error ${err}`);
      return Promise.resolve({
        status: resultCodes.DATA_REQUESTS_ERROR,
        message: err.message,
      });
    }
    switch (cmsDocument.statusCode) {
      case 400:
        logger.error(`CMS service doesn't accept our parameters: ${cmsDocument.body.error.message}`);
        return Promise.reject({
          status: resultCodes.DATA_REQUESTS_ERROR,
          message: cmsDocument.body.error.message,
        });
      case 200: {
        let parcedDocument;
        try {
          parcedDocument = JSON.parse(cmsDocument.body.replace(/\\/gi, ''));
        } catch (err) {
          return Promise.reject({
            status: resultCodes.DATA_REQUESTS_ERROR,
            message: 'Returned result is not in JSON format',
          });
        }
        if (parcedDocument.body.length < 1) {
          return Promise.reject({
            status: resultCodes.DATA_REQUESTS_ERROR,
            message: 'No videos returned',
          });
        }
        const cmsResponse = parcedDocument.body.map(video => new CMSResponseModel(video));
        return Promise.resolve({
          status: resultCodes.SEARCH_SUCCESSFULL,
          data: cmsResponse,
        });
      }
      default:
        logger.error(`CMS service returned unknown status code  ${cmsDocument.statusCode}`);
        return Promise.reject({
          status: resultCodes.DATA_REQUESTS_ERROR,
          message: `Unknown status code ${cmsDocument.statusCode}`,
        });
    }
  }
}

