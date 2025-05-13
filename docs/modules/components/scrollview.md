---
# AI Metadata Tags
ai_keywords:
  [
    ScrollView,
    component,
    scrolling,
    pan,
    gesture,
    overflow,
    revas component,
    UI,
    Scroller,
  ]
ai_contexts: [usage, implementation, development]
ai_relations: [../core/node.md, view.md, ../../architecture/event-handling.md]
---

# Revas `<ScrollView>` Component

The `<ScrollView>` component in Revas provides a scrollable container for its children. It allows content that is larger than the ScrollView's bounds to be viewed by panning or scrolling gestures.

<!-- AI-IMPORTANCE:level=critical -->

## Purpose and Role

1.  **Scrollable Content:** Enables scrolling of content that exceeds the visible area of the component.
2.  **Vertical and Horizontal Scrolling:** Supports both vertical (default) and horizontal scrolling.
3.  **Event Handling:** Manages touch gestures to initiate and control scrolling.
4.  **Scroll Position Tracking:** Keeps track of the current scroll offset and provides events for scroll changes.
5.  **Paging:** Can optionally snap to page-like intervals during scrolling.
<!-- AI-IMPORTANCE:level=critical -->

---

<!-- AI-CONTEXT-START:type=usage -->

## Usage

`<ScrollView>` wraps content that needs to be scrollable. The content inside a ScrollView will typically have dimensions larger than the ScrollView itself.

```typescript
import React from 'react';
import { render, ScrollView, View, Text } from 'revas';

const App = () => {
  const items = Array.from({ length: 20 }, (_, i) => `Item ${i + 1}`);

  const handleScroll = (event: any /* RevasScrollEvent */) => {
    console.log('Scrolled:', event.x, event.y);
  };

  return (
    <View style={styles.appContainer}>
      <Text style={styles.heading}>Vertical ScrollView</Text>
      <ScrollView
        style={styles.scrollViewVertical}
        onScroll={handleScroll}
        // paging={true} // Enable paging, snaps to ScrollView height
      >
        {items.map((item) => (
          <View key={item} style={styles.item}>
            <Text>{item}</Text>
          </View>
        ))}
      </ScrollView>

      <Text style={styles.heading}>Horizontal ScrollView</Text>
      <ScrollView
        style={styles.scrollViewHorizontal}
        horizontal={true}
        // paging={100} // Snap to 100px pages
      >
        {items.map((item) => (
          <View key={item} style={styles.itemHorizontal}>
            <Text>{item}</Text>
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = {
  appContainer: {
    flex: 1,
    padding: 10,
  },
  heading: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 10,
    marginBottom: 5,
  },
  scrollViewVertical: {
    height: 200,
    width: '100%',
    backgroundColor: '#f0f0f0',
    borderWidth: 1,
    borderColor: '#ccc',
  },
  scrollViewHorizontal: {
    height: 80, // Height of the scrollable area
    width: '100%',
    backgroundColor: '#e0e0e0',
    borderWidth: 1,
    borderColor: '#bbb',
  },
  item: {
    height: 50, // Fixed height for vertical items
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    justifyContent: 'center',
    backgroundColor: 'white',
  },
  itemHorizontal: {
    width: 100, // Fixed width for horizontal items
    height: '100%', // Take full height of ScrollView
    padding: 10,
    borderRightWidth: 1,
    borderRightColor: '#ddd',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'lightyellow',
  },
};

// render(<App />, document.getElementById('root'));
```

<!-- AI-CONTEXT-END -->

---

<!-- AI-CONTEXT-START:type=implementation -->

## Implementation

The `<ScrollView>` component ([`../../../src/revas/components/ScrollView.ts`](../../../src/revas/components/ScrollView.ts:1)) is a complex component, likely a class component or a functional component using several hooks (`useState`, `useRef`, `useEffect`, `useCallback`) to manage its internal state, handle touch events, and perform scrolling.

Key implementation aspects:

