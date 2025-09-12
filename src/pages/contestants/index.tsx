import { isEmpty } from 'lodash';
import { Add, Refresh } from '@mui/icons-material';
import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { IoIosArrowRoundUp, IoIosArrowRoundDown } from 'react-icons/io';
import {
  Fab,
  Paper,
  Table,
  Button,
  Tooltip,
  TableRow,
  TableBody,
  TableCell,
  TableHead,
  TableContainer,
  TablePagination,
  type TableCellProps,
} from '@mui/material';

import { PATHS } from '../../routes/PathConstants';
import { useGetContestantsQuery } from '../../services/apis/contestantApi';
import { useHandleReduxQueryError } from '../../hooks/useHandleReduxQuery';
import {
  EmptyList,
  InfoButton,
  AlertDialog,
  LoadingPaper,
  FilterButton,
  ContestantTab,
  ContestantFilters,
  TablePaginationActions,
} from '../../components';

export interface Column extends TableCellProps {
  label: string;
  maxWidth?: number;
  minWidth?: number;
  id: keyof Contestant | 'fullName';
  format?: (value: number) => string;
}

const Contestants = () => {
  const columns: readonly Column[] = [
    { id: 'profileImageUrl', label: '', maxWidth: 50 },
    { id: 'fullName', label: 'Full Name', minWidth: 170 },
    { id: 'gender', label: 'Gender', minWidth: 10 },
    { id: 'stateOfOrigin', label: 'State of Origin', minWidth: 10 },
    { id: 'party', label: 'Party', minWidth: 10 },
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
  const [isFiltersOn, setIsFiltersOn] = useState(false);
  const [filterAlertOpen, setFilterAlertOpen] = useState(false);
  const [filters, setFilters] = useState<GetContestantsPayload['params']>({});
  const [selectedContestant, setSelectedContestant] = useState<Contestant | null>(null);
  const {
    refetch,
    data: getData,
    error: getError,
    isError: isGetError,
    isLoading: isGetLoading,
  } = useGetContestantsQuery({
    params: {
      page,
      limit: rowsPerPage,
      sortBy: JSON.stringify(isEmpty(sortBy) ? { lastName: 1 } : sortBy),
      ...filters,
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

  const handleInfoClick = (contestant: Contestant) => {
    setSelectedContestant(contestant);
    setAlertOpen(true);
  };

  const handleFilterClick = () => setFilterAlertOpen(true);

  const dialogContent: React.ReactNode = useMemo(() => {
    if (!selectedContestant) return <></>;

    const { gender, lastName, firstName, middleName, party, stateOfOrigin } = selectedContestant;

    return (
      <div className='grid grid-cols-[40%_60%] gap-2'>
        <p className='card-info__tag'>Name</p>
        <p className='card-info__text capitalize'>
          {lastName} {firstName} {middleName}
        </p>

        <p className='card-info__tag'>Party</p>
        <div className='card-info__text capitalize'>
          {party ? (
            <div className='party'>
              <img src={party.logoUrl} alt={party.longName} className='party__img !rounded' />
              <span>{party.longName}</span>
            </div>
          ) : (
            'Unavailable'
          )}
        </div>

        <p className='card-info__tag'>Gender</p>
        <p className='card-info__text capitalize'>{gender.toLowerCase()}</p>

        <p className='card-info__tag'>State of Origin</p>
        <p className='card-info__text capitalize'>{stateOfOrigin || 'Unavailable'}</p>
      </div>
    );
  }, [selectedContestant]);

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
          if (id === 'fullName') {
            // @ts-ignore
            delete newSortBy['lastName'];
          } else {
            // @ts-ignore
            delete newSortBy[id];
          }

          return newSortBy;
        });
      } else {
        setSortBy(prevSortBy => {
          if (id === 'fullName') {
            return { ...prevSortBy, lastName: newSort };
          }

          return { ...prevSortBy, [id]: newSort };
        });
      }
    };
  };

  useEffect(() => {
    setPage(1);
    if (isEmpty(filters as object)) {
      setIsFiltersOn(false);
    } else {
      setIsFiltersOn(true);

      // clear any existing search params
      if (searchParams.size > 0) setSearchParams({});
    }
  }, [filters]);

  useHandleReduxQueryError({ isError: isGetError, error: getError, refetch });

  if (isGetLoading) {
    return <LoadingPaper />;
  } else if (!getData || getData.data.totalDocs === 0) {
    return (
      <EmptyList
        url={PATHS.CONTESTANTS.ADD}
        addText='Add new contestant'
        emptyText='No contestants found'
        addComponent={
          isFiltersOn && (
            <div className='flex items-center gap-2'>
              Empty filtered results?
              <Button variant='contained' startIcon={<Refresh />} onClick={() => setFilters({})}>
                Reset Filters
              </Button>
            </div>
          )
        }
      />
    );
  }

  return (
    <Paper className='table-wrapper'>
      <TableContainer className='rounded-3xl'>
        <Table stickyHeader aria-label='contestants' className='relative'>
          <TableHead>
            <TableRow role='row'>
              {columns.map(({ id, label, align, minWidth, maxWidth }) => {
                const isSortDisabled = id === 'profileImageUrl' || id === 'party' || isGetLoading;

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
              <TableCell role='columnheader' style={{ minWidth: 10 }} />
            </TableRow>
          </TableHead>

          <TableBody>
            {getData.data.docs.map(contestant => (
              <ContestantTab
                columns={columns}
                key={contestant._id}
                contestant={contestant}
                onInfoClick={contestant => handleInfoClick(contestant)}
              />
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <InfoButton title="Contestants' information takes about 5 minutes to reflect any changes you make" />

      <FilterButton isFiltersOn={isFiltersOn} onClick={handleFilterClick} />

      <ContestantFilters
        open={filterAlertOpen}
        setFilters={setFilters}
        setOpen={setFilterAlertOpen}
      />

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
        dialogContent={dialogContent}
        dialogTitle='Contestant Details'
      />

      <Tooltip
        title='Add more contestants'
        className={`add-fab ${getData.data.totalDocs === 0 && '!hidden'}`}
      >
        <Fab
          color='primary'
          aria-label='add more contestants'
          onClick={() => navigate(PATHS.CONTESTANTS.ADD)}
        >
          <Add />
        </Fab>
      </Tooltip>
    </Paper>
  );
};

export default Contestants;
