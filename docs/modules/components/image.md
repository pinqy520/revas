---
# AI Metadata Tags
ai_keywords:
  [
    Image,
    component,
    image rendering,
    src,
    async loading,
    revas component,
    UI,
    graphics,
  ]
ai_contexts: [usage, implementation, development]
ai_relations: [../core/node.md, view.md, ../core/draw.md]
---

# Revas `<Image>` Component

The `<Image>` component in Revas is used to display images on the canvas. It handles asynchronous image loading and provides styling options for how the image is rendered within its bounds.

<!-- AI-IMPORTANCE:level=critical -->

## Purpose and Role

1.  **Display Images:** Renders raster images (e.g., PNG, JPEG, GIF - though animated GIFs might require special handling not covered by basic `<Image>`) from a specified source URL.
2.  **Asynchronous Loading:** Manages the asynchronous nature of loading images over the network or from local sources.
3.  **Layout and Styling:** Participates in the flexbox layout system and can be styled like a `<View>`, including properties like `width`, `height`, `borderRadius`, and `opacity`.
4.  **Resize Mode:** Offers control over how the image should be resized to fit its container if the image's aspect ratio differs from the component's frame.
<!-- AI-IMPORTANCE:level=critical -->

---

<!-- AI-CONTEXT-START:type=usage -->

## Usage

```typescript
import React from 'react';
import { render, View, Image, Text } from 'revas';

const App = () => (
  <View style={styles.container}>
    <Text style={styles.label}>Image with 'cover' resizeMode:</Text>
    <Image
      style={styles.imageFrame}
      src="https://placekitten.com/300/200" // Replace with your image URL
      resizeMode="cover"
    />
    <Text style={styles.label}>Image with 'contain' resizeMode:</Text>
    <Image
      style={styles.imageFrame}
      src="https://placekitten.com/200/300" // Replace with your image URL
      resizeMode="contain"
    />
    <Text style={styles.label}>Image with 'stretch' resizeMode:</Text>
    <Image
      style={styles.imageFrame}
      src="https://placekitten.com/250/250" // Replace with your image URL
      resizeMode="stretch"
    />
  </View>
);

const styles = {
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: '#f0f0f0',
    alignItems: 'center',
  },
  label: {
    fontSize: 14,
    marginTop: 15,
    marginBottom: 5,
  },
  imageFrame: {
    width: 150,
    height: 100,
    backgroundColor: '#e0e0e0', // Background visible if image is smaller or transparent
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 5,
  },
};

// render(<App />, document.getElementById('root'));
```

<!-- AI-CONTEXT-END -->

---

<!-- AI-CONTEXT-START:type=implementation -->

## Implementation

The `<Image>` component is defined in [`../../../src/revas/components/Image.ts`](../../../src/revas/components/Image.ts:1).

