import { forwardRef } from 'react';
import { Link, LinkProps } from 'react-router-dom';

const CustomLink = forwardRef<HTMLAnchorElement, LinkProps>((props, ref) => (
  <Link ref={ref} {...props} />
));

export default CustomLink;
