---
# AI Metadata Tags
ai_keywords:
  [
    ListView,
    component,
    list,
    virtualization,
    performance,
    scroll,
    revas component,
    UI,
    flatlist,
  ]
ai_contexts: [usage, implementation, development]
ai_relations:
  [scrollview.md, ../core/node.md, ../../architecture/event-handling.md]
---

# Revas `<ListView>` Component

The `<ListView>` component in Revas is designed for efficiently rendering long, scrollable lists of data. It's an optimized version of `<ScrollView>` that typically implements "windowing" or "virtualization" to render only the items currently visible (or nearly visible) within the viewport, significantly improving performance for large datasets.

<!-- AI-IMPORTANCE:level=critical -->

## Purpose and Role

1.  **Efficient List Rendering:** Optimizes rendering of large lists by only creating and rendering component items that are currently in or near the viewport.
2.  **Scrollable Data:** Provides a scrollable interface for datasets.
3.  **Data Handling:** Takes an array of data and a function to render each item.
4.  **Performance:** Reduces memory usage and processing overhead compared to rendering all items in a simple `<ScrollView>`.
<!-- AI-IMPORTANCE:level=critical -->

---

<!-- AI-CONTEXT-START:type=usage -->

## Usage

`<ListView>` requires a `data` array and a `renderItem` function. It also needs information about item heights for virtualization calculations.

```typescript
import React from 'react';
import { render, ListView, View, Text } from 'revas';

interface MyDataItem {
  id: string;
  title: string;
  content: string;
}

const sampleData: MyDataItem[] = Array.from({ length: 1000 }, (_, i) => ({
  id: `item-${i}`,
  title: `Item Title ${i + 1}`,
  content: `This is the detailed content for item number ${
    i + 1
  }. It could be longer.`,
}));

const App = () => {
  const renderListItem = (item: MyDataItem, index: number) => (
    <View style={styles.itemContainer} key={item.id}>
      <Text style={styles.itemTitle}>{item.title}</Text>
      <Text style={styles.itemContent}>{item.content}</Text>
    </View>
  );

  // For variable height items, itemHeight would be a function: (item, index) => height
  // For fixed height items, it can be a number.
  // Revas API docs specify itemHeight, but React Native's FlatList uses getItemLayout.
  // Assuming itemHeight can be a function or number based on API.md.
  const getItemHeight = (item: MyDataItem, index: number) => {
    // Example: Calculate height based on content or return fixed if all same.
    // For simplicity, let's use a fixed height + some variability for demo.
    return 60 + (item.id.endsWith('0') ? 20 : 0); // Items ending in '0' are taller
  };

  const fixedItemHeight = 70; // If all items have the same height

  return (
    <View style={styles.appContainer}>
      <Text style={styles.heading}>Virtualized ListView</Text>
      <ListView
        style={styles.listView}
        data={sampleData}
        renderItem={renderListItem}
        // Use a function for variable heights:
        // itemHeight={getItemHeight}
        // Or a number for fixed height:
        itemHeight={fixedItemHeight}
        // Other ScrollView props like onScroll can also be used
        onScroll={(event) => console.log('ListView scrolled:', event.y)}
      />
    </View>
  );
};

const styles = {
  appContainer: {
    flex: 1,
    padding: 5,
  },
  heading: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  listView: {
    flex: 1, // Take remaining space
    backgroundColor: '#f0f0f0',
    borderWidth: 1,
    borderColor: '#ccc',
  },
  itemContainer: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    backgroundColor: 'white',
  },
  itemTitle: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  itemContent: {
    fontSize: 12,
    color: '#333',
    marginTop: 4,
  },
};

// render(<App />, document.getElementById('root'));
```

<!-- AI-CONTEXT-END -->

---

<!-- AI-CONTEXT-START:type=implementation -->

## Implementation

The `<ListView>` component ([`../../../src/revas/components/ListView.ts`](../../../src/revas/components/ListView.ts:1)) extends the functionality of `<ScrollView>` by adding virtualization logic.

Key implementation aspects:

