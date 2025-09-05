import moment from 'moment';
import { useNavigate } from 'react-router-dom';
import { Tooltip, TableRow, TableCell, Button } from '@mui/material';

import { type Column } from '../../pages/results';
import { PATHS } from '../../routes/PathConstants';

interface Props {
  result: ResultData;
  columns: readonly Column[];
}

const ResultTab: React.FC<Props> = ({ result, columns }) => {
  const navigate = useNavigate();

  const navigateElectionResultPage = () => {
    navigate(PATHS.RESULTS.RESULT.replace(':id', result.election._id));
  };

  return (
    <TableRow hover role='row' tabIndex={-1}>
      {columns.map(({ align, id, minWidth, maxWidth, format }) => {
        let value: React.ReactNode;

        if (format) {
          value = format(result.totalVotes);
        } else if (id === 'election') {
          value = result.election.name;
        } else if (id === 'updatedAt') {
          value = moment(result.updatedAt).format('lll');
        }

        return (
          <TableCell key={id} role='cell' align={align} style={{ minWidth, maxWidth }}>
            {value}
          </TableCell>
        );
      })}

      <TableCell role='cell' style={{ minWidth: 10, maxWidth: 120 }}>
        <Tooltip title='View Election result'>
          <Button
            variant='outlined'
            aria-label='check result'
            className='cursor-pointer'
            onClick={navigateElectionResultPage}
          >
            Result
          </Button>
        </Tooltip>
      </TableCell>
    </TableRow>
  );
};

export default ResultTab;
