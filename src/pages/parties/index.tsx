import { Add } from '@mui/icons-material';
import { useMemo, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { IoIosArrowRoundUp, IoIosArrowRoundDown } from 'react-icons/io';
import {
  Fab,
  Paper,
  Table,
  Tooltip,
  TableRow,
  TableBody,
  TableCell,
  TableHead,
  TableContainer,
  TablePagination,
  type TableCellProps,
} from '@mui/material';

import { isEmptyObject } from '../../utils';
import { PATHS } from '../../routes/PathConstants';
import { useGetPartiesQuery } from '../../services/apis/partyApi';
import { useHandleReduxQueryError } from '../../hooks/useHandleReduxQuery';
import {
  PartyTab,
  EmptyList,
  InfoButton,
  AlertDialog,
  LoadingPaper,
  TablePaginationActions,
} from '../../components';

export interface Column extends TableCellProps {
  label: string;
  id: keyof Party;
  maxWidth?: number;
  minWidth?: number;
  format?: (value: number) => string;
}

const Parties = () => {
  const columns: readonly Column[] = [
    { id: 'logoUrl', label: '', maxWidth: 50 },
    { id: 'shortName', label: 'Party Alias', minWidth: 10 },
    { id: 'longName', label: 'Party Name', minWidth: 170 },
  ];

  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const queryParams = useMemo(() => {
    const params: Record<string, string> = {};
    for (const [key, value] of searchParams.entries()) {
      params[key] = value;
    }
    return params;
  }, [searchParams]);

  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [sortBy, setSortBy] = useState({});
  const [alertOpen, setAlertOpen] = useState(false);
  const [selectedParty, setSelectedParty] = useState<Party | null>(null);
  const {
    refetch,
    data: getData,
    error: getError,
    isError: isGetError,
    isLoading: isGetLoading,
  } = useGetPartiesQuery({
    params: {
      page,
      limit: rowsPerPage,
      sortBy: JSON.stringify(isEmptyObject(sortBy) ? { longName: 1 } : sortBy),
      ...queryParams,
    },
  });

  const handleRowsPerPageChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const newRowsPerPage = +event.target.value;
    setRowsPerPage(newRowsPerPage);
    setPage(1);
  };

  const handlePageChange = (_: React.MouseEvent<HTMLButtonElement> | null, newPage: number) => {
    setPage(newPage + 1);
  };

  const handleInfoClick = (party: Party) => {
    setSelectedParty(party);
    setAlertOpen(true);
  };

  const paginatedData = useMemo(() => {
    return getData as PaginatedResponse<Party> | undefined;
  }, [getData]);

  const dialogContent: React.ReactNode = useMemo(() => {
    if (!selectedParty) return <></>;

    const { logoUrl, longName, shortName, motto } = selectedParty;

    return (
      <div className='grid grid-cols-[40%_60%] gap-2'>
        <p className='card-info__tag'>Party Name</p>
        <p className='card-info__text capitalize'>{longName}</p>

        <p className='card-info__tag'>Party Alias</p>
        <p className='card-info__text capitalize'>{shortName}</p>

        <p className='card-info__tag'>Party Motto</p>
        <p className='card-info__text capitalize'>{motto ?? 'Unavailable'}</p>

        <p className='card-info__tag'>Party Logo</p>
        <div className='card-info__text capitalize'>
          <img src={logoUrl} alt={longName} className='party__img !rounded' />
        </div>
      </div>
    );
  }, [selectedParty]);

  const handleSortClick = (id: Column['id'], isSortDisabled: boolean) => {
    return (e: React.MouseEvent<HTMLTableCellElement>) => {
      if (isSortDisabled) return;

      if (searchParams.get('sortBy')) {
        const params: Record<string, string> = {};
        for (const [key, value] of searchParams.entries()) {
          if (key !== 'sortBy') {
            params[key] = value;
          }
        }
        setSearchParams(params);
      }

      const sorts = [0, 1, -1];

      const lastSortIndex = +e.currentTarget.dataset['sort']!;
      const newSortIndex = (lastSortIndex + 1) % sorts.length;
      e.currentTarget.dataset['sort'] = newSortIndex.toString();

      const newSort = sorts[newSortIndex];

      if (newSort === 0) {
        setSortBy(prevSortBy => {
          const newSortBy = { ...prevSortBy };
          // @ts-ignore
          delete newSortBy[id];

          return newSortBy;
        });
      } else {
        setSortBy(prevSortBy => ({ ...prevSortBy, [id]: newSort }));
      }
    };
  };

  useHandleReduxQueryError({ isError: isGetError, error: getError, refetch });

  if (isGetLoading) {
    return <LoadingPaper />;
  } else if (!paginatedData || paginatedData.data.totalDocs === 0) {
    return (
      <EmptyList url={PATHS.PARTIES.ADD} addText='Add new party' emptyText='No parties found' />
    );
  }

  return (
    <Paper className='table-wrapper'>
      <TableContainer className='rounded-3xl'>
        <Table stickyHeader aria-label='parties' className='relative'>
          <TableHead>
            <TableRow role='row'>
              {columns.map(({ id, label, align, minWidth, maxWidth }) => {
                const isSortDisabled = id === 'logoUrl' || isGetLoading;

                return (
                  <TableCell
                    key={id}
                    data-sort='0'
                    align={align}
                    role='columnheader'
                    style={{ minWidth, maxWidth }}
                    className='!font-semibold !text-base'
                    onClick={handleSortClick(id, isSortDisabled)}
                  >
                    {label}
                    <IoIosArrowRoundUp className={`sort-up ${isSortDisabled && '!hidden'}`} />
                    <IoIosArrowRoundDown className={`sort-down ${isSortDisabled && '!hidden'}`} />
                  </TableCell>
                );
              })}
              <TableCell role='columnheader' style={{ minWidth: 10 }} />
              <TableCell role='columnheader' style={{ minWidth: 10 }} />
            </TableRow>
          </TableHead>

          <TableBody>
            {paginatedData.data.docs.map(party => (
              <PartyTab
                party={party}
                key={party._id}
                columns={columns}
                onInfoClick={party => handleInfoClick(party)}
              />
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <InfoButton title="Parties' information takes about 5 minutes to reflect any changes you make" />

      <TablePagination
        component='div'
        rowsPerPage={rowsPerPage}
        onPageChange={handlePageChange}
        rowsPerPageOptions={[10, 25, 50]}
        page={paginatedData.data.page - 1}
        count={paginatedData.data.totalDocs}
        ActionsComponent={TablePaginationActions}
        onRowsPerPageChange={handleRowsPerPageChange}
      />

      <AlertDialog
        affirmationOnly
        open={alertOpen}
        setOpen={setAlertOpen}
        affirmativeText='Close'
        dialogTitle='Party Details'
        dialogContent={dialogContent}
      />

      <Tooltip
        title='Add more parties'
        className={`add-fab ${paginatedData.data.totalDocs === 0 && '!hidden'}`}
      >
        <Fab
          color='primary'
          aria-label='add more parties'
          onClick={() => navigate(PATHS.PARTIES.ADD)}
        >
          <Add />
        </Fab>
      </Tooltip>
    </Paper>
  );
};

export default Parties;
