import Frontend from "../../frontend";
import { registerBlockType } from "../../gutenberg-packages/wordpress-blocks";
import Edit from "./edit";
import "./style.scss";

registerBlockType("luisherranz/block-hydration-experiments-parent", {
  edit: Edit,
  // The Save component is derived from the Frontend component.
  frontend: Frontend,
});
