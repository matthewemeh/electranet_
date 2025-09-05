import { isEmpty } from 'lodash';
import { Refresh } from '@mui/icons-material';
import { useSearchParams } from 'react-router-dom';
import { useEffect, useMemo, useState } from 'react';
import { IoIosArrowRoundUp, IoIosArrowRoundDown } from 'react-icons/io';
import {
  Paper,
  Table,
  Button,
  TableRow,
  TableBody,
  TableCell,
  TableHead,
  TableContainer,
  TablePagination,
  type TableCellProps,
} from '@mui/material';

import { useGetResultsQuery } from '../../services/apis/resultApi';
import { useHandleReduxQueryError } from '../../hooks/useHandleReduxQuery';
import {
  EmptyList,
  ResultTab,
  LoadingPaper,
  FilterButton,
  ResultFilters,
  TablePaginationActions,
} from '../../components';

export interface Column extends TableCellProps {
  label: string;
  maxWidth?: number;
  minWidth?: number;
  id: keyof ResultData;
  format?: (value: number) => string;
}

const Results = () => {
  const columns: readonly Column[] = [
    { id: 'election', label: 'Election Name', maxWidth: 170 },
    { id: 'updatedAt', label: 'Last updated at', minWidth: 50 },
    {
      minWidth: 100,
      id: 'totalVotes',
      label: 'Total Votes',
      format: (value: number) => value.toLocaleString(),
    },
  ];

  const [searchParams, setSearchParams] = useSearchParams();

  const queryParams = useMemo(() => {
    const params: Record<string, string> = {};
    for (const [key, value] of searchParams.entries()) {
      params[key] = value;
    }
    return params;
  }, [searchParams]);

  const [page, setPage] = useState(1);
  const [sortBy, setSortBy] = useState({});
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [isFiltersOn, setIsFiltersOn] = useState(false);
  const [filterAlertOpen, setFilterAlertOpen] = useState(false);
  const [filters, setFilters] = useState<GetResultsPayload['params']>({});
  const {
    refetch,
    data: getData,
    error: getError,
    isError: isGetError,
    isLoading: isGetLoading,
  } = useGetResultsQuery({
    params: {
      page,
      limit: rowsPerPage,
      sortBy: JSON.stringify(isEmpty(sortBy) ? { createdAt: -1 } : sortBy),
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
        emptyText='No results found'
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
        <Table stickyHeader aria-label='results' className='relative'>
          <TableHead>
            <TableRow role='row'>
              {columns.map(({ id, label, align, minWidth, maxWidth }) => {
                const isSortDisabled = id === 'election' || id === 'totalVotes' || isGetLoading;

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
              <TableCell role='columnheader' style={{ minWidth: 10, maxWidth: 120 }} />
            </TableRow>
          </TableHead>

          <TableBody>
            {getData.data.docs.map(result => (
              <ResultTab columns={columns} key={result._id} result={result} />
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <FilterButton
        isFiltersOn={isFiltersOn}
        onClick={handleFilterClick}
        extraContainerClass='!left-5'
      />

      <ResultFilters open={filterAlertOpen} setFilters={setFilters} setOpen={setFilterAlertOpen} />

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
    </Paper>
  );
};

export default Results;
