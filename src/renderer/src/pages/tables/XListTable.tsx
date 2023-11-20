/* eslint-disable react/jsx-key */
import { ReactNode, useCallback, useMemo, useState } from 'react';

// material-ui
import {
  Box,
  ClickAwayListener,
  Grid,
  IconButton,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Tooltip,
} from '@mui/material';

// third-party
import {
  Cell,
  CellProps,
  Column,
  HeaderGroup,
  Row,
  useBlockLayout,
  useFilters,
  usePagination,
  useResizeColumns,
  useSortBy,
  useTable,
} from 'react-table';

// assets
import { CardSend, Edit, Minus, MoreSquare, Trash } from 'iconsax-react';
import Swal from 'sweetalert2';
// project-imports
import MainCard from '../../components/MainCard';
import ScrollX from '../../components/ScrollX';
import { CSVExport, HeaderSort, TablePagination } from '../../components/third-party/ReactTable';
import { XAccountData } from '../../types/app';

import { RootState, dispatch, useSelector } from '../../store';
import { openSnackbar } from '../../store/reducers/snackbar';

import AddNewXAccountButton from '../../sections/xListTable/AddNewXAccoutButton';
import DialogXAccountForm from '../../sections/xListTable/DialogXAccountForm';

import { xAccountDefaultValue } from '../../sections/xListTable/XAccountEditor';
import { deleteXAccount } from '../../store/reducers/xAccountSlice';

export interface XListTableProps {
  data: XAccountData[];
}

// ==============================|| REACT TABLE ||============================== //

