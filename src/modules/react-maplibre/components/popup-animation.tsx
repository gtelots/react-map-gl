'use client';

import * as React from 'react';
import { createPortal } from 'react-dom';
import { useMap } from 'react-map-gl/maplibre';

import AnimatedPopup from '../lib/animated-popup';
import type { PopupAnimationProps } from '../types/common';
import { applyReactStyle } from '../../../utils/apply-react-style';
import { deepEqual } from '../../../utils/deep-equal';
import { compareClassNames } from '../../../utils/compare-class-names';

const defaultOptions = {
  maxWidth: '350px',
  anchor: 'bottom',
  closeButton: false,
  closeOnClick: true,
  closeOnMove: false,
  focusAfterOpen: true,
};

/**
 * PopupAnimation: Animated Mapbox popup with React content and a11y.
 * @param props PopupProps
 * @param ref Forwarded ref to AnimatedPopup instance
 */
const _PopupAnimation = React.forwardRef<AnimatedPopup, PopupAnimationProps>((props, ref) => {
  const map = useMap().current;
  const { longitude, latitude, style, children, onOpen, onClose, ...popupOptions } = props;

  const container = React.useMemo(() => document.createElement('div'), []);
  const propsRef = React.useRef<PopupAnimationProps>(props);

  const popup = React.useMemo(() => {
    const pp = new AnimatedPopup({ ...defaultOptions, ...popupOptions });
    pp.setLngLat([longitude, latitude]);
    pp.once('open', (e: any) => {
      propsRef.current.onOpen?.(e);
    });
    return pp;
  }, []);

  const handleClose = React.useCallback((e: any) => {
    propsRef.current.onClose?.(e);
  }, []);

  React.useEffect(() => {
    if (!map) {
      return;
    }
    popup.on('close', handleClose);
    popup.setDOMContent(container).addTo(map.getMap());
    return () => {
      popup.off('close', handleClose);
      if (popup.isOpen()) {
        popup.remove();
        propsRef.current.onClose?.({ target: popup as any, type: 'close' });
      }
    };
  }, [popup, map, container, handleClose]);

  React.useEffect(() => {
    applyReactStyle(popup.getElement()!, style || {});
  }, [style, popup]);

  React.useImperativeHandle(ref, () => popup, [popup]);

  if (popup.isOpen()) {
    const oldProps = propsRef.current;
    if (popup.getLngLat().lng !== longitude || popup.getLngLat().lat !== latitude) {
      popup.setLngLat([longitude, latitude]);
    }
    if (props.offset && !deepEqual(oldProps.offset, props.offset)) {
      popup.options.anchor = props.anchor;
      popup.setOffset(props.offset);
    }
    if (oldProps.anchor !== props.anchor || oldProps.maxWidth !== props.maxWidth) {
      popup.setMaxWidth(props.maxWidth!);
    }
    const classNameDiff = compareClassNames(oldProps.className, props.className);
    if (classNameDiff) {
      for (const c of classNameDiff) {
        popup.toggleClassName(c);
      }
    }
    propsRef.current = props;
  }

  return createPortal(children, container);
});

export const PopupAnimation = React.memo(_PopupAnimation);
