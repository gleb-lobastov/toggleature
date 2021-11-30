// @ts-nocheck
import omit from 'lodash/omit';

export default function omitUnchanged(object, reference) {
  return omit(
    object,
    Object.keys(reference).filter((key) => reference[key] === object[key])
  );
}