1.  **Inheritance/Composition with `<ScrollView>`:**

    - It might internally use a `<ScrollView>` to provide the actual scrolling mechanics or re-implement scrolling logic tailored for virtualization. The API documentation says it `extends ScrollViewProps`, suggesting it shares many properties and underlying mechanisms.

2.  **Virtualization Logic (Windowing):**
    <!-- AI-IMPORTANCE:level=high -->

    - **Viewport Calculation:** On scroll (and initial render), the `ListView` calculates which range of items from the `data` array should be visible within its current viewport (the visible area of the `ListView`).
    - **Item Rendering:** It only calls the `renderItem` function for this subset of items. Items outside this "window" are not rendered to Revas `Node`s, or previously rendered items that scroll out of view are unmounted/recycled.
    - **Buffer Items:** Often, a few extra items above and below the visible viewport (a "buffer" or "render window") are also rendered to ensure smooth scrolling when new items are about to become visible.
    <!-- AI-IMPORTANCE:level=high -->

3.  **Item Height Management (`itemHeight` prop):**

    - **Fixed Height:** If `itemHeight` is a `number`, virtualization is simpler because the position and visibility of any item can be directly calculated: `offset = index * itemHeight`.
    - **Variable Height:** If `itemHeight` is a function `(item, index) => height`, the `ListView` needs to:
      - Potentially call this function for all items (or items up to a certain point) to determine the total content height and estimate scrollbar size.
      - Maintain a list of offsets for each item. This can be more complex and might involve estimating heights for items not yet rendered or measured.
      - Alternatively, it might require items to be measured asynchronously as they are about to be rendered, adjusting scroll positions dynamically. React Native's `FlatList` uses `getItemLayout` for this, which provides offset and length, optimizing this. Revas's `itemHeight` prop alone suggests a simpler approach might be taken initially, perhaps best suited for fixed heights or where heights are known cheaply.

4.  **Content Container Sizing:**

    - The internal scrollable content container within the `ListView` must be sized to reflect the total height/width of _all_ items in the list (even those not rendered) to make the scrollbar accurate.
    - This total height is calculated using the `itemHeight` information for all data items.

5.  **Item Positioning:**

    - Rendered items are absolutely positioned within the content container (or positioned using transforms) based on their calculated offsets.
    - As the user scrolls, the `ListView` determines the new window of items to render and updates their positions or re-renders the necessary set.

6.  **State Management:**
    - Keeps track of the current scroll offset (inherited from `ScrollView` logic).
    - Manages the currently rendered window of items (e.g., `firstVisibleIndex`, `lastVisibleIndex`).
    - May store calculated item layouts (offset, height) if heights are variable.

