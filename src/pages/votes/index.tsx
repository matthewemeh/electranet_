import { useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Paper, TablePagination } from '@mui/material';

import { useGetVotesQuery } from '../../services/apis/voteApi';
import { useHandleReduxQueryError } from '../../hooks/useHandleReduxQuery';
import {
  EmptyList,
  VoteBubble,
  AlertDialog,
  LoadingPaper,
  TablePaginationActions,
} from '../../components';
import moment from 'moment';

const Votes = () => {
  const { id } = useParams();
  const [page, setPage] = useState(1);
  const [alertOpen, setAlertOpen] = useState(false);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [voteData, setVoteData] = useState<VerifyVoteResponse['data']>();

  const handlePageChange = (_: React.MouseEvent<HTMLButtonElement> | null, newPage: number) => {
    setPage(newPage + 1);
  };

  const handleRowsPerPageChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const newRowsPerPage = +event.target.value;
    setRowsPerPage(newRowsPerPage);
    setPage(1);
  };

  const {
    refetch,
    data: getData,
    error: getError,
    isError: isGetError,
    isLoading: isGetLoading,
  } = useGetVotesQuery({
    id: id!,
    params: {
      page,
      limit: rowsPerPage,
    },
  });

  const handleVerifySuccess = (voteInfo: VerifyVoteResponse['data']) => {
    setVoteData(voteInfo);
    setAlertOpen(true);
  };

  useHandleReduxQueryError({ isError: isGetError, error: getError, refetch });

  const dialogContent: React.ReactNode = useMemo(() => {
    if (!voteData) return <></>;

    const { election, message, status, voteTimestamp } = voteData;

    return (
      <div className='grid grid-cols-[40%_60%] gap-2'>
        <p className='card-info__tag'>Election Name</p>
        <p className='card-info__text capitalize'>{election.name}</p>

        <p className='card-info__tag'>Election Delimitation Code</p>
        <p className='card-info__text'>{election.delimitationCode}</p>

        <p className='card-info__tag'>Vote Status</p>
        <p
          className={`card-info__text capitalize p-2 rounded-sm w-fit flex items-center gap-2 ${
            status === 'success' ? 'text-green-600 bg-green-200' : 'text-red-600 bg-red-200'
          }`}
        >
          <span
            className={`w-2 h-2 rounded-full ${
              status === 'success' ? 'bg-green-600' : 'bg-red-600'
            }`}
          />
          {status}
        </p>

        <p className='card-info__tag'>Message</p>
        <p className='card-info__text'>{message}</p>

        <p className='card-info__tag'>Timestamp</p>
        <p className='card-info__text'>{moment(voteTimestamp).format('lll')}</p>
      </div>
    );
  }, [voteData]);

  if (isGetLoading) {
    return <LoadingPaper />;
  } else if (!getData || getData.data.totalDocs === 0) {
    return <EmptyList emptyText='No votes found' />;
  }

  return (
    <Paper className='table-wrapper rounded max-[700px]:!grid-rows-[1fr_90px]'>
      <section className='relative pt-24 p-8 flex items-center flex-col gap-16 overflow-y-auto'>
        <header className='absolute top-4 left-8'>
          <h1 className='text-3xl font-bold'>Votes</h1>
          <p>You can verify any vote here</p>
        </header>
        {getData.data.docs.map(vote => (
          <VoteBubble key={vote._id} vote={vote} onVerifySuccess={handleVerifySuccess} />
        ))}
      </section>

      <TablePagination
        component='div'
        rowsPerPage={rowsPerPage}
        page={getData.data.page - 1}
        count={getData.data.totalDocs}
        onPageChange={handlePageChange}
        rowsPerPageOptions={[10, 25, 50]}
        ActionsComponent={TablePaginationActions}
        onRowsPerPageChange={handleRowsPerPageChange}
      />

      <AlertDialog
        affirmationOnly
        open={alertOpen}
        setOpen={setAlertOpen}
        affirmativeText='Close'
        dialogTitle='Vote Details'
        dialogContent={dialogContent}
        onClose={() => setVoteData(undefined)}
      />
    </Paper>
  );
};

export default Votes;
