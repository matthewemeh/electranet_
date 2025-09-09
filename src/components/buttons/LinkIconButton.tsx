import { Link, type To } from 'react-router-dom';
import { IconButton, type ButtonOwnProps } from '@mui/material';

interface Props extends ButtonOwnProps {
  to: To;
  className?: string;
}

const LinkIconButton: React.FC<Props> = ({ to, ...props }) => {
  return <IconButton component={Link} to={to} {...props} />;
};

export default LinkIconButton;
