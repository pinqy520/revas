import Yoga from 'yoga-layout-prebuilt'

const ALIGN_ENUM = {
  'auto': Yoga.ALIGN_AUTO,
  'baseline': Yoga.ALIGN_BASELINE,
  'center': Yoga.ALIGN_CENTER,
  'flex-end': Yoga.ALIGN_FLEX_END,
  'flex-start': Yoga.ALIGN_FLEX_START,
  'space-around': Yoga.ALIGN_SPACE_AROUND,
  'space-between': Yoga.ALIGN_SPACE_BETWEEN,
  'stretch': Yoga.ALIGN_STRETCH,
}

const AVAILABLE = {
  VALUE: [
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
        'center': Yoga.JUSTIFY_CENTER,
        'flex-end': Yoga.JUSTIFY_FLEX_END,
        'flex-start': Yoga.JUSTIFY_FLEX_START,
        'space-around': Yoga.JUSTIFY_SPACE_AROUND,
        'space-between': Yoga.JUSTIFY_SPACE_BETWEEN,
        'space-evenly': Yoga.JUSTIFY_SPACE_EVENLY,
      }
    },
    { key: 'alignItems', enum: ALIGN_ENUM },
    { key: 'alignSelf', enum: ALIGN_ENUM },
    { key: 'alignContent', enum: ALIGN_ENUM },
    {
      key: 'flexWrap',
      enum: {
        'no-wrap': Yoga.WRAP_NO_WRAP,
        'wrap': Yoga.WRAP_WRAP,
        'wrap-reverse': Yoga.WRAP_WRAP_REVERSE,
      }
    },
    {
      key: 'flexDirection',
      enum: {
        'column': Yoga.FLEX_DIRECTION_COLUMN,
        'column-reverse': Yoga.FLEX_DIRECTION_COLUMN_REVERSE,
        'count': Yoga.FLEX_DIRECTION_COUNT,
        'row': Yoga.FLEX_DIRECTION_ROW,
        'row-reverse': Yoga.FLEX_DIRECTION_ROW_REVERSE,
      }
    },
    {
      key: 'position',
      remap: 'positionType',
      enum: {
        'relative': Yoga.POSITION_TYPE_RELATIVE,
        'absolute': Yoga.POSITION_TYPE_ABSOLUTE,
        'count': Yoga.POSITION_TYPE_COUNT,
      }
    }
  ],
  EDGE: [
    { key: 'padding', remap: 'padding', edge: Yoga.EDGE_ALL },
    { key: 'paddingLeft', remap: 'padding', edge: Yoga.EDGE_LEFT },
    { key: 'paddingRight', remap: 'padding', edge: Yoga.EDGE_RIGHT },
    { key: 'paddingTop', remap: 'padding', edge: Yoga.EDGE_TOP },
    { key: 'paddingBottom', remap: 'padding', edge: Yoga.EDGE_BOTTOM },

    { key: 'left', remap: 'position', edge: Yoga.EDGE_LEFT },
    { key: 'right', remap: 'position', edge: Yoga.EDGE_RIGHT },
    { key: 'top', remap: 'position', edge: Yoga.EDGE_TOP },
    { key: 'bottom', remap: 'position', edge: Yoga.EDGE_BOTTOM },

    { key: 'margin', remap: 'margin', edge: Yoga.EDGE_ALL },
    { key: 'marginLeft', remap: 'margin', edge: Yoga.EDGE_LEFT },
    { key: 'marginRight', remap: 'margin', edge: Yoga.EDGE_RIGHT },
    { key: 'marginTop', remap: 'margin', edge: Yoga.EDGE_TOP },
    { key: 'marginBottom', remap: 'margin', edge: Yoga.EDGE_BOTTOM },

    { key: 'borderWidth', remap: 'border', edge: Yoga.EDGE_ALL },
    { key: 'borderLeftWidth', remap: 'border', edge: Yoga.EDGE_LEFT },
    { key: 'borderRightWidth', remap: 'border', edge: Yoga.EDGE_RIGHT },
    { key: 'borderTopWidth', remap: 'border', edge: Yoga.EDGE_TOP },
    { key: 'borderBottomWidth', remap: 'border', edge: Yoga.EDGE_BOTTOM },
  ],
  FONT: [],
  OTHER: ['overflow', 'zIndex'],

  DIRECTION: ['top', 'right', 'bottom', 'left']
}

function funcName(key: string) {
  return `set${key[0].toUpperCase()}${key.substr(1)}`
}

function checkAndRun(yoga: any, key: string, ...values: any[]) {
  if (yoga[key]) {
    yoga[key](...values)
  } else {
    throw new Error(`ReCanvas: No Such Style Func - ${key}`)
  }
}

function setValue(yoga: Yoga.YogaNode, key: string, value: string | number) {
  if (typeof value === 'number') {
    checkAndRun(yoga, funcName(key), value)
  } else if (value === 'auto') {
    checkAndRun(yoga, funcName(key) + 'Auto')
  } else if (value.endsWith('%')) {
    checkAndRun(yoga, funcName(key) + 'Percent', value)
  } else {
    throw new Error(`ReCanvas: No Such Style Value - ${value}`)
  }
}


function setEnum(yoga: Yoga.YogaNode, key: string, enums: any, value: string) {
  if (enums[value]) {
    checkAndRun(yoga, funcName(key), enums[value])
  } else {
    throw new Error(`ReCanvas: No Such Style Value - ${value}`)
  }
}

function setEdge(yoga: Yoga.YogaNode, key: string, edge: number, value: string | number) {
  if (typeof value === 'number') {
    checkAndRun(yoga, funcName(key), edge, value)
  } else if (value === 'auto') {
    checkAndRun(yoga, funcName(key) + 'Auto', edge)
  } else if (value.endsWith('%')) {
    checkAndRun(yoga, funcName(key) + 'Percent', edge, value)
  } else {
    throw new Error(`ReCanvas: No Such Style Value - ${value}`)
  }
}

export default function apply(yoga: Yoga.YogaNode, style: any) {
  AVAILABLE.VALUE.forEach(key => {
    const value = style[key]
    typeof value !== 'undefined'
      && setValue(yoga, key, value)
  })
  AVAILABLE.ENUM.forEach(item => {
    const value = style[item.key]
    typeof value !== 'undefined'
      && setEnum(yoga, item.remap || item.key, item.enum, value)
  })
  AVAILABLE.EDGE.forEach(item => {
    const value = style[item.key]
    typeof value !== 'undefined'
      && setEdge(yoga, item.remap, item.edge, value)
  })
}