```typescript
// Highly conceptual structure of a ListView component
import React, {
  useState,
  useCallback,
  useMemo,
  useRef,
  useEffect,
} from 'react';
import ScrollView, { ScrollViewProps } from './ScrollView'; // Assuming it uses ScrollView internally
import View from './View';
import { Frame } from '../core/Node';

export interface ListViewProps extends ScrollViewProps {
  data: any[];
  renderItem: (
    item: any,
    index: number,
    data: any[]
  ) => React.ReactElement | null;
  itemHeight: number | ((item: any, index: number) => number);
  // keyExtractor?: (item: any, index: number) => string; // Common in React Native lists
}

export default function ListViewComponent(props: ListViewProps) {
  const {
    data,
    renderItem,
    itemHeight,
    style,
    horizontal,
    ...scrollViewProps
  } = props;

  const [viewportHeight, setViewportHeight] = useState(0); // or width if horizontal
  const [scrollOffset, setScrollOffset] = useState(0);

  // Calculate item layouts (offsets and heights)
  const layouts = useMemo(() => {
    let currentOffset = 0;
    return data.map((item, index) => {
      const height =
        typeof itemHeight === 'function' ? itemHeight(item, index) : itemHeight;
      const layout = { offset: currentOffset, height, index };
      currentOffset += height;
      return layout;
    });
  }, [data, itemHeight]);

  const totalContentHeight =
    layouts.length > 0
      ? layouts[layouts.length - 1].offset + layouts[layouts.length - 1].height
      : 0;

  // Determine visible items based on scrollOffset and viewportHeight
  const visibleItems = useMemo(() => {
    if (!viewportHeight || layouts.length === 0) return [];

    const startIndex = layouts.findIndex(
      (l) => l.offset + l.height > scrollOffset
    );
    if (startIndex === -1) return []; // Should not happen if scrollOffset is valid

    const endIndex = layouts.findIndex(
      (l) => l.offset >= scrollOffset + viewportHeight
    );

    const actualEndIndex = endIndex === -1 ? data.length : endIndex;

    // Add buffer items (e.g., 5 above and 5 below)
    const buffer = 5;
    const firstToRender = Math.max(0, startIndex - buffer);
    const lastToRender = Math.min(data.length, actualEndIndex + buffer);

    const itemsToRender = [];
    for (let i = firstToRender; i < lastToRender; i++) {
      itemsToRender.push({
        key: `item-${i}`, // A proper keyExtractor prop would be better
        data: data[i],
        index: i,
        layout: layouts[i],
      });
    }
    return itemsToRender;
  }, [data, layouts, scrollOffset, viewportHeight]);

  const handleScroll = useCallback(
    (event: { x: number; y: number }) => {
      setScrollOffset(horizontal ? event.x : event.y);
      scrollViewProps.onScroll?.(event);
    },
    [horizontal, scrollViewProps.onScroll]
  );

  const handleLayout = useCallback(
    (frame: Frame) => {
      setViewportHeight(horizontal ? frame.width : frame.height);
      scrollViewProps.onLayout?.(frame);
    },
    [horizontal, scrollViewProps.onLayout]
  );

  // The content view needs to be large enough to contain all items for scrollbar
  const contentContainerStyle: any = {
    position: 'relative', // For absolute positioning of items
    [horizontal ? 'width' : 'height']: totalContentHeight,
    [horizontal ? 'height' : 'width']: '100%', // Take full cross-axis dimension
  };

  return (
    <ScrollView
      {...scrollViewProps}
      style={style}
      horizontal={horizontal}
      onScroll={handleScroll}
      onLayout={handleLayout}
    >
      <View style={contentContainerStyle}>
        {visibleItems.map((itemInfo) => (
          <View
            key={itemInfo.key}
            style={{
              position: 'absolute',
              [horizontal ? 'left' : 'top']: itemInfo.layout.offset,
              [horizontal ? 'width' : 'height']: itemInfo.layout.height,
              [horizontal ? 'height' : 'width']: '100%', // Take full cross-axis of ScrollView
            }}
          >
            {renderItem(itemInfo.data, itemInfo.index, data)}
          </View>
        ))}
      </View>
    </ScrollView>
  );
}
```

This is a simplified conceptual implementation. Real-world virtualized lists often have more sophisticated logic for item recycling, handling rapid scrolling, initial scroll position, and optimizing `renderItem` calls.

<!-- AI-CONTEXT-END -->

---

<!-- AI-CONTEXT-START:type=development -->

## Props

The `<ListView>` component extends `ScrollViewProps` and adds list-specific properties:

- **`data: T[]`** (Required)

  - An array of data items to be rendered in the list.

- **`renderItem: (item: T, index: number, data: T[]) => React.ReactElement | null`** (Required)

  - A function that takes an item from the `data` array, its `index`, and the full `data` array, and returns a Revas React element to render for that item.
  - The returned element must have a unique `key` prop.

- **`itemHeight: number | ((item: T, index: number) => number)`** (Required)

  - Specifies the height of each item.
    - If a `number`, all items are assumed to have this fixed height.
    - If a function, it's called for each item to determine its height. This is necessary for lists with variable item heights.
  - This is crucial for the virtualization logic to calculate which items are in the viewport and the total content size.

- **Inherited `ScrollViewProps`:**
  - All props from `<ScrollView>` are available, such as `style`, `horizontal`, `onScroll`, `onScrollStart`, `onScrollEnd`, `paging`, `offset`, etc.

The `<ListView>` component is essential for building performant, scrollable lists of data in Revas applications, especially when dealing with large datasets.

<!-- AI-CONTEXT-END -->
