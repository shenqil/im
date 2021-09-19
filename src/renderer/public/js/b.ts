import _ from 'lodash';

export function add(a: number, b: number): number {
  if (a > b) {
    return a;
  }
  return _.add(a, b);
}
export default {};
