/**
 * 合并成一个唯一id
 * */
export function mergeId(id1:string, id2:string) {
  const i1 = id1.replaceAll('-', '');
  const i2 = id2.replaceAll('-', '');

  if (i1 > i2) {
    return `${i1}${i2}`;
  }

  return `${i2}${i1}`;
}

export default {
  mergeId,
};
