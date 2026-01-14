import {
  Node as YogaNode,
  Align,
  Justify,
  Wrap,
  FlexDirection,
  PositionType,
  Edge,
} from 'yoga-layout';
import { flatten } from '../utils';

function funcName(key: string) {
  return `set${key[0].toUpperCase()}${key.substr(1)}`;
}

type StyleParams = [string, any?, any?];

function checkAndRun(yoga: any, key: string, ...values: any[]) {
  if (yoga[key]) {
    yoga[key](...values);
  } else {
    throw new Error(`Revas: No Such Style Func - ${key}`);
  }
}

function parseValue(func: string, value: string | number): StyleParams {
  if (typeof value === 'number') {
    return [func, value];
  } else if (value === 'auto') {
    return [`${func}Auto`];
  } else if (value.endsWith('%')) {
    return [`${func}Percent`, Number(value.slice(0, -1))];
  } else {
    throw new Error(`Revas: No Such Style Value - ${value}`);
  }
}

function parseEnum(func: string, enums: any, value: string): StyleParams {
  if (enums[value] !== undefined) {
    return [func, enums[value]];
  } else {
    throw new Error(`Revas: No Such Style Value - ${value}`);
  }
}

function parseEdge(
  func: string,
  edge: number,
  value: string | number
): StyleParams {
  if (typeof value === 'number') {
    return [func, edge, value];
  } else if (value === 'auto') {
    return [`${func}Auto`, edge];
  } else if (value.endsWith('%')) {
    return [`${func}Percent`, edge, Number(value.slice(0, -1))];
  } else {
    throw new Error(`Revas: No Such Style Value - ${value}`);
  }
}

const ALIGN_ENUM = {
  auto: Align.Auto,
  baseline: Align.Baseline,
  center: Align.Center,
  'flex-end': Align.FlexEnd,
  'flex-start': Align.FlexStart,
  'space-around': Align.SpaceAround,
  'space-between': Align.SpaceBetween,
  stretch: Align.Stretch,
};

const STYLE_MAP: { [key: string]: (value: any) => StyleParams } = {};

// Initialize style map (synchronous in Yoga 3.x)
const AVAILABLE = {
  VALUE: [
    'flex',
    'width',
    'height',
    'minWidth',
    'maxWidth',
    'minHeight',
    'maxHeight',
    'flexGrow',
    'flexShrink',
    'aspectRatio',
  ],
  ENUM: [
    {
      key: 'justifyContent',
      enum: {
        center: Justify.Center,
        'flex-end': Justify.FlexEnd,
        'flex-start': Justify.FlexStart,
        'space-around': Justify.SpaceAround,
        'space-between': Justify.SpaceBetween,
        'space-evenly': Justify.SpaceEvenly,
      },
    },
    { key: 'alignItems', enum: ALIGN_ENUM },
    { key: 'alignSelf', enum: ALIGN_ENUM },
    { key: 'alignContent', enum: ALIGN_ENUM },
    {
      key: 'flexWrap',
      enum: {
        'no-wrap': Wrap.NoWrap,
        wrap: Wrap.Wrap,
        'wrap-reverse': Wrap.WrapReverse,
      },
    },
    {
      key: 'flexDirection',
      enum: {
        column: FlexDirection.Column,
        'column-reverse': FlexDirection.ColumnReverse,
        row: FlexDirection.Row,
        'row-reverse': FlexDirection.RowReverse,
      },
    },
    {
      key: 'position',
      remap: 'positionType',
      enum: {
        relative: PositionType.Relative,
        absolute: PositionType.Absolute,
        static: PositionType.Static,
      },
    },
  ],
  EDGE: [
    { key: 'padding', remap: 'padding', edge: Edge.All },
    { key: 'paddingLeft', remap: 'padding', edge: Edge.Left },
    { key: 'paddingRight', remap: 'padding', edge: Edge.Right },
    { key: 'paddingTop', remap: 'padding', edge: Edge.Top },
    { key: 'paddingBottom', remap: 'padding', edge: Edge.Bottom },

    { key: 'left', remap: 'position', edge: Edge.Left },
    { key: 'right', remap: 'position', edge: Edge.Right },
    { key: 'top', remap: 'position', edge: Edge.Top },
    { key: 'bottom', remap: 'position', edge: Edge.Bottom },

    { key: 'margin', remap: 'margin', edge: Edge.All },
    { key: 'marginLeft', remap: 'margin', edge: Edge.Left },
    { key: 'marginRight', remap: 'margin', edge: Edge.Right },
    { key: 'marginTop', remap: 'margin', edge: Edge.Top },
    { key: 'marginBottom', remap: 'margin', edge: Edge.Bottom },

    { key: 'borderWidth', remap: 'border', edge: Edge.All },
    { key: 'borderLeftWidth', remap: 'border', edge: Edge.Left },
    { key: 'borderRightWidth', remap: 'border', edge: Edge.Right },
    { key: 'borderTopWidth', remap: 'border', edge: Edge.Top },
    { key: 'borderBottomWidth', remap: 'border', edge: Edge.Bottom },
  ],
};

AVAILABLE.VALUE.forEach((key) => {
  const func = funcName(key);
  STYLE_MAP[key] = (value) => parseValue(func, value);
});

AVAILABLE.ENUM.forEach((item) => {
  const func = funcName(item.remap || item.key);
  const enums = item.enum;
  STYLE_MAP[item.key] = (value) => parseEnum(func, enums, value);
});

AVAILABLE.EDGE.forEach((item) => {
  const func = funcName(item.remap);
  const { edge } = item;
  STYLE_MAP[item.key] = (value) => parseEdge(func, edge, value);
});

const cache = new WeakMap<any, StyleParams[]>();

function _apply(yoga: YogaNode, style: any) {
  if (style) {
    if (!cache.has(style)) {
      const _styles: StyleParams[] = [];
      for (const key in style) {
        const func = STYLE_MAP[key];
        func && _styles.push(func(style[key]));
      }
      cache.set(style, _styles);
    }
    const styles = cache.get(style)!;
    for (let i = 0; i < styles.length; i++) {
      checkAndRun(yoga, ...styles[i]);
    }
  }
}

export default function apply(yoga: YogaNode, style: any) {
  if (style) {
    flatten([style]).forEach((s) => _apply(yoga, s));
  }
}
