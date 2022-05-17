import Edit from "./edit";
import "./editor.scss";
import Frontend from "./frontend";
import { registerBlockType } from "./gutenberg-packages/wordpress-blocks";
import "./style.scss";

registerBlockType( "luisherranz/block-hydration-experiments", {
  edit: Edit,
  // The Save component is derived from the Frontend component.
  frontend: Frontend,
} );
