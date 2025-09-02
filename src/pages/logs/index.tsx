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

import { isEmptyObject } from '../../utils';
import { useGetLogsQuery } from '../../services/apis/logApi';
import { useHandleReduxQueryError } from '../../hooks/useHandleReduxQuery';
import {
  LogTab,
  EmptyList,
  InfoButton,
  LogFilters,
  AlertDialog,
  FilterButton,
  LoadingPaper,
  TablePaginationActions,
} from '../../components';

export interface Column extends TableCellProps {
  label: string;
  maxWidth?: number;
  minWidth?: number;
  format?: (value: number) => string;
  id: keyof Log | 'fullName' | 'email';
}

const Logs = () => {
  const columns: readonly Column[] = [
    { id: 'action', label: 'Action', minWidth: 170 },
    { id: 'fullName', label: 'Admin Full Name', minWidth: 200 },
    { id: 'email', label: 'Email', minWidth: 170 },
    { id: 'createdAt', label: 'Date', minWidth: 170 },
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
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [sortBy, setSortBy] = useState({});
  const [alertOpen, setAlertOpen] = useState(false);
  const [isFiltersOn, setIsFiltersOn] = useState(false);
  const [filterAlertOpen, setFilterAlertOpen] = useState(false);
  const [selectedLog, setSelectedLog] = useState<Log | null>(null);
  const [filters, setFilters] = useState<GetLogsPayload['params']>({});
  const {
    refetch,
    data: getData,
    error: getError,
    isError: isGetError,
    isLoading: isGetLoading,
  } = useGetLogsQuery({
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

  const handleInfoClick = (log: Log) => {
    setSelectedLog(log);
    setAlertOpen(true);
  };

  const handleFilterClick = () => setFilterAlertOpen(true);

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
  } else if (!getData || getData.data.totalDocs === 0) {
    return (
      <EmptyList
        emptyText='No logs found'
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
        <Table stickyHeader aria-label='logs' className='relative'>
          <TableHead>
            <TableRow role='row'>
              {columns.map(({ id, label, align, minWidth, maxWidth }) => {
                const isSortDisabled = id !== 'createdAt' || isGetLoading;

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
                    <IoIosArrowRoundUp className={`sort-up ${isGetLoading && '!hidden'}`} />
                    <IoIosArrowRoundDown className={`sort-down ${isGetLoading && '!hidden'}`} />
                  </TableCell>
                );
              })}
              <TableCell role='columnheader' style={{ minWidth: 10 }} />
            </TableRow>
          </TableHead>

          <TableBody>
            {getData.data.docs.map(log => (
              <LogTab
                log={log}
                key={log._id}
                columns={columns}
                onInfoClick={log => handleInfoClick(log)}
              />
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <InfoButton title='Logs shown here are less than 30 days old. Older logs (if any) have been deleted' />

      <FilterButton isFiltersOn={isFiltersOn} onClick={handleFilterClick} />

      <LogFilters open={filterAlertOpen} setFilters={setFilters} setOpen={setFilterAlertOpen} />

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
        dialogTitle='Log Details'
        dialogContent={dialogContent}
      />
    </Paper>
  );
};

export default Logs;
