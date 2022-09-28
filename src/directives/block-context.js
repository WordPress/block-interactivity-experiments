import { createContext } from 'preact';

// Single context reused by all providers.
const blockContext = createContext({});
blockContext.displayName = 'BlockContext';

export default blockContext;
