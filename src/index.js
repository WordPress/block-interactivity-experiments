import Edit from "./edit";
import "./editor.scss";
import Block from "./frontend"; // Save implementation derived from Frontend.
import { registerBlockType } from "./gutenberg-packages/wordpress-blocks";
import "./style.scss";

registerBlockType("luisherranz/block-hydration-experiments", {
  edit: Edit,
  frontend: Block,
});
