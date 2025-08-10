import { useMemo, useState } from 'react';
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

import { LogTab } from '../../components';
import type { Column } from '../logs/Logs';
import { PATHS } from '../../routes/PathConstants';
import { Loading, AlertDialog } from '../../components';
import { useGetLogsQuery } from '../../services/apis/logApi';
import {
  useHandleReduxQueryError,
  useHandleReduxQuerySuccess,
} from '../../hooks/useHandleReduxQuery';

const Dashboard = () => {
  const { LOGS } = PATHS;
  const columns: readonly Column[] = [
    { id: 'action', label: 'Action', minWidth: 170 },
    { id: 'fullName', label: 'Admin Full Name', minWidth: 200 },
    { id: 'email', label: 'Email', minWidth: 170 },
    { id: 'createdAt', label: 'Date', minWidth: 170 },
  ];

  const navigate = useNavigate();
  const [alertOpen, setAlertOpen] = useState(false);
  const [selectedLog, setSelectedLog] = useState<Log>();
  const { isError, error, isLoading, isSuccess, data, refetch } = useGetLogsQuery({});

  const goToLogsPage = () => navigate(LOGS);

  const handleInfoClick = (log: Log) => {
    setSelectedLog(log);
    setAlertOpen(true);
  };

  const dialogContent: React.ReactNode = useMemo(() => {
    if (!selectedLog) return '';

    const { message } = selectedLog;
    if (!message.includes('|')) return message;

    return (
      <>
        {message.split('|').map((content, index) => (
          <p key={index}>{content}</p>
        ))}
      </>
    );
  }, [selectedLog]);

  useHandleReduxQuerySuccess({ isSuccess, response: data, showSuccessMessage: false });
  useHandleReduxQueryError({ isError, error, refetch });

  return (
    <div className='pb-10'>
      <h1 className='mt-10 text-4xl font-medium mb-5'>Logs</h1>

      <section>
        {isLoading ? (
          <Loading />
        ) : !data || data.data.totalDocs === 0 ? (
          <Paper className='p-8 flex flex-col gap-2 items-center justify-center'>
            <Subject sx={{ fontSize: 60 }} />
            <p className='text-xl font-semibold'>No Logs found</p>
          </Paper>
        ) : (
          <Paper>
            <TableContainer className='rounded-3xl'>
              <Table stickyHeader aria-label='logs'>
                <TableHead>
                  <TableRow role='row'>
                    {columns.map(({ id, label, align, minWidth, maxWidth }) => (
                      <TableCell
                        role='columnheader'
                        key={id}
                        align={align}
                        style={{ minWidth, maxWidth }}
                      >
                        {label}
                      </TableCell>
                    ))}
                    <TableCell role='columnheader' style={{ minWidth: 5 }} />
                  </TableRow>
                </TableHead>

                <TableBody>
                  {data.data.docs.map(log => (
                    <LogTab
                      log={log}
                      key={log._id}
                      columns={columns}
                      onInfoClick={log => handleInfoClick(log)}
                    />
                  ))}
                </TableBody>

                <TableFooter className='w-full'>
                  <TableRow>
                    <TableCell colSpan={5}>
                      <Button
                        variant='contained'
                        onClick={goToLogsPage}
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

      <AlertDialog
        affirmationOnly
        open={alertOpen}
        setOpen={setAlertOpen}
        affirmativeText='Close'
        dialogContent={dialogContent}
        dialogTitle='Log Event Details'
        onClose={() => setSelectedLog(undefined)}
      />
    </div>
  );
};

export default Dashboard;