```typescript
import * as React from 'react';
import { NodeProps, Frame } from '../core/Node';
import { loadImage, ImageContent } from './common/imageLoader'; // Handles loading
import { drawImage, ResizeMode } from './common/drawImage'; // Handles rendering
import { RevasCanvas } from '../core/Canvas';

export interface ImageProps extends NodeProps {
  style?: any | any[]; // Should be a more specific ImageStyle type
  src: string;
  resizeMode?: ResizeMode; // 'cover' | 'contain' | 'stretch' | 'center' (center not in original API doc)
  onLoad?: (metrics: { width: number; height: number }) => void;
  onError?: (error: ErrorEvent) => void;
}

// Component state to hold the loaded image and its dimensions
interface ImageState {
  loadedImage: ImageContent | null;
  imgWidth: number;
  imgHeight: number;
  error: boolean;
}

// Helper to update the $ready prop on the node instance
// This is a conceptual helper; direct node manipulation from component isn't standard React.
// Revas might handle this by passing a callback ref or through context.
// For simplicity, we'll assume this effect is managed by the imageLoader or a similar mechanism
// that updates the Revas Node's internal `$ready` state.

function imageDrawer(
  canvas: RevasCanvas,
  node: any /* Node<ImageProps, ImageState> */
) {
  const { style, resizeMode } = node.props as ImageProps;
  const frame = node.frame as Frame;
  // The loaded image data would be retrieved from the node's internal state
  // or passed to the drawer if the component re-renders upon image load.
  // For this example, let's assume `node.loadedImageContent` exists.
  const imageContent = node.loadedImageContent as ImageContent; // This would be set by the component's logic

  if (imageContent && imageContent.image) {
    drawImage(
      canvas.context,
      imageContent.image,
      imageContent.width,
      imageContent.height,
      frame.x,
      frame.y,
      frame.width,
      frame.height,
      style, // Pass image-specific styles like tintColor, borderRadius if applicable
      resizeMode
    );
  } else {
    // Optionally draw a placeholder or nothing if image hasn't loaded or failed
  }
}

// The Revas <Image> component is likely a class component to manage loading state.
export default class ImageComponent extends React.Component<
  ImageProps,
  ImageState
> {
  private _nodeRef: any; // To store the Revas Node instance if needed for $ready updates

  constructor(props: ImageProps) {
    super(props);
    this.state = {
      loadedImage: null,
      imgWidth: 0,
      imgHeight: 0,
      error: false,
    };
  }

  componentDidMount() {
    this.loadImage(this.props.src);
  }

  componentDidUpdate(prevProps: ImageProps) {
    if (this.props.src !== prevProps.src) {
      this.loadImage(this.props.src);
    }
  }

  private loadImage(src: string) {
    this.setState({
      loadedImage: null,
      imgWidth: 0,
      imgHeight: 0,
      error: false,
    });
    // The imageLoader utility updates the node's $ready status internally
    // or via a callback mechanism after loading.
    loadImage(
      src,
      (content) => {
        this.setState({
          loadedImage: content,
          imgWidth: content.width,
          imgHeight: content.height,
        });
        this.props.onLoad?.({ width: content.width, height: content.height });
        // Conceptually: this._nodeRef?.setReady(true);
        // In Revas, this $ready update might be implicit if the customDrawer uses this.state.loadedImage
      },
      (err) => {
        this.setState({ error: true });
        this.props.onError?.(err as any); // Cast needed if ErrorEvent is specific
        // Conceptually: this._nodeRef?.setReady(false);
      }
    );
  }

  // This ref callback allows access to the underlying Revas Node if needed.
  // However, Revas's API.md doesn't detail how $ready is set from the component.
  // It's more likely the reconciler/draw system checks if node.props.src has loaded.
  // For the customDrawer, we need to pass the loaded image data.
  // The `customDrawer` itself cannot be stateful.
  // One way is to pass a modified drawer or necessary data via props in render.

  render() {
    const { src, onLoad, onError, ...restProps } = this.props;

    // Pass loaded image information to the customDrawer through props if necessary,
    // or the customDrawer relies on information attached to the node instance by imageLoader.
    // A common pattern is for the customDrawer to access `this.state.loadedImage` (if the node instance was the component).
    // Since Revas uses `React.createElement('Image', ...)`, the `imageDrawer` is static.
    // The `imageDrawer` must get `loadedImage` from the `node` instance itself.
    // This implies `loadImage` or the component instance somehow attaches data to the Revas `Node`.
    // A more direct way: imageLoader updates a global cache, and imageDrawer reads from it using `src`.
    // Or, the component re-renders, and new props (like a `_loadedImage` internal prop) are passed.

    // For this example, let's assume `imageDrawer` can access `this.state.loadedImage`
    // via the `node` it receives (e.g., `node.componentInstance.state.loadedImage`).
    // Or, more simply, the node itself is updated by `loadImage` with the content.

    return React.createElement('Image', {
      ...restProps,
      src: src, // Keep src for potential re-evaluation by imageDrawer
      // Internal props for the drawer:
      _imageContent: this.state.loadedImage,
      _imageError: this.state.error,
      customDrawer: imageDrawer,
      // $ready is managed by the reconciler/node based on _imageContent or a callback
      $ready: !!this.state.loadedImage && !this.state.error,
    });
  }
}
```

The `Image` component uses `React.createElement('Image', props)` and passes a `customDrawer` (the `imageDrawer` function).

Key implementation details:

1.  **State Management:** It's likely a class component (or a functional component with hooks) to manage the loading state of the image (`loadedImage`, `error`).

