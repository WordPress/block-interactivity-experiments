import { registerBlockType } from '@wordpress/blocks';

const Edit = () => <div>Favorites blocks</div>;

registerBlockType('test/test', {
	edit: Edit,
	save: () => (
		<wp-context data='{"post": { "id": 123 } }'>
			<button wp-on:click="actions.favorites.togglePost">
				toogle post 123
			</button>
		</wp-context>
	),
});
