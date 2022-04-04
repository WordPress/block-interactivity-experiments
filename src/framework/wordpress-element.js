import {
  useState as useReactState,
  useEffect as useReactEffect,
} from "@wordpress/element";
export { hydrate } from "react-dom";

// Dirty dirty trick
export const isView = !window.wp.blockEditor;

const noop = () => {};

export const useState = (init) => (isView ? useReactState(init) : [init, noop]);

export const useEffect = (...args) => (isView ? useReactEffect(...args) : noop);
