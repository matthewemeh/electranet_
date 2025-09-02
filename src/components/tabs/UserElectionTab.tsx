import moment from 'moment';
import { useNavigate } from 'react-router-dom';
import { Tooltip, TableRow, TableCell, Button } from '@mui/material';

import { showAlert } from '../../utils';
import { PATHS } from '../../routes/PathConstants';
import { type Column } from '../../pages/elections';
import { useAppSelector } from '../../hooks/useRootStorage';

interface Props {
  election: Election;
  hasVoted?: boolean;
  columns: readonly Column[];
}

const UserElectionTab: React.FC<Props> = ({ election, columns, hasVoted }) => {
  const navigate = useNavigate();
  const { currentUser } = useAppSelector(state => state.authStore);

  const navigateElectionPage = () => {
    if (!currentUser.faceID) {
      showAlert({ msg: 'Please register your Face ID first' });
      navigate(PATHS.FACE_ID_REGISTER);
      return;
    }

    sessionStorage.setItem('election', JSON.stringify(election));
    navigate(PATHS.ELECTIONS.ELECTION.replace(':id', election._id));
  };

  const navigateElectionResultPage = () => {
    sessionStorage.setItem('election', JSON.stringify(election));
    navigate(PATHS.RESULTS.RESULT.replace(':id', election._id));
  };

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
        <Tooltip
          title={
            hasVoted
              ? 'You have already voted in this election'
              : election.hasEnded
              ? `Election ended ${moment(election.endTime).fromNow()}`
              : election.hasStarted
              ? 'Cast your vote'
              : `Election starts ${moment(election.startTime).fromNow()} from now`
          }
        >
          <span>
            <Button
              variant='contained'
              aria-label='cast vote'
              className='cursor-pointer'
              onClick={navigateElectionPage}
              disabled={hasVoted || !election.hasStarted || election.hasEnded}
            >
              Vote
            </Button>
          </span>
        </Tooltip>
      </TableCell>

      <TableCell role='cell' style={{ minWidth: 10 }}>
        <Tooltip
          title={
            election.hasStarted
              ? 'Check Election Results'
              : `Election starts ${moment(election.startTime).fromNow()} from now`
          }
        >
          <span>
            <Button
              variant='outlined'
              aria-label='check results'
              className='cursor-pointer'
              disabled={!election.hasStarted}
              onClick={navigateElectionResultPage}
            >
              Results
            </Button>
          </span>
        </Tooltip>
      </TableCell>
    </TableRow>
  );
};

export default UserElectionTab;
