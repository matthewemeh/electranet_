import { AddCircleOutline } from '@mui/icons-material';

import LinkButton from './buttons/LinkButton';

export interface EmptyListProps {
  url?: string;
  addText?: string;
  emptyText: string;
  emptyIcon?: React.ReactNode;
  addComponent?: React.ReactNode;
}

const EmptyList: React.FC<EmptyListProps> = ({
  addText,
  emptyIcon,
  emptyText,
  url = '/',
  addComponent,
}) => {
  return (
    <div className='w-full h-[calc(100dvh-100px)] flex flex-col items-center justify-center gap-5'>
      {emptyIcon}
      <p className='text-xl font-medium'>{emptyText}</p>
      {addComponent ||
        (addText && (
          <LinkButton to={url} variant='contained' startIcon={<AddCircleOutline />}>
            {addText}
          </LinkButton>
        ))}
    </div>
  );
};

export default EmptyList;