- **`loadImage` Utility:** Uses a helper function `loadImage` (from [`../../../src/revas/components/common/imageLoader.ts`](../../../src/revas/components/common/imageLoader.ts:1)). This utility:

  - Takes the `src` URL and callbacks for success (`onLoad`) and failure (`onError`).
  - Creates an `HTMLImageElement` in memory.
  - Sets its `src` and listens for `load` and `error` events.
  - Once loaded, it provides the `ImageContent` (which includes the `HTMLImageElement` itself and its natural dimensions).
  - **Crucially, `imageLoader` (or the `ImageComponent` via callbacks) is responsible for updating the corresponding Revas `Node`'s internal `$ready` state to `true` so the caching system and drawing system know the image is available.** This interaction is vital.

3.  **`imageDrawer` Function:**

    - This function is passed as `customDrawer` to the Revas `Node`.
    - When the drawing system ([`../core/draw.md`](../core/draw.md:1)) processes this `Image` node, it calls `imageDrawer`.
    - `imageDrawer` retrieves the loaded `ImageContent` (which would have been placed onto the `Node` instance itself or made accessible through props by the component's logic after loading).
    - If the image is loaded, it calls `drawImage` (from [`../../../src/revas/components/common/drawImage.ts`](../../../src/revas/components/common/drawImage.ts:1)).

4.  **`drawImage` Utility:**

    - This utility handles the actual `canvas.context.drawImage(...)` call.
    - It takes the loaded image, its natural dimensions, the target frame (x, y, width, height) on the canvas, and the `resizeMode`.
    - It calculates the source and destination rectangles for `drawImage` based on the `resizeMode` to achieve "cover", "contain", or "stretch" behavior.
    - It also handles applying styles like `borderRadius` (by using clipping paths before drawing the image) and potentially `tintColor`.

5.  **`$ready` Prop Management:** The `ImageComponent` must ensure the underlying Revas `Node`'s `$ready` prop (see [`../core/node.md`](../core/node.md:56)) is correctly set to `true` once the image is successfully loaded and `false` or unset if it's loading or an error occurred. This is essential for the offscreen caching system. The provided `render` method in the example above attempts to set this.

<!-- AI-CONTEXT-END -->

---

<!-- AI-CONTEXT-START:type=development -->

## Props

The `<Image>` component accepts `ImageProps`:

- **`src: string`** (Required)

  - The source URL of the image. Can be a web URL or a local path/data URI depending on the environment's capabilities.

- **`style?: ImageStyle | ImageStyle[]`**

  - Inherits layout and box model styles from `<View>`.
  - Specific `ImageStyle` properties might include:
    - `resizeMode`: See below.
    - `tintColor`: (If supported by `drawImage` utility) to apply a color overlay to the image.
    - `borderRadius`: Applies to the image frame, clipping the image.

- **`resizeMode?: 'cover' | 'contain' | 'stretch'`**

  - Determines how the image should be resized to fit its allocated frame when the image's aspect ratio doesn't match the frame's aspect ratio.
    - `'cover'`: Scales the image uniformly (maintaining aspect ratio) so that both dimensions (width and height) of the image will be equal to or larger than the corresponding dimension of the view. The image is then centered. Parts of the image may be clipped.
    - `'contain'`: Scales the image uniformly (maintaining aspect ratio) so that both dimensions of the image will be equal to or less than the corresponding dimension of the view. The entire image is visible, centered, and letterboxed if aspect ratios differ.
    - `'stretch'`: Scales the image non-uniformly to match the frame's width and height exactly. The aspect ratio is not preserved.
    - (The API documentation mentions `center` as well, which would center the image within the frame without scaling if it's smaller, or clip it if it's larger.)

- **`onLoad?: (metrics: { width: number; height: number }) => void`**

  - Callback invoked when the image has successfully loaded. It receives an object with the image's natural `width` and `height`.

- **`onError?: (error: ErrorEvent) => void`** (or a more generic error type)

  - Callback invoked if an error occurs during image loading.

- **Inherited `NodeProps`:**
  - `onTouchStart`, `onTouchMove`, `onTouchEnd`
  - `onLayout`
  - `pointerEvents`
  - `cache`, `forceCache` (Caching an image is generally useful once loaded)

The `<Image>` component orchestrates asynchronous loading with rendering, providing a declarative way to include images in a Revas UI. The `$ready` mechanism is key for integrating with Revas's caching and rendering lifecycle.

<!-- AI-CONTEXT-END -->
