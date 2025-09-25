import type { PopupOptions } from "maplibre-gl";
import type { PopupEvent } from "react-map-gl";

/**
 * Props for the Popup component.
 */
export type PopupAnimationProps = PopupOptions & {
  /** Longitude coordinate for the popup position (required). */
  longitude: number;
  /** Latitude coordinate for the popup position (required). */
  latitude: number;
  /** Optional custom CSS styles for the popup container. */
  style?: React.CSSProperties;
  /** Optional callback fired when the popup opens. */
  onOpen?: (e: PopupEvent) => void;
  /** Optional callback fired when the popup closes. */
  onClose?: (e: PopupEvent) => void;
  /** Optional React node(s) to render inside the popup. */
  children?: React.ReactNode;
};