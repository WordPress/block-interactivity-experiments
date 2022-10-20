import wpx from '../../runtime/wpx';

wpx({
	state: {
		favorites: {
			posts: [],
			count: ({ state }) => state.favorites.posts.length,
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
			isPostIncluded: ({ state, context }) => {
				return state.favorites.posts.includes(context.post.id)
					? 'https://s.w.org/images/core/emoji/14.0.0/svg/2764.svg'
					: 'https://s.w.org/images/core/emoji/14.0.0/svg/1f90d.svg';
			},
			isFavoritePostsEmpty: ({ state }) => {
				debugger;
				return state.favorites.posts.length !== 0
					? 'https://s.w.org/images/core/emoji/14.0.0/svg/2764.svg'
					: 'https://s.w.org/images/core/emoji/14.0.0/svg/1f90d.svg';
			},
		},
	},
});
