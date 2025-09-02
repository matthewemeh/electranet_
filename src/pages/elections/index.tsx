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

import { isEmptyObject } from '../../utils';
import { PATHS } from '../../routes/PathConstants';
import { useGetElectionsQuery } from '../../services/apis/electionApi';
import { useHandleReduxQueryError } from '../../hooks/useHandleReduxQuery';
import {
  EmptyList,
  InfoButton,
  ElectionTab,
  LoadingPaper,
  FilterButton,
  ElectionFilters,
  TablePaginationActions,
} from '../../components';

export interface Column extends TableCellProps {
  label: string;
  maxWidth?: number;
  minWidth?: number;
  id: keyof Election;
  format?: (value: number) => string;
}

const Elections = () => {
  const columns: readonly Column[] = [
    { id: 'name', label: 'Election Name', maxWidth: 170 },
    { id: 'delimitationCode', label: 'Delimitation', minWidth: 20 },
    { id: 'startTime', label: 'Start Time', minWidth: 30 },
    { id: 'endTime', label: 'End Time', minWidth: 30 },
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
  const [isFiltersOn, setIsFiltersOn] = useState(false);
  const [filterAlertOpen, setFilterAlertOpen] = useState(false);
  const [filters, setFilters] = useState<GetElectionsPayload['params']>({});
  const {
    refetch,
    data: getData,
    error: getError,
    isError: isGetError,
    isLoading: isGetLoading,
  } = useGetElectionsQuery({
    params: {
      page,
      limit: rowsPerPage,
      sortBy: JSON.stringify(isEmptyObject(sortBy) ? { createdAt: -1 } : sortBy),
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

  const handleFilterClick = () => setFilterAlertOpen(true);

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

  useEffect(() => {
    setPage(1);
    if (isEmptyObject(filters as object)) {
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
        url={PATHS.ELECTIONS.ADD}
        addText='Add new election'
        emptyText='No elections found'
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
        <Table stickyHeader aria-label='elections' className='relative'>
          <TableHead>
            <TableRow role='row'>
              {columns.map(({ id, label, align, minWidth, maxWidth }) => {
                const isSortDisabled = isGetLoading;

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
            {getData.data.docs.map(election => (
              <ElectionTab columns={columns} key={election._id} election={election} />
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <InfoButton title="Elections' information takes about 5 minutes to reflect any changes you make" />

      <FilterButton isFiltersOn={isFiltersOn} onClick={handleFilterClick} />

      <ElectionFilters
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

      <Tooltip
        title='Add more elections'
        className={`add-fab ${getData.data.totalDocs === 0 && '!hidden'}`}
      >
        <Fab
          color='primary'
          aria-label='add more elections'
          onClick={() => navigate(PATHS.ELECTIONS.ADD)}
        >
          <Add />
        </Fab>
      </Tooltip>
    </Paper>
  );
};

export default Elections;
