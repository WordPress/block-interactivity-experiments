import wpx from '../../runtime/wpx';

wpx({
	state: {
		favorites: {
			posts: [],
		},
	},
	actions: {
		favorites: {
			togglePost: ({ state, context }) => {
				const index = state.favorites.posts.findIndex(
					(post) => post === context.post.id
				);
				if (index === -1) state.favorites.posts.push(context.post.id);
				else state.favorites.posts.splice(index, 1);
			},
		},
	},
});
