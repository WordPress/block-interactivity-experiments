<div wp-effect:restore="actions.favorites.restore" wp-effect:save="actions.favorites.save">
    <img 
        class="emoji"
        alt=":heart:"
        src="https://s.w.org/images/core/emoji/14.0.0/svg/1f90d.svg"
        wp-bind:src="selectors.favorites.isFavoritePostsEmpty"
    />
    <span
        wp-bind:children="state.favorites.count"
    >
    0
    </span>
</div>