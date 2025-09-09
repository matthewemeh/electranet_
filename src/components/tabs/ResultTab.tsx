import moment from 'moment';
import { Tooltip, TableRow, TableCell } from '@mui/material';

import LinkButton from '../buttons/LinkButton';
import { type Column } from '../../pages/results';
import { PATHS } from '../../routes/PathConstants';

interface Props {
  result: ResultData;
  columns: readonly Column[];
}

const ResultTab: React.FC<Props> = ({ result, columns }) => {
  const { election, totalVotes, updatedAt } = result;

  return (
    <TableRow hover role='row' tabIndex={-1}>
      {columns.map(({ align, id, minWidth, maxWidth, format }) => {
        let value: React.ReactNode;

        if (format) {
          value = format(totalVotes);
        } else if (id === 'election') {
          value = election.name;
        } else if (id === 'updatedAt') {
          value = moment(updatedAt).format('lll');
        }

        return (
          <TableCell key={id} role='cell' align={align} style={{ minWidth, maxWidth }}>
            {value}
          </TableCell>
        );
      })}

      <TableCell role='cell' style={{ minWidth: 10, maxWidth: 120 }}>
        <Tooltip title='View Election votes'>
          <LinkButton
            variant='contained'
            aria-label='check votes'
            className='cursor-pointer'
            to={PATHS.VOTES.FETCH.replace(':id', election._id)}
          >
            Votes
          </LinkButton>
        </Tooltip>
      </TableCell>

      <TableCell role='cell' style={{ minWidth: 10, maxWidth: 120 }}>
        <Tooltip title='View Election result'>
          <LinkButton
            variant='outlined'
            aria-label='check result'
            className='cursor-pointer'
            to={PATHS.RESULTS.RESULT.replace(':id', election._id)}
          >
            Result
          </LinkButton>
        </Tooltip>
      </TableCell>
    </TableRow>
  );
};

export default ResultTab;
