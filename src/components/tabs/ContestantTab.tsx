import { useMemo, useState } from 'react';
import { FaCircleInfo } from 'react-icons/fa6';
import { useNavigate } from 'react-router-dom';
import { Avatar, Tooltip, TableRow, TableCell, IconButton } from '@mui/material';
import {
  PersonAdd,
  PersonRemove,
  DeleteOutline,
  SettingsBackupRestore,
  DriveFileRenameOutline,
} from '@mui/icons-material';

import { PATHS } from '../../routes/PathConstants';
import { type Column } from '../../pages/contestants';
import { useUpdateContestantMutation } from '../../services/apis/contestantApi';
import {
  useAddElectionContestantMutation,
  useRemoveElectionContestantMutation,
} from '../../services/apis/electionApi';
import {
  useHandleReduxQueryError,
  useHandleReduxQuerySuccess,
} from '../../hooks/useHandleReduxQuery';

interface Props {
  isAdded?: boolean;
  contestant: Contestant;
  columns: readonly Column[];
  isElectionContestant?: boolean;
  onInfoClick?: (contestant: Contestant) => void;
}

const ContestantTab: React.FC<Props> = ({
  columns,
  isAdded,
  contestant,
  onInfoClick,
  isElectionContestant,
}) => {
  const navigate = useNavigate();
  const [isContestantAdded, setIsContestantAdded] = useState(isAdded);
  const election: Election = useMemo(
    () => JSON.parse(sessionStorage.getItem('election') ?? '{}'),
    []
  );
  const hasElectionStarted = useMemo(() => Date.now() > new Date(election.startTime).getTime(), []);

  const [
    updateContestant,
    {
      data: updateData,
      error: updateError,
      isError: isUpdateError,
      isLoading: isUpdateLoading,
      isSuccess: isUpdateSuccess,
      originalArgs: updateOriginalArgs,
    },
  ] = useUpdateContestantMutation();

  const [
    addElectionContestant,
    {
      data: addData,
      error: addError,
      isError: isAddError,
      isLoading: isAddLoading,
      isSuccess: isAddSuccess,
      originalArgs: addOriginalArgs,
    },
  ] = useAddElectionContestantMutation();

  const [
    removeElectionContestant,
    {
      data: removeData,
      error: removeError,
      isError: isRemoveError,
      isLoading: isRemoveLoading,
      isSuccess: isRemoveSuccess,
      originalArgs: removeOriginalArgs,
    },
  ] = useRemoveElectionContestantMutation();

  const navigateEditPage = () => {
    localStorage.setItem('contestantToUpdate', JSON.stringify(contestant));
    navigate(PATHS.CONTESTANTS.EDIT);
  };

  const handleDelete = () => updateContestant({ id: contestant._id, isDeleted: true });

  const handleRestore = () => updateContestant({ id: contestant._id, isDeleted: false });

  const handleRemoveContestant = () => {
    removeElectionContestant({ contestantID: contestant._id, electionID: election._id });
  };

  const handleAddContestant = () => {
    addElectionContestant({ contestantID: contestant._id, electionID: election._id });
  };

  useHandleReduxQuerySuccess({ response: updateData, isSuccess: isUpdateSuccess });
  useHandleReduxQueryError({
    error: updateError,
    isError: isUpdateError,
    refetch: () => {
      if (updateOriginalArgs) updateContestant(updateOriginalArgs);
    },
  });

  useHandleReduxQuerySuccess({
    response: addData,
    isSuccess: isAddSuccess,
    onSuccess: () => setIsContestantAdded(true),
  });
  useHandleReduxQueryError({
    error: addError,
    isError: isAddError,
    refetch: () => {
      if (addOriginalArgs) addElectionContestant(addOriginalArgs);
    },
  });

  useHandleReduxQuerySuccess({
    response: removeData,
    isSuccess: isRemoveSuccess,
    onSuccess: () => setIsContestantAdded(false),
  });
  useHandleReduxQueryError({
    error: removeError,
    isError: isRemoveError,
    refetch: () => {
      if (removeOriginalArgs) removeElectionContestant(removeOriginalArgs);
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
      {isElectionContestant ? (
        isContestantAdded ? (
          <TableCell role='cell' style={{ minWidth: 10 }}>
            <Tooltip
              title={
                hasElectionStarted
                  ? 'Cannot remove contestant from commenced election'
                  : `${isRemoveLoading ? 'Removing' : 'Remove'} Contestant from ${election.name}`
              }
            >
              <span>
                <IconButton
                  aria-label='remove'
                  onClick={handleRemoveContestant}
                  className='disabled:!cursor-not-allowed'
                  disabled={hasElectionStarted || isRemoveLoading}
                >
                  <PersonRemove />
                </IconButton>
              </span>
            </Tooltip>
          </TableCell>
        ) : (
          <TableCell role='cell' style={{ minWidth: 10 }}>
            <Tooltip
              title={
                hasElectionStarted
                  ? 'Cannot add contestant to commenced election'
                  : `${isAddLoading ? 'Adding' : 'Add'} Contestant to ${election.name}`
              }
            >
              <span>
                <IconButton
                  aria-label='add'
                  onClick={handleAddContestant}
                  className='disabled:!cursor-not-allowed'
                  disabled={hasElectionStarted || isAddLoading}
                >
                  <PersonAdd />
                </IconButton>
              </span>
            </Tooltip>
          </TableCell>
        )
      ) : (
        <>
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
              <FaCircleInfo
                className='text-primary-500'
                onClick={() => onInfoClick?.(contestant)}
              />
            </Tooltip>
          </TableCell>
        </>
      )}
    </TableRow>
  );
};

export default ContestantTab;
