import { Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { AddCircleOutline } from '@mui/icons-material';

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
  const navigate = useNavigate();

  return (
    <div className='w-full h-[calc(100dvh-100px)] flex flex-col items-center justify-center gap-5'>
      {emptyIcon}
      <p className='text-xl font-medium'>{emptyText}</p>
      {addComponent || (
        <Button variant='contained' startIcon={<AddCircleOutline />} onClick={() => navigate(url)}>
          {addText}
        </Button>
      )}
    </div>
  );
};

export default EmptyList;
