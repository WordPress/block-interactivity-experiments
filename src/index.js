import { registerBlockType } from "@wordpress/blocks";
import "./editor.scss";
import Edit from "./edit";
import Save from "./save";

registerBlockType("luisherranz/block-hydration-experiments", {
  edit: Edit,
  save: Save,
});
