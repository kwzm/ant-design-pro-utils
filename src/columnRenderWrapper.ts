import * as React from 'react';
import lodashGet from 'lodash/get';

type Path = string;
type Callback<T> = (text: any, record: T, index: number) => React.ReactNode;
type CbOrPath<T> = Path | Callback<T>;
interface Options<T> {
  defaultValue?: string;
  errorCb?: (error: Error, text: any, record: T, index: number) => void;
}

const defaultOptions = {
  defaultValue: '-',
  errorCb: (error: Error) => console.error('Table column render 报错：', error),
}

/**
 * 安全的 Table.column.render 包裹方法
 * 
 * 使你不必在 render 里面写任何容错处理，如果 render 方法报错或返回为空值时（如 '',undefined,null,false）返回 defaultValue （默认为 -）
 * 
 * @example
 * // 第一种用法：不接受任何参数，返回 dataIndex 对应的值，如果为空值则返回 defaultValue
 * {
 *   dataIndex: 'foo',
 *   render: columnRenderWrapper(), 
 * }
 * // 第二种用法：接收一个 path，和 dataIndex 用法一致，这种方法可以不用指定 dataIndex
 * {
 *   key: 'foo',
 *   columnRenderWrapper('foo.bar'),  
 * }
 * // 第三种用法：指定渲染函数，函数接收的参数和 render 一致
 * {
 *   key: 'users',
 *   dataIndex: 'users',
 *   columnRenderWrapper(users => {
 *     // 你不需要判断 users 是否是数组类型，如果 users 类型不匹配会显示 defaultValue，或你可以指定 errorCb 自定义处理方法
 *     return users.map(user => user.name).join('、');
 *   })
 * }
 * // 以上三种用法都可以指定第二个参数 options，定义 defaultValue 或 errorCb
 * 
 * @param {function | string} cbOrPath 渲染函数或路径
 * @param {{
 *   defaultValue: string,
 *   errorCb: function,
 * }} options 配置项，可自定义 defaultValue 或 errorCb
 */
export default function columnRenderWrapper<T>(cbOrPath: CbOrPath<T>, options: Options<T> = defaultOptions) {
  return function (text: any, record: T, index: number) {
    const { defaultValue, errorCb } = options;
    let result;

    try {
      // 如果传入的是方法则执行
      if (typeof cbOrPath === 'function') {
        result = cbOrPath(text, record, index);
      }
      // 如果传入的是路径则去 record 里面根据路径获取
      if (typeof cbOrPath === 'string') {
        result = lodashGet(record, cbOrPath, defaultValue);
      }
      // 如果没有传第一个参数，就直接返回 column render 的第一个值
      if (cbOrPath === undefined) {
        result = text;
      }
    } catch (error) {
      if (typeof errorCb === 'function') {
        errorCb(error, text, record, index);
      }
    }

    return result ? result : defaultValue;
  };
};