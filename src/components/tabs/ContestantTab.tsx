import { FaCircleInfo } from 'react-icons/fa6';
import { useNavigate } from 'react-router-dom';
import { Avatar, Tooltip, TableRow, TableCell, IconButton } from '@mui/material';
import { DriveFileRenameOutline, DeleteOutline, SettingsBackupRestore } from '@mui/icons-material';

import { PATHS } from '../../routes/PathConstants';
import { type Column } from '../../pages/contestants';
import { useUpdateContestantMutation } from '../../services/apis/contestantApi';
import {
  useHandleReduxQueryError,
  useHandleReduxQuerySuccess,
} from '../../hooks/useHandleReduxQuery';

interface Props {
  contestant: Contestant;
  columns: readonly Column[];
  onInfoClick: (contestant: Contestant) => void;
}

const ContestantTab: React.FC<Props> = ({ contestant, columns, onInfoClick }) => {
  const navigate = useNavigate();

  const [
    updateContestant,
    {
      originalArgs,
      data: updateData,
      error: updateError,
      isError: isUpdateError,
      isLoading: isUpdateLoading,
      isSuccess: isUpdateSuccess,
    },
  ] = useUpdateContestantMutation();

  const navigateEditPage = () => {
    localStorage.setItem('contestantToUpdate', JSON.stringify(contestant));
    navigate(PATHS.CONTESTANTS.EDIT);
  };

  const handleDelete = () => updateContestant({ id: contestant._id, isDeleted: true });

  const handleRestore = () => updateContestant({ id: contestant._id, isDeleted: false });

  useHandleReduxQuerySuccess({ response: updateData, isSuccess: isUpdateSuccess });
  useHandleReduxQueryError({
    error: updateError,
    isError: isUpdateError,
    refetch: () => {
      if (originalArgs) updateContestant(originalArgs);
    },
  });

  return (
    <TableRow hover role='row' tabIndex={-1}>
      {columns.map(({ align, id, minWidth, maxWidth }) => {
        let value: React.ReactNode;

        if (id === 'fullName') {
          value = `${contestant.lastName} ${contestant.firstName}`;
        } else if (id === 'party') {
          value = contestant.party ? (
            <span className='party'>
              <img
                className='party__img'
                src={contestant.party.logoUrl}
                alt={contestant.party.longName}
              />
              <span>{contestant.party.shortName}</span>
            </span>
          ) : (
            'Unavailable'
          );
        } else if (id === 'profileImageUrl') {
          value = <Avatar className='avatar-image' src={contestant.profileImageUrl} />;
        } else {
          value = contestant[id] || 'Unavailable';
        }

        return (
          <TableCell key={id} role='cell' align={align} style={{ minWidth, maxWidth }}>
            {value}
          </TableCell>
        );
      })}

      <TableCell role='cell' style={{ minWidth: 10 }}>
        <Tooltip title='Edit Contestant details'>
          <IconButton aria-label='edit' className='cursor-pointer' onClick={navigateEditPage}>
            <DriveFileRenameOutline />
          </IconButton>
        </Tooltip>
      </TableCell>

      <TableCell role='cell' style={{ minWidth: 10 }}>
        <Tooltip
          title={
            contestant.isDeleted
              ? isUpdateLoading
                ? 'Restoring Contestant'
                : 'Restore Contestant'
              : isUpdateLoading
              ? 'Deleting Contestant'
              : 'Delete Contestant'
          }
        >
          <span>
            <IconButton
              aria-label='delete'
              disabled={isUpdateLoading}
              className='disabled:!cursor-not-allowed'
              onClick={contestant.isDeleted ? handleRestore : handleDelete}
            >
              {contestant.isDeleted ? <SettingsBackupRestore /> : <DeleteOutline />}
            </IconButton>
          </span>
        </Tooltip>
      </TableCell>

      <TableCell role='cell' style={{ minWidth: 10 }}>
        <Tooltip className='cursor-pointer' title='View Full Contestant details'>
          <FaCircleInfo className='text-primary-500' onClick={() => onInfoClick(contestant)} />
        </Tooltip>
      </TableCell>
    </TableRow>
  );
};

export default ContestantTab;
