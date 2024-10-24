import { PluginHooks } from './plugin';

export interface TreeNode {
  [x: string]: any;
  /** 对应转译后的 HTML 标签名（未来会有 Semi 组件名称），比如 div, p, img, span  */
  tag: string;
  /** 包名，如 @douyinfe/semi-ui、@douyinfe/semi-icons */
  packageName?: string;
  /** 组件是否是默认导出  */
  defaultModule?: boolean;
  /** 对应转译后的 css 样式。key-value 对应 css 属性/值 */
  style: TreeNodeStyle;
  /** 对应转译后的 HTML 属性（未来会有组件 props），比如 img 标签的 src 属性  */
  props?: Record<string, any>;
  /** 在 figma 画布上的子节点 */
  children?: TreeNode[];
  /** 节点依赖的npm组件或本地组件 */
  dependencies: Array<Dependency>;
  /** 对应节点的图层名称 */
  name: string;
  /** 对应节点的原始 figma TYPE，例如 INSTANCE、FRAME 等 @see https://www.figma.com/plugin-docs/api/nodes/  */
  type: string;
  /** 文本节点传文本内容  */
  text?: string;
  /** 图片节点传图片 URL  */
  asset?: string;
  /** node id */
  id?: string;
  /** 自定义的转码函数 */
  toTemplate?: ToTemplate;
  /** 是否是 d2c node  */
  __semi_d2c_node__?: boolean;
}

/**
 * style 内包含 Schema 的样式，包含的内容基于 Web CSS，key 的格式基于驼峰
 *
 * 注意：
 * - 属性省略时，根据 Web 规则对应属性的值，比如 display：如果 tag 是 div 是 block，span 是 inline-block
 * - 部分属性的格式是大写开头，这个是历史原因，沿用了 React 的语法
 *    - WebkitLineClamp
 *    - WebkitBoxOrient
 */
export interface TreeNodeStyle
  extends LayoutStyle,
    BoxStyle,
    TextStyle,
    FlexStyle,
    VisibilityStyle,
    TransformStyle,
    ShadowStyle,
    FilterStyle {}

interface LayoutStyle {
  display?: 'flex' | 'inline-flex' | '-webkit-box';
  position?: 'relative' | 'absolute';
  top?: number;
  right?: number;
  bottom?: number;
  left?: number;
}

interface BoxStyle {
  boxSizing?: 'content-box' | 'border-box';
  width?: number;
  height?: number;
  minWidth?: number;
  minHeight?: number;
  maxHeight?: number;
  maxWidth?: number;
  paddingTop?: number;
  paddingRight?: number;
  paddingBottom?: number;
  paddingLeft?: number;
  marginTop?: number;
  marginRight?: number;
  marginBottom?: number;
  marginLeft?: number;
  borderTopWidth?: number;
  borderRightWidth?: number;
  borderLeftWidth?: number;
  borderBottomWidth?: number;
  borderLeftColor?: string;
  borderRightColor?: string;
  borderTopColor?: string;
  borderBottomColor?: string;
  borderStyle?: 'solid' | 'dashed';
  outlineWidth?: number;
  outlineColor?: string;
  outlineStyle?: 'solid' | 'dashed';
  /** string 时，值为百分比，例如 `50%`  */
  borderTopLeftRadius?: number | string;
  /** string 时，值为百分比，例如 `50%`  */
  borderTopRightRadius?: number | string;
  /** string 时，值为百分比，例如 `50%`  */
  borderBottomLeftRadius?: number | string;
  /** string 时，值为百分比，例如 `50%`  */
  borderBottomRightRadius?: number | string;
  /**
   * 若只有 backgroundColor 会使用这个
   */
  background?: string;
  /**
   * 若有背景图或渐变色
   */
  backgroundImage?: string;
  /**
   * 同时存在背景图和背景色，背景色使用 backgroundColor
   */
  backgroundColor?: string;
  /**
   * 背景图位置
   * @example
   * ```js
   * backgroundPosition = 'center';
   * backgroundPosition = 'left top';
   * backgroundPosition = '10px 10px';
   * ```
   * @see https://developer.mozilla.org/en-US/docs/Web/CSS/background-position
   */
  backgroundPosition?: string;
  /**
   * 背景图大小
   * @example
   * ```js
   * backgroundSize = 'contain';
   * backgroundSize = '100% 120%';
   * backgroundSize = '400px 300px';
   * // 两张图片会用这个
   * backgroundSize = '90.35% 100.00%, 100.00% 99.89%';
   * ```
   * @see https://developer.mozilla.org/en-US/docs/Web/CSS/background-size
   */
  backgroundSize?: string;
  /**
   * 背景图重复模式
   * @see https://developer.mozilla.org/en-US/docs/Web/CSS/background-repeat
   */
  backgroundRepeat?: 'repeat' | 'no-repeat';
  backgroundClip?: 'text';
  WebkitBackgroundClip?: 'text';
  overflow?: string;
  overflowX?: 'visible' | 'hidden' | 'scroll' | 'auto';
  overflowY?: 'visible' | 'hidden' | 'scroll' | 'auto';
}

