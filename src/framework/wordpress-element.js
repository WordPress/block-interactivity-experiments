import {
  useState as useReactState,
  useEffect as useReactEffect,
  useContext as useReactContext,
  createContext,
} from "@wordpress/element";
export { hydrate } from "react-dom";

export const EnvContext = createContext(null);

/**
 * A React hook that returns the name of the environment.
 *
 * This is still a bit hacky. Ideally, Save components should support React
 * hooks and all the environments (Edit, Save and Frontend) should populate a
 * normal context. Also, more environments could be added in the future.
 *
 * @returns {"edit" | "save" | "frontend"}
 */
export const useBlockEnvironment = () => {
  try {
    const env = useReactContext(EnvContext);
    if (env === "frontend") return "frontend";
    return "edit";
  } catch (e) {
    return "save";
  }
};

const noop = () => {};

export const useState = (init) =>
  useBlockEnvironment() !== "save" ? useReactState(init) : [init, noop];

export const useEffect = (...args) =>
  useBlockEnvironment() !== "save" ? useReactEffect(...args) : noop;
