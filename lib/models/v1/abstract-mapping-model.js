import dot from 'dot-object';
import _ from 'lodash';


export default class AbstractResponseModel {
  static transformMap() {
    return {};
  }
  constructor(document) {
    _.extend(this, dot.transform(this.constructor.transformMap(), document));
  }
}