1.  **Internal Content Container:**

    - The `ScrollView` renders its `children` inside an internal `<View>` (let's call it `contentContainer`).
    - This `contentContainer` is the element that actually moves (translates) to simulate scrolling. Its dimensions are determined by the total size of its children.
    - The `ScrollView` itself acts as a clipping mask (`overflow: 'hidden'` is implicitly applied or set on its style).

2.  **`Scroller` Utility:**

    - Revas uses a `Scroller` utility, likely from [`../../../src/revas/components/common/Scroller.ts`](../../../src/revas/components/common/Scroller.ts:1). This utility is a common pattern for implementing physics-based scrolling (momentum, bouncing) in JavaScript.
    - The `Scroller` typically takes touch events as input, calculates scroll positions, velocity, and handles animations for smooth scrolling, deceleration, and potentially bounce-back effects at the edges. It often doesn't render anything itself but provides the scroll values.

3.  **State Management:**

    - The `ScrollView` needs to manage:
      - Current scroll offset (`scrollX`, `scrollY`).
      - Dimensions of the `ScrollView` itself (`clientWidth`, `clientHeight`).
      - Dimensions of the `contentContainer` (`contentWidth`, `contentHeight`).
      - Touch state (is a pan active, start coordinates, etc.).

4.  **Touch Event Handling:**

    - The `ScrollView` attaches `onTouchStart`, `onTouchMove`, and `onTouchEnd` (and `onTouchCancel`) handlers to its main wrapping View.
    - `onTouchStart`: Records the starting touch position and initializes the `Scroller` for a new scroll session. Calls `onScrollStart` prop.
    - `onTouchMove`: Feeds touch movement delta to the `Scroller` instance. The `Scroller` calculates the new scroll position. The `ScrollView` then updates its internal scroll offset state and re-renders, translating the `contentContainer`. Calls `onScroll` prop.
    - `onTouchEnd`: Notifies the `Scroller` that the touch has ended. The `Scroller` might then initiate a deceleration animation (fling) based on the last velocity. Calls `onScrollEnd` prop.

5.  **Rendering and Translation:**

    - The `ScrollView` component renders a main `<View>` (the scroll viewport) with `overflow: 'hidden'`.
    - Inside this viewport, it renders the `contentContainer` View.
    - The `contentContainer`'s `style` is dynamically updated with `translateX: -scrollX` and `translateY: -scrollY` to achieve the scrolling effect.
    - The `Scroller`'s output values are used to drive an animation loop (e.g., using `requestAnimationFrame`) that continuously updates `scrollX`/`scrollY` and re-renders during momentum scrolling.

6.  **Layout Measurement:**

    - The `ScrollView` needs to know its own dimensions and the dimensions of its `contentContainer`. This is typically done using the `onLayout` prop of the respective `<View>`s.
    - `onLayout` of the main `ScrollView` View provides `clientWidth`, `clientHeight`.
    - `onLayout` of the `contentContainer` View provides `contentWidth`, `contentHeight`.
    - These dimensions are crucial for the `Scroller` to determine scroll limits and whether scrolling is possible in each direction.

7.  **Paging (`paging` prop):**
    - If `paging` is `true`, the page size is the `ScrollView`'s dimension in the scroll direction.
    - If `paging` is a `number`, that number is the page size.
    - When a scroll gesture ends, the `Scroller` (or logic within `ScrollView`) animates the scroll position to snap to the nearest page boundary.

```typescript
// Highly conceptual structure of a ScrollView component
import React, { useRef, useState, useCallback, useEffect } from 'react';
import { View, NodeProps, RevasTouchEvent, Frame } from '../core/Node';
// import Scroller from './common/Scroller'; // Assuming Scroller exists

export interface ScrollViewProps extends NodeProps {
  style?: any;
  horizontal?: boolean;
  onScroll?: (event: { x: number; y: number }) => void;
  onScrollStart?: (event: { x: number; y: number }) => void;
  onScrollEnd?: (event: { x: number; y: number }) => void;
  paging?: boolean | number;
  offset?: { x: number; y: number }; // Initial offset
  // ... other props
}

export default function ScrollViewComponent(props: ScrollViewProps) {
  const {
    horizontal,
    children,
    style,
    onScroll,
    onScrollStart,
    onScrollEnd,
    paging,
    offset,
  } = props;

  const [scrollX, setScrollX] = useState(offset?.x || 0);
  const [scrollY, setScrollY] = useState(offset?.y || 0);

  const scrollerRef = useRef<any>(null); // Instance of the Scroller utility
  const contentLayoutRef = useRef<Frame | null>(null);
  const containerLayoutRef = useRef<Frame | null>(null);
  const isPanningRef = useRef(false);

  // Initialize Scroller (e.g., from Zynga Scroller or similar)
  useEffect(() => {
    // scrollerRef.current = new Scroller((left, top, zoom) => {
    //   setScrollX(left);
    //   setScrollY(top);
    //   onScroll?.({ x: left, y: top });
    // }, { scrollingX: horizontal, scrollingY: !horizontal, paging: !!paging /* simplified */ });
    // Need to configure scroller with dimensions from onLayout
  }, [horizontal, paging, onScroll]);

  const updateScrollerDimensions = useCallback(() => {
    // if (scrollerRef.current && containerLayoutRef.current && contentLayoutRef.current) {
    //   scrollerRef.current.setDimensions(
    //     containerLayoutRef.current.width, containerLayoutRef.current.height,
    //     contentLayoutRef.current.width, contentLayoutRef.current.height
    //   );
    // }
  }, []);

  const handleContainerLayout = useCallback(
    (frame: Frame) => {
      containerLayoutRef.current = frame;
      updateScrollerDimensions();
      props.onLayout?.(frame);
    },
    [props.onLayout, updateScrollerDimensions]
  );

  const handleContentLayout = useCallback(
    (frame: Frame) => {
      contentLayoutRef.current = frame;
      updateScrollerDimensions();
    },
    [updateScrollerDimensions]
  );

  const handleTouchStart = useCallback(
    (event: RevasTouchEvent) => {
      // isPanningRef.current = true;
      // scrollerRef.current?.doTouchStart(event.touches, event.timestamp);
      // onScrollStart?.({ x: scrollX, y: scrollY });
    },
    [
      /* scrollX, scrollY, onScrollStart */
    ]
  );

  const handleTouchMove = useCallback((event: RevasTouchEvent) => {
    // if (!isPanningRef.current) return;
    // scrollerRef.current?.doTouchMove(event.touches, event.timestamp);
  }, []);

  const handleTouchEnd = useCallback(
    (event: RevasTouchEvent) => {
      // if (!isPanningRef.current) return;
      // isPanningRef.current = false;
      // scrollerRef.current?.doTouchEnd(event.timestamp);
      // onScrollEnd?.({ x: scrollX, y: scrollY });
    },
    [
      /* scrollX, scrollY, onScrollEnd */
    ]
  );

  const contentStyle: any = {
    flexDirection: horizontal ? 'row' : 'column', // Children layout
    // Important: For content to determine its size for scrolling
    // it should not have flex:1 in the scroll direction usually
    // Instead, items inside should define their sizes
    transform: [{ translateX: -scrollX }, { translateY: -scrollY }],
  };
  if (horizontal) {
    contentStyle.height = '100%'; // Content takes full height of viewport
  } else {
    contentStyle.width = '100%'; // Content takes full width of viewport
  }

  return (
    <View
      style={[style, { overflow: 'hidden' }]} // Main viewport with clipping
      onLayout={handleContainerLayout}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onTouchCancel={handleTouchEnd} // Often same as touch end
    >
      <View onLayout={handleContentLayout} style={contentStyle}>
        {children}
      </View>
    </View>
  );
}
```

The conceptual code above is highly simplified. A real `Scroller` integration involves managing an animation loop for momentum and properly handling touch event coordinates and timestamps.

<!-- AI-CONTEXT-END -->

---

<!-- AI-CONTEXT-START:type=development -->

## Props

The `<ScrollView>` component accepts `ScrollViewProps`:

- **`style?: ViewStyle | ViewStyle[]`**

  - Styles the main ScrollView container. `overflow: 'hidden'` is implicitly applied.

- **`children?: React.ReactNode`**

  - The content to be scrolled.

- **`horizontal?: boolean`**

  - If `true`, scrolling is horizontal. Defaults to `false` (vertical scrolling).

- **`onScroll?: (event: { x: number; y: number; nativeEvent?: any }) => void`**

  - Callback invoked frequently during scrolling. `x` and `y` are the current scroll offsets. `nativeEvent` might contain more detailed information from the Scroller.

- **`onScrollStart?: (event: { x: number; y: number }) => void`**

  - Callback invoked when a scroll gesture begins.

- **`onScrollEnd?: (event: { x: number; y: number }) => void`**

  - Callback invoked when a scroll gesture ends (including after momentum scrolling finishes).

- **`paging?: boolean | number`**

  - If `true`, enables paging, snapping to the ScrollView's width/height.
  - If a `number`, enables paging, snapping to intervals of that size in pixels.

- **`offset?: { x: number; y: number }`**

  - The initial scroll offset. Defaults to `{ x: 0, y: 0 }`.

- **Inherited `NodeProps`:**
  - Includes `onLayout` (for the ScrollView itself), `pointerEvents`, `cache`, etc.

The `<ScrollView>` is essential for displaying content that doesn't fit within a fixed viewport, relying on a combination of layout, touch handling, and a scrolling physics engine.

<!-- AI-CONTEXT-END -->