interface TextStyle {
  fontSize?: number;
  fontFamily?: string;
  fontWeight?: number;
  fontStyle?: 'normal' | 'italic';
  /** 无法计算出来准确的 lineHeight 时，会设置为 normal  */
  lineHeight?: number | 'normal';
  textOverflow?: 'ellipsis';
  letterSpacing?: number;
  whiteSpace?: 'normal' | 'nowrap';
  verticalAlign?: 'top' | 'middle' | 'bottom';
  textAlign?: 'left' | 'right' | 'center' | 'justify';
  textTransform?: 'UPPERCASE' | 'LOWERCASE';
  textDecoration?: 'line-through' | 'underline';
  color?: string;
  WebkitLineClamp?: number;
  WebkitBoxOrient?: 'vertical';
}

interface FlexStyle {
  flexGrow?: number;
  flexShrink?: number;
  flexBasis?: number;
  flexDirection?: 'row' | 'column';
  flexWrap?: 'nowrap' | 'wrap';
  justifyContent?: 'flex-start' | 'flex-end' | 'center' | 'space-between';
  alignItems?: 'flex-start' | 'flex-end' | 'center' | 'baseline';
  alignSelf?:
    | 'auto'
    | 'flex-start'
    | 'flex-end'
    | 'center'
    | 'baseline'
    | 'stretch';
  alignContent?:
    | 'flex-start'
    | 'flex-end'
    | 'center'
    | 'space-between'
    | 'stretch';
  columnGap?: number;
  rowGap?: number;
}

interface VisibilityStyle {
  opacity?: number;
  zIndex?: number;
}

interface TransformStyle {
  transform?: string;
}

interface ShadowStyle {
  boxShadow?: string;
}

interface FilterStyle {
  backdropFilter?: string;
  filter?: string;
}

export interface Dependency {
  componentName: string;
  packageName: string;
  defaultModule?: boolean; // 是否是默认导入，默认是 false
}

export type ToTemplate = (
  target: TreeNode,
  options: { generateTemplate: PluginHooks['generateTemplate'] }
) => string;

export type TransformMode = 'jsx+scss' | 'jsx+tailwind' | 'jsx+emotion';

export type GlobalSetting = {
  transformMode: TransformMode;
};

export type ImportsType = Record<
  string,
  Array<{ name: string; defaultModule?: boolean }>
>;

/**
 * @see https://codesandbox.io/docs/learn/sandboxes/cli-api#define-api
 */
export interface SandboxParams {
  files: Record<string, { content: string; isBinary: boolean }>;
  title?: string;
  description?: string;
  /**
   * @see https://github.com/codesandbox/codesandbox-importers/blob/master/packages/import-utils/src/create-sandbox/templates.ts
   */
  template?:
    | '@dojo/cli-create-app'
    | 'angular-cli'
    | 'create-react-app'
    | 'cxjs'
    | 'docusaurus'
    | 'parcel'
    | 'preact-cli'
    | 'reason'
    | 'static'
    | 'svelte'
    | 'vue-cli';
}

export interface D2CInspect {
  /** 提示名，如 semiComponent  */
  inspectName: string;
  /** 中文提示名 */
  inspectChineseName?: string;
  /** 提示名的解释，用于解释这个类型提示的作用  */
  inspectDescription?: string;
  /** 提示类型，如 error  */
  inspectType: 'info' | 'warning' | 'error';
  /** 提示标题，可传 node.name 或 node.name 拼接的字符串 */
  inspectTitle: string;
  /** 提示的详细内容，如不知道写什么，可以与 inspectDescription 一致 */
  inspectMessage: string;
  /**
   * 被检查的节点 id 们，id 不能为空
   * 可传单个 id，也可以传多个 id，多个 id 会被作为一次检查结果
   */
  nodeIds: string[];
  /** 检查文档  */
  docURL?: string;
  /** 示意图 */
  imgURL?: string;
  /** 是否默认展示 inspect 线框  */
  defaultVisible?: boolean;
  /** inspect 线框颜色 */
  color?: string;
}
