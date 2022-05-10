import {
  createContext,
  useContext as useReactContext,
  useEffect as useReactEffect,
  useState as useReactState,
} from "@wordpress/element";
import { hydrate as ReactHydrate } from "react-dom";

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

export const hydrate = (container, element, technique) => {
  switch (technique) {
    case "view":
      const io = new IntersectionObserver((entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          // As soon as we hydrate, disconnect this IntersectionObserver.
          io.disconnect();
          ReactHydrate(container, element);
          break; // break loop on first match
        }
      });
      io.observe(element.children[0]);
      break;
    case "idle":
      if ("requestIdleCallback" in window) {
        window.requestIdleCallback(() => ReactHydrate(container, element));
      } else {
        setTimeout(ReactHydrate(container, element), 200);
      }
      break;
    default:
      ReactHydrate(container, element);
  }
};
