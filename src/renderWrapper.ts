type CallBack = () => any;
type CbOrPath = any | CallBack;
interface Options {
  defaultValue?: string;
  errorCb?: (error: Error) => void;
}

const defaultOptions = {
  defaultValue: '-',
  errorCb: (error: Error) => console.error('renderWrapper error: ', error),
}

/**
 * 安全的渲染包裹方法
 * 
 * 如果你的渲染方法报错或返回值为空值则返回 defaultValue，通常用在 Antd Descriptions 组件中。
 * 
 * @example
 * // 第一种用法：直接传入要显示的变量
 * <Descriptions.Item>{renderWrapper(name)}</Descriptions.Item>
 * // 第二种用法：传入一个回调函数
 * <Descriptions.Item>{renderWrapper(() => user.name)}</Descriptions.Item>
 *
 * @param {* | function} cbOrValue - 你的渲染函数或值
 * @param {{
 *   defaultValue: string,
 *   errorCb: function
 * }} options - 配置项，可以自定义 defaultValue 或 errorCb
 */
export default function renderWrapper(cbOrValue: CbOrPath, options: Options = defaultOptions) {
  let result;
  const { defaultValue, errorCb } = options;

  try {
    if (typeof cbOrValue === 'function') {
      result = cbOrValue();
    } else {
      result = cbOrValue;
    }
  } catch (error) {
    if (typeof errorCb === 'function') {
      errorCb(error);
    }
  }

  return result ? result : defaultValue;
};