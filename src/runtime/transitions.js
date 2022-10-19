let previousURL;

export const startTransition = async (url, updateDomCallback) => {
	if (!document.createDocumentTransition) {
		updateDomCallback();
		return;
	}

	const toSingle =
		/\/(movies|actors)\/\w+\//.test(url) || /\?(movies|actors)=/.test(url);

	// Select the element we are going to transition from.
	const initialPicture = toSingle
		? document.querySelector(`a[href$="${url}"] > img`)
		: document.querySelector(`.wp-block-post-featured-image > img`);

	if (initialPicture) {
		initialPicture.style.pageTransitionTag = 'picture';
	}

	const transition = document.createDocumentTransition();

	let finalPicture;
	await transition
		.start(() => {
			// Remove transition tag.
			if (initialPicture) {
				initialPicture.style.pageTransitionTag = '';
			}

			updateDomCallback();

			window.scrollTo(0, 0);

			// Select new element.
			finalPicture = toSingle
				? document.querySelector(`.wp-block-post-featured-image > img`)
				: document.querySelector(`a[href$="${previousURL}"] > img`);

			if (finalPicture) {
				finalPicture.style.pageTransitionTag = 'picture';
			}
		})
		.then(() => {
			if (finalPicture) {
				finalPicture.style.pageTransitionTag = '';
			}
			// Update previous URL. This works as long as we make a transition for each navigation.
			previousURL = url;
		});
};
