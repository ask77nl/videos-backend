import AbstractResponseModel from './abstract-mapping-model';

export default class ProductResponseModel extends AbstractResponseModel {
  static transformMap() {
    return {
      id: 'id',
      account_id: 'accountId',
      ad_keys: 'adKeys',
      clip_source_video_id: 'clipSourceVideoId',
      complete: 'complete',
      created_at: 'creationDate',
      cue_points: 'cuePoints',
      custom_fields: 'customFields',
      delivery_type: 'deliveryType',
      description: 'description',
      digital_master_id: 'digitalMasterId',
      duration: 'length',
      economics: 'economics',
      folder_id: 'folderId',
      geo: 'geo',
      has_digital_master: 'hasDigitalMaster',
      images: 'images',
      link: 'link',
      long_description: 'longDescription',
      name: 'name',
      original_filename: 'originalFilename',
      projection: 'projection',
      published_at: 'publishedDate',
      reference_id: 'referenceId',
      schedule: 'schedule',
      sharing: 'sharing',
      state: 'state',
      tags: 'tags',
      text_tracks: 'textTracks',
      updated_at: 'lastModifiedDate',
    };
  }
  constructor(video) {
    super(video);
    this.creationDate = `${Date.parse(this.creationDate)}`;
    this.publishedDate = `${Date.parse(this.publishedDate)}`;
    this.lastModifiedDate = `${Date.parse(this.lastModifiedDate)}`;
    // NOTE: these are additional examples of normalization logic.
    // I noticed that image urls are different for those sources. Need to confirm
    // correct format with requirements
    // More logic could be added here.
    this.videoStillURL = this.images.poster.src;
    this.thumbnailURL = this.images.thumbnail.src;
  }
}
