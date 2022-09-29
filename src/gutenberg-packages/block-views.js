export default class BlockViews {
	#components = new Map();
	#resolvers = new Map();

	/**
	 * Set a Block component and resolve the associated Promise.
	 *
	 * @param {string} id The Block ID
	 * @param {Component} Component The Block component.
	 */
	set(id, Component) {
		// Views cannot be updated.
		if (this.#components.has(id)) return;

		// This component was not requested using `get` yet, so we can set a resolved Promise.
		if (!this.#resolvers.has(id)) {
			this.#components.set(id, Promise.resolve(Component));
		} else {
			// Resolve the current promise.
			this.#resolvers.get(id)(Component);
			this.#resolvers.delete(id);
		}
	}

	/**
	 * Return a Promise that resolves once the requested Block component exists.
	 *
	 * @param {string} id The Block ID.
	 * @returns A Promise with the component.
	 */
	get(id) {
		if (!this.#components.has(id)) {
			this.#components.set(
				id,
				new Promise((res) => this.#resolvers.set(id, res))
			);
		}
		return this.#components.get(id);
	}
}
