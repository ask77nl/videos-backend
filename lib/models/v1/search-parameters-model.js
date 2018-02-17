import AbstractResponseModel from './abstract-mapping-model';

export default class SearchParametersModel extends AbstractResponseModel {
  static transformMap() {
    return {
      'query.sorted': 'sorted',
    };
  }
}
