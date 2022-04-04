import zhConvertor, { ConvertType } from 'zhconvertor';
import { convertTargetStore } from '../stores';
import { get } from 'svelte/store';
export { ConvertType } from 'zhconvertor';

export const getConvertedText = (str: string) => {
  return zhConvertor.convert(str, get(convertTargetStore));
};

export const getKeywordText = (str: string) => {
  return zhConvertor.convert(str, ConvertType.s2t) + '|' + zhConvertor.convert(str, ConvertType.t2s);
};
