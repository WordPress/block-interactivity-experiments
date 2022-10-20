let previousHref = window.location.href;

export const startTransition = async (href, updateDomCallback, scroll) => {
	if (!document.createDocumentTransition) {
		updateDomCallback();

		// Update the scroll, depending on the option. True by default.
		if (scroll === 'smooth') {
			window.scrollTo({
				top: 0,
				left: 0,
				behavior: 'smooth',
			});
		} else if (scroll !== false) {
			window.scrollTo(0, 0);
		}

		return;
	}

	// Transition types:

	// Small to big:
	// From movies to movie
	// From actors to actor
	// From movie to actor

	// Big to small:
	// From movie to movies
	// From actor to actors

	const previousPathname = new URL(previousHref, window.location.href)
		.pathname;
	const isFromMovie = /^\/movies\/[\w-]+\/$/.test(previousPathname);
	const isFromMovies = /^\/(movies\/)?$/.test(previousPathname);
	const isFromActor = /^\/actors\/[\w-]+\/$/.test(previousPathname);
	const isFromActors = /^\/actors\/$/.test(previousPathname);

	const nextPathname = new URL(href, window.location.href).pathname;
	const isToMovie = /^\/movies\/[\w-]+\/$/.test(nextPathname);
	const isToMovies = /^\/(movies\/)?$/.test(nextPathname);
	const isToActor = /^\/actors\/[\w-]+\/$/.test(nextPathname);
	const isToActors = /^\/actors\/$/.test(nextPathname);

	// Select the element we are going to transition from.
	let initialPicture;

	// Small to big -> Initial picture is the small one.
	if (
		(isFromMovies && isToMovie) ||
		(isFromActors && isToActor) ||
		(isFromMovie && isToActor)
	) {
		initialPicture = document.querySelector(`a[href$="${href}"] > img`);
	}

	// Big to small -> Initial picture is the big one.
	else if ((isFromMovie && isToMovies) || (isFromActor && isToActors)) {
		initialPicture = document.querySelector(
			`.wp-block-post-featured-image > img`
		);
	}

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

			// Update the scroll, depending on the option. True by default.
			if (scroll === 'smooth') {
				window.scrollTo({
					top: 0,
					left: 0,
					behavior: 'smooth',
				});
			} else if (scroll !== false) {
				window.scrollTo(0, 0);
			}

			// Small to big -> final picture is the big one.
			if (
				(isFromMovies && isToMovie) ||
				(isFromActors && isToActor) ||
				(isFromMovie && isToActor)
			) {
				finalPicture = document.querySelector(
					`.wp-block-post-featured-image > img`
				);
			}

			// Big to small -> Final picture is the small one.
			if ((isFromMovie && isToMovies) || (isFromActor && isToActors)) {
				finalPicture = document.querySelector(
					`a[href$="${previousHref}"] > img`
				);
			}

			if (finalPicture) {
				finalPicture.style.pageTransitionTag = 'picture';
			}
		})
		.then(() => {
			if (finalPicture) {
				finalPicture.style.pageTransitionTag = '';
			}
			// Update previous URL. This works as long as we make a transition for each navigation.
			previousHref = href;
		});
};
