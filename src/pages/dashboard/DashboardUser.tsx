import { Subject } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import {
  Paper,
  Table,
  Button,
  TableRow,
  TableBody,
  TableCell,
  TableHead,
  TableFooter,
  TableContainer,
} from '@mui/material';

import type { Column } from '../user-elections';
import { PATHS } from '../../routes/PathConstants';
import { UserElectionTab, Loading } from '../../components';
import { useGetUserElectionsQuery } from '../../services/apis/electionApi';
import { useHandleReduxQueryError } from '../../hooks/useHandleReduxQuery';

const Dashboard = () => {
  const { ELECTIONS } = PATHS;
  const columns: readonly Column[] = [
    { id: 'name', label: 'Election Name', maxWidth: 170 },
    { id: 'startTime', label: 'Starts at', minWidth: 30 },
    { id: 'endTime', label: 'Ends at', minWidth: 30 },
  ];

  const navigate = useNavigate();
  const { isError, error, isLoading, data, refetch } = useGetUserElectionsQuery({});

  const goToElectionsPage = () => navigate(ELECTIONS.FETCH);

  useHandleReduxQueryError({ isError, error, refetch });

  return (
    <div className='pb-10'>
      <h1 className='mt-10 text-4xl font-medium mb-5'>Your Elections</h1>

      <section>
        {isLoading ? (
          <Loading />
        ) : !data || data.data.totalDocs === 0 ? (
          <Paper className='p-8 flex flex-col gap-2 items-center justify-center'>
            <Subject sx={{ fontSize: 60 }} />
            <p className='text-xl font-semibold'>No Elections found</p>
          </Paper>
        ) : (
          <Paper>
            <TableContainer className='rounded-3xl'>
              <Table stickyHeader aria-label='elections'>
                <TableHead>
                  <TableRow role='row'>
                    {columns.map(({ id, label, align, minWidth, maxWidth }) => (
                      <TableCell
                        key={id}
                        align={align}
                        role='columnheader'
                        style={{ minWidth, maxWidth }}
                      >
                        {label}
                      </TableCell>
                    ))}
                    <TableCell role='columnheader' style={{ minWidth: 5 }} />
                    <TableCell role='columnheader' style={{ minWidth: 5 }} />
                  </TableRow>
                </TableHead>

                <TableBody>
                  {data.data.docs.map(election => (
                    <UserElectionTab key={election._id} election={election} columns={columns} />
                  ))}
                </TableBody>

                <TableFooter className='w-full'>
                  <TableRow>
                    <TableCell colSpan={5}>
                      <Button
                        variant='contained'
                        onClick={goToElectionsPage}
                        className='!block !ml-auto w-30'
                      >
                        see more
                      </Button>
                    </TableCell>
                  </TableRow>
                </TableFooter>
              </Table>
            </TableContainer>
          </Paper>
        )}
      </section>
    </div>
  );
};

export default Dashboard;
