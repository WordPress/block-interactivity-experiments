import "./editor.scss";
import "./style.scss";
import { registerBlockType } from "@wordpress/blocks";
import Edit from "./edit";
import save from "./framework/save";
import Block from "./frontend/block";

registerBlockType("luisherranz/block-hydration-experiments", {
  edit: Edit,
  save: save(Block),
});
