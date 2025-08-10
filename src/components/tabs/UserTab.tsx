import moment from 'moment';
import { Link } from 'react-router-dom';
import { useMemo, useState } from 'react';
import { useInviteUserMutation } from '../../services/apis/userApi';
import { TableRow, TableCell, Tooltip, IconButton, TextField } from '@mui/material';
import { AdminPanelSettingsOutlined, VerifiedUserOutlined } from '@mui/icons-material';

import AlertDialog from '../AlertDialog';
import DatePicker from '../inputs/DatePicker';
import type { Column } from '../../pages/users/Users';
import {
  useHandleReduxQueryError,
  useHandleReduxQuerySuccess,
} from '../../hooks/useHandleReduxQuery';

interface Props {
  user: User;
  columns: readonly Column[];
  onInviteSuccess?: () => void;
}

const UserTab: React.FC<Props> = ({ columns, user, onInviteSuccess }) => {
  const todayDate = useMemo(() => new Date(), []);
  const [alertOpen, setAlertOpen] = useState(false);
  const [expiryDate, setExpiryDate] = useState<Date>();
  const [expiryDatePickerVisible, setExpiryDatePickerVisible] = useState(false);
  const [inviteUser, { originalArgs, isError, error, isLoading, isSuccess, data }] =
    useInviteUserMutation();

  const handleInviteAffirmation = () => {
    const payload: AdminInvitePayload = { userID: user._id };

    if (expiryDate !== undefined) {
      payload.expiresAt = expiryDate.toISOString();
    }

    inviteUser(payload);
  };

  useHandleReduxQueryError({
    isError,
    error,
    refetch: () => {
      if (originalArgs) inviteUser(originalArgs);
    },
  });
  useHandleReduxQuerySuccess({ isSuccess, response: data, onSuccess: onInviteSuccess });

  return (
    <TableRow hover role='row' tabIndex={-1}>
      {columns.map(({ align, id, minWidth, maxWidth }) => {
        let value: React.ReactNode;

        if (id === 'fullName') {
          value = `${user.lastName} ${user.firstName}`;
        } else if (id === 'email') {
          value = user.email.value;
        } else if (id === 'createdAt') {
          value = moment(user.createdAt).format('LL');
        } else {
          value = user[id] as string;
        }

        return (
          <TableCell key={id} role='cell' align={align} style={{ minWidth, maxWidth }}>
            {id === 'email' ? (
              <Link
                target='_blank'
                rel='noopener noreferrer'
                to={`mailto:${value}?subject=Electranet&body=Hello%20${user.lastName}%20${user.firstName}`}
              >
                {value}
              </Link>
            ) : (
              value
            )}
          </TableCell>
        );
      })}

      <TableCell role='cell' style={{ minWidth: 10 }}>
        <Tooltip
          title={
            user.role === 'USER'
              ? "Can't invite user"
              : user.isInvited || isSuccess
              ? 'Admin already invited'
              : 'Give Admin Rights'
          }
        >
          <span>
            <IconButton
              aria-label='invite user'
              onClick={() => setAlertOpen(true)}
              className='disabled:!cursor-not-allowed'
              disabled={user.role === 'USER' || user.isInvited || isLoading || isSuccess}
            >
              {user.isInvited || isSuccess ? (
                <VerifiedUserOutlined />
              ) : (
                <AdminPanelSettingsOutlined />
              )}
            </IconButton>
          </span>
        </Tooltip>
      </TableCell>

      {alertOpen && (
        <AlertDialog
          open
          negationText='Cancel'
          setOpen={setAlertOpen}
          affirmativeText='Confirm'
          dialogTitle='Confirm Admin Invite'
          onAffirmed={handleInviteAffirmation}
          dialogContent={
            <div className='form mt-4 !mb-0'>
              <TextField
                label='Name'
                spellCheck={false}
                className='form-field'
                value={`${user.lastName} ${user.firstName}`}
              />

              <TextField
                type='text'
                autoComplete='off'
                label='Admin Rights Expiration'
                onClick={() => setExpiryDatePickerVisible(true)}
                value={expiryDate ? moment(expiryDate).format('LL') : ''}
              />
              <DatePicker
                minDate={todayDate}
                selectedDate={expiryDate}
                setSelectedDate={setExpiryDate}
                visible={expiryDatePickerVisible}
                setVisible={setExpiryDatePickerVisible}
              />
            </div>
          }
        />
      )}
    </TableRow>
  );
};

export default UserTab;
