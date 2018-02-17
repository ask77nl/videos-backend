import _ from 'lodash';
import logger from '../../../logger';
import CMSRequest from '../../data-requests/v1/cms-request';
import MediaRequest from '../../data-requests/v1/media-request';
import resultCodes from './result-codes';

/**
 * Main Video Search logic class. It supposed to be called via execute()
 * Takes user parameter sorted. If the value is true, the resulted list is sorted by updated date
 * Returns a combined list of videos from CMS and Media APIs
 *
 * The workflow steps:
 * 1.Call CMS Service to get a list of videos
 * 2.Call Media Service to get a list of videos
 * 3.Merge the list together
 * 4.Sort it if required and return the result
  */
export default class Videos {
  /**
   * The constructor instantates all data requests and mappers for this particular call
   * We use it to inject mock dependencies during unit tests
   */
  constructor() {
    this.CMSRequest = CMSRequest;
    this.MediaRequest = MediaRequest;
  }

  async execute(searchInfo) {
    logger.debug('executing with params ', searchInfo);
    let finalList;

    // Retrieve list of videos from CMS service
    let cmsList;
    try {
      cmsList = await this.CMSRequest.retrieve();
    } catch (err) {
      return Promise.reject(err);
    }
    finalList = _.map(cmsList.data, _.clone);

    // Retrieve list of videos from Media service
    let mediaList;
    try {
      mediaList = await this.MediaRequest.retrieve();
    } catch (err) {
      return Promise.reject(err);
    }

    // Combine and sort the result
    finalList = _.union(finalList, mediaList.data);
    if (searchInfo.sorted) {
      finalList = _.sortBy(finalList, 'lastModifiedDate');
    }

    return Promise.resolve({
      status: resultCodes.SEARCH_SUCCESSFULL,
      data: finalList,
    });
  }
}