const ReactTable = ({
  columns,
  data,
  top,
}: {
  columns: Column[];
  data: XAccountData[];
  top?: boolean;
}) => {
  const defaultColumn = useMemo(
    () => ({
      minWidth: 150,
      width: 185,
      maxWidth: 400,
    }),
    []
  );

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    page,
    prepareRow,
    gotoPage,
    setPageSize,
    state: { pageIndex, pageSize },
  } = useTable(
    {
      columns,
      data,
      defaultColumn,
      initialState: {
        pageIndex: 0,
        pageSize: 10,
        sortBy: [
          {
            id: 'userName',
            desc: false,
          },
        ],
      },
    },
    useFilters,
    useSortBy,
    usePagination,
    useBlockLayout,
    useResizeColumns
  );

  const sortingRow = page.slice(0, page.length);
  const sortedData = sortingRow.map((d: Row) => d.original);
  Object.keys(sortedData).forEach(
    (key: string) => sortedData[Number(key)] === undefined && delete sortedData[Number(key)]
  );

  return (
    <Stack>
      {top && (
        <Box sx={{ p: 2 }}>
          <TablePagination
            gotoPage={gotoPage}
            rows={rows}
            setPageSize={setPageSize}
            pageIndex={pageIndex}
            pageSize={pageSize}
          />
        </Box>
      )}

      <Table {...getTableProps()}>
        <TableHead sx={{ borderTopWidth: top ? 2 : 1 }}>
          {headerGroups.map((headerGroup) => (
            <TableRow {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map((column: HeaderGroup) => (
                <TableCell
                  {...column.getHeaderProps([{ className: column.className }])}
                  sx={{ '&:hover::after': { bgcolor: 'primary.main', width: 2 } }}
                >
                  <Stack direction="row" alignItems="center" justifyContent="space-between">
                    <HeaderSort column={column} sort />
                    {/* column.render('Header') */}
                    <Box
                      {...column.getResizerProps()}
                      sx={{ position: 'absolute', right: -6, opacity: 0, zIndex: 1 }}
                    >
                      <Minus style={{ transform: 'rotate(90deg)' }} />
                    </Box>
                  </Stack>
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableHead>
        <TableBody {...getTableBodyProps()}>
          {sortingRow.map((row: Row) => {
            prepareRow(row);
            return (
              <TableRow {...row.getRowProps()}>
                {row.cells.map((cell: Cell) => (
                  <TableCell {...cell.getCellProps([{ className: cell.column.className }])}>
                    {cell.render('Cell')}
                  </TableCell>
                ))}
              </TableRow>
            );
          })}

          {!top && (
            <TableRow>
              <TableCell sx={{ p: 2 }} colSpan={7}>
                <TablePagination
                  gotoPage={gotoPage}
                  rows={rows}
                  setPageSize={setPageSize}
                  pageIndex={pageIndex}
                  pageSize={pageSize}
                />
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </Stack>
  );
};

// ==============================|| REACT TABLE - PAGINATION ||============================== //
type TooltipTitleProps = {
  loginProvider: string;
  loginProviderId: string;
  loginProviderPassword: string;
  remark: string;
};

const TooltipTitle = ({
  loginProvider,
  loginProviderId,
  loginProviderPassword,
  remark,
}: TooltipTitleProps): ReactNode => {
  return (
    <>
      <span>ログイン方法: {loginProvider}</span>
      <br />
      <span>ログインID: {loginProviderId}</span>
      <br />
      <span>パスワード: {loginProviderPassword}</span>
      <br />
      <span>備考: {remark}</span>
    </>
  );
};

type ActionCellProps = {
  id: string;
  loginProvider: string;
  loginProviderId: string;
  loginProviderPassword: string;
  remark: string;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
};

const ActionCell = (props: ActionCellProps) => {
  const { id, loginProvider, loginProviderId, loginProviderPassword, remark, onEdit, onDelete } =
    props;
  const [open, setOpen] = useState(false);
  const [openEditAccount, setOpenEditAccount] = useState(false);
  const handleTooltipClose = () => {
    setOpen(false);
  };

  const handleTooltipOpen = () => {
    setOpen(true);
  };
  const openEditAccountForm = () => {};
  const handleOnClick = () => {
    setOpenEditAccount(true);
    dispatch(
      openSnackbar({
        open: true,
        message: `アカウント${id}を送信しました。`,
        variant: 'alert',
        alert: {
          color: 'success',
        },
        close: false,
      })
    );
    if (openEditAccount) {
      openEditAccountForm();
    }
  };

  const handleOnEdit = () => {
    onEdit(id);
  };

  const handleOnDelete = () => {
    onDelete(id);
  };

  return (
    <Stack direction="row" justifyContent="start">
      <IconButton onClick={handleOnClick}>
        <CardSend />
      </IconButton>
      <IconButton onClick={handleOnEdit}>
        <Tooltip title="Xアカウント情報を編集">
          <Edit />
        </Tooltip>
      </IconButton>
      <IconButton onClick={handleOnDelete}>
        <Tooltip title="Xアカウントを削除">
          <Trash />
        </Tooltip>
      </IconButton>
      <ClickAwayListener onClickAway={handleTooltipClose}>
        <Tooltip
          PopperProps={{
            disablePortal: true,
          }}
          onClose={handleTooltipClose}
          open={open}
          disableFocusListener
          disableHoverListener
          disableTouchListener
          title={
            <TooltipTitle
              loginProvider={loginProvider}
              loginProviderId={loginProviderId}
              loginProviderPassword={loginProviderPassword}
              remark={remark}
            />
          }
        >
          <IconButton onClick={handleTooltipOpen}>
            <MoreSquare />
          </IconButton>
        </Tooltip>
      </ClickAwayListener>
    </Stack>
  );
};

// ==============================|| XListTable ||============================== //
const XListTable = () => {
  const [openDialogForm, setOpenDialogForm] = useState(false);
  const [accountData, setAccountData] = useState(xAccountDefaultValue);
  const handleCloseDialog = () => {
    setOpenDialogForm(false);
  };

  // fetch data from state
  const data: XAccountData[] = useSelector((state: RootState) => state.xAccountList.xAccountList);

  const handleAddNewAccount = () => {
    setAccountData(xAccountDefaultValue);
    setOpenDialogForm(true);
  };
  /*   const hadleOnDelete = (id: string) => {
    console.log(`delete: ${id}`);
  }; */
  const handleOnEdit = useCallback(
    (id: string) => {
      const account = data.find((x) => x.id === id);
      if (account) {
        setAccountData(account);
        setOpenDialogForm(true);
      }
    },
    [data]
  );

  const handleOnDelete = useCallback(
    (id: string) => {
      const account = data.find((x) => x.id === id);
      if (account) {
        setAccountData(account);
        Swal.fire({
          title: `削除確認`,
          text: `アカウント${account.userName}を削除しますか？`,
          icon: 'warning',
          showCancelButton: true,
          confirmButtonText: '削除',
        }).then((result) => {
          if (result.isConfirmed) {
            dispatch(deleteXAccount(account));
            Swal.fire({
              title: '削除完了',
              text: `アカウント${account.userName}を削除しました。`,
              icon: 'success',
              showCancelButton: false,
              confirmButtonText: 'OK',
            });
          }
        });
      }
    },
    [data]
  );

  const columns = useMemo(
    () => [
      {
        Header: 'アカウント名',
        accessor: 'userName',
      },
      {
        Header: '表示名',
        accessor: 'displayName',
      },
      {
        Header: 'アクション',
        accessor: 'actions',
        disableSortBy: true,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        Cell: ({ row }: CellProps<any>) =>
          ActionCell({
            ...(row.original as ActionCellProps),
            onEdit: handleOnEdit,
            onDelete: handleOnDelete,
          }),
      },
    ],
    [handleOnEdit, handleOnDelete]
  );

  return (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <MainCard
          title="Xアカウント一覧"
          content={false}
          secondary={
            <Stack direction="row" spacing={2}>
              <AddNewXAccountButton onClick={() => handleAddNewAccount()} />
              <CSVExport data={data} filename="x-accouts-list.csv" />
            </Stack>
          }
        >
          <ScrollX>
            <ReactTable columns={columns} data={data} />
          </ScrollX>
        </MainCard>
      </Grid>
      <DialogXAccountForm
        open={openDialogForm}
        onClose={handleCloseDialog}
        accountData={accountData}
      />
    </Grid>
  );
};

export default XListTable;
