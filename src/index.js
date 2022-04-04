import "./editor.scss";
import "./style.scss";
import { registerBlockType } from "./gutenberg-packages/wordpress-blocks";
import Edit from "./edit";
import Block from "./frontend"; // Save implementation derived from Frontend.

registerBlockType("luisherranz/block-hydration-experiments", {
  edit: Edit,
  frontend: Block,
});
