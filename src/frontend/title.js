import { RichText } from "../framework/wordpress-blockeditor";

const Title = ({ message, ...props }) => (
  <RichText tagName="h2" className="title" {...props}>
    {message}
  </RichText>
);

export default Title;
