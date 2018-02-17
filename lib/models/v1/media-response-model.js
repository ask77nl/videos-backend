import AbstractResponseModel from './abstract-mapping-model';

export default class MediaResponseModel extends AbstractResponseModel {
  static transformMap() {
    return {
      id: 'id',
      name: 'name',
      shortDescription: 'shortDescription',
      longDescription: 'longDescription',
      creationDate: 'creationDate',
      publishedDate: 'publishedDate',
      lastModifiedDate: 'lastModifiedDate',
      linkURL: 'linkURL',
      linkText: 'linkText',
      tags: 'tags',
      videoStillURL: 'videoStillURL',
      thumbnailURL: 'thumbnailURL',
      referenceId: 'referenceId',
      length: 'length',
      playsTotal: 'playsTotal',
      playsTrailingWeek: 'playsTrailingWeek',
      customFields: 'customFields',
      FLVURL: 'FLVURL',
      HLSURL: 'HLSURL',
      renditions: 'renditions',
    };
  }
  constructor(video) {
    super(video);
    this.id = `${this.id}`;
  }
}
