import { useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { IoIosArrowRoundUp, IoIosArrowRoundDown } from 'react-icons/io';
import {
  Paper,
  Table,
  TableRow,
  TableBody,
  TableCell,
  TableHead,
  TableContainer,
  TablePagination,
  type TableCellProps,
} from '@mui/material';

import { isEmptyObject } from '../../utils';
import { useGetTokensQuery } from '../../services/apis/userApi';
import {
  useHandleReduxQueryError,
  useHandleReduxQuerySuccess,
} from '../../hooks/useHandleReduxQuery';
import {
  TokenTab,
  EmptyList,
  InfoButton,
  LoadingPaper,
  TablePaginationActions,
} from '../../components';

export interface Column extends TableCellProps {
  label: string;
  maxWidth?: number;
  minWidth?: number;
  format?: (value: number) => string;
  id: keyof AdminToken | 'fullName' | 'email' | 'rightsStatus';
}

const Tokens = () => {
  const columns: readonly Column[] = [
    { id: 'fullName', label: 'Admin Full Name', minWidth: 200 },
    { id: 'email', label: 'Email', minWidth: 150 },
    { id: 'rightsStatus', label: 'Rights Status', minWidth: 150 },
    { id: 'expiresAt', label: 'Expires At', minWidth: 150 },
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
  const {
    refetch,
    data: getData,
    error: getError,
    isError: isGetError,
    isLoading: isGetLoading,
    isSuccess: isGetSuccess,
  } = useGetTokensQuery({
    params: {
      page,
      limit: rowsPerPage,
      sortBy: JSON.stringify(isEmptyObject(sortBy) ? { createdAt: -1 } : sortBy),
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

  useHandleReduxQuerySuccess({
    response: getData,
    isSuccess: isGetSuccess,
    showSuccessMessage: false,
  });
  useHandleReduxQueryError({ isError: isGetError, error: getError, refetch });

  if (isGetLoading) {
    return <LoadingPaper />;
  } else if (!getData || getData.data.totalDocs === 0) {
    return <EmptyList addComponent={<></>} emptyText='No tokens found' />;
  }

  return (
    <Paper className='table-wrapper'>
      <TableContainer className='rounded-3xl'>
        <Table stickyHeader aria-label='logs' className='relative'>
          <TableHead>
            <TableRow role='row'>
              {columns.map(({ id, label, align, minWidth, maxWidth }) => (
                <TableCell
                  role='columnheader'
                  key={id}
                  data-sort='0'
                  align={align}
                  style={{ minWidth, maxWidth }}
                  className='!font-semibold !text-base'
                  onClick={handleSortClick(id, isGetLoading)}
                >
                  {label}
                  <IoIosArrowRoundUp
                    className={`sort-up w-5 h-5 inline-block ${isGetLoading && '!hidden'}`}
                  />
                  <IoIosArrowRoundDown
                    className={`sort-down w-5 h-5 inline-block ${isGetLoading && '!hidden'}`}
                  />
                </TableCell>
              ))}
              <TableCell role='columnheader' style={{ minWidth: 10 }} />
            </TableRow>
          </TableHead>

          <TableBody>
            {getData.data.docs.map(token => (
              <TokenTab
                token={token}
                key={token._id}
                columns={columns}
                onInviteSuccess={() => refetch()}
              />
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <InfoButton title="Tokens' information takes about 5 minutes to reflect any changes you make" />

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

export default Tokens;
