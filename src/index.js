import "./editor.scss";
import "./style.scss";
import { registerBlockType } from "@wordpress/blocks";
import Edit from "./edit";
import Save from "./save";

registerBlockType("luisherranz/block-hydration-experiments", {
  edit: Edit,
  save: Save,
});
