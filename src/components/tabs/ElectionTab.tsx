import moment from 'moment';
import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Tooltip, TableRow, TableCell, IconButton } from '@mui/material';
import { DriveFileRenameOutline, DeleteOutline, People } from '@mui/icons-material';

import AlertDialog from '../AlertDialog';
import { PATHS } from '../../routes/PathConstants';
import { type Column } from '../../pages/elections';
import { useDeleteElectionMutation } from '../../services/apis/electionApi';
import {
  useHandleReduxQueryError,
  useHandleReduxQuerySuccess,
} from '../../hooks/useHandleReduxQuery';

interface Props {
  election: Election;
  columns: readonly Column[];
}

const ElectionTab: React.FC<Props> = ({ election, columns }) => {
  const navigate = useNavigate();
  const [alertOpen, setAlertOpen] = useState(false);
  const hasElectionStarted = useMemo(() => Date.now() > new Date(election.startTime).getTime(), []);

  const [
    deleteElection,
    {
      originalArgs,
      data: deleteData,
      error: deleteError,
      isError: isDeleteError,
      isLoading: isDeleteLoading,
      isSuccess: isDeleteSuccess,
    },
  ] = useDeleteElectionMutation();

  const navigateEditPage = () => {
    localStorage.setItem('electionToUpdate', JSON.stringify(election));
    navigate(PATHS.ELECTIONS.EDIT);
  };

  const navigateEditContestantsPage = () => {
    sessionStorage.setItem('election', JSON.stringify(election));
    navigate(PATHS.ELECTIONS.CONTESTANTS);
  };

  const handleDelete = () => setAlertOpen(true);

  const handleDeleteAffirmation = () => deleteElection(election._id);

  useHandleReduxQuerySuccess({ response: deleteData, isSuccess: isDeleteSuccess });
  useHandleReduxQueryError({
    error: deleteError,
    isError: isDeleteError,
    refetch: () => {
      if (originalArgs) deleteElection(originalArgs);
    },
  });

  return (
    <TableRow hover role='row' tabIndex={-1}>
      {columns.map(({ align, id, minWidth, maxWidth }) => {
        let value: React.ReactNode;

        if (id === 'startTime' || id === 'endTime') {
          value = moment(election[id]).format('LLL');
        } else if (id === 'delimitationCode') {
          value = election.delimitationCode;
        } else {
          value = election[id] || 'Unavailable';
        }

        return (
          <TableCell key={id} role='cell' align={align} style={{ minWidth, maxWidth }}>
            {value}
          </TableCell>
        );
      })}

      <TableCell role='cell' style={{ minWidth: 10 }}>
        <Tooltip title='Edit Election details'>
          <IconButton aria-label='edit' className='cursor-pointer' onClick={navigateEditPage}>
            <DriveFileRenameOutline />
          </IconButton>
        </Tooltip>
      </TableCell>

      <TableCell role='cell' style={{ minWidth: 10 }}>
        <Tooltip title='View Election contestants'>
          <IconButton
            aria-label='edit'
            className='cursor-pointer'
            onClick={navigateEditContestantsPage}
          >
            <People />
          </IconButton>
        </Tooltip>
      </TableCell>

      <TableCell role='cell' style={{ minWidth: 10 }}>
        <Tooltip
          title={
            hasElectionStarted
              ? 'Cannot deleted commenced election'
              : isDeleteSuccess
              ? 'Election deleted'
              : isDeleteLoading
              ? 'Deleting Election'
              : 'Delete Election'
          }
        >
          <span>
            <IconButton
              aria-label='delete'
              onClick={handleDelete}
              className='disabled:!cursor-not-allowed'
              disabled={hasElectionStarted || isDeleteLoading || isDeleteSuccess}
            >
              <DeleteOutline />
            </IconButton>
          </span>
        </Tooltip>
      </TableCell>

      <AlertDialog
        open={alertOpen}
        setOpen={setAlertOpen}
        dialogTitle='Confirm Delete'
        onAffirmed={handleDeleteAffirmation}
        dialogContent={`Are you sure you want to delete ${election.name} ?`}
      />
    </TableRow>
  );
};

export default ElectionTab;
