import { useMemo, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Avatar, Button, Chip, IconButton, Tooltip, useMediaQuery } from '@mui/material';
import { MenuRounded, MenuOpenRounded, MoreVert, Notifications } from '@mui/icons-material';

import Overlay from './Overlay';
import ThemeToggle from './ThemeToggle';
import logo from '../assets/brand/logo.png';
import LinkButton from './buttons/LinkButton';
import { PATHS } from '../routes/PathConstants';
import LinkIconButton from './buttons/LinkIconButton';
import { useAppSelector } from '../hooks/useRootStorage';
import { useLogoutMutation } from '../services/apis/authApi';
import { useHandleReduxQueryError, useHandleReduxQuerySuccess } from '../hooks/useHandleReduxQuery';

enum RoleWeight {
  USER = 0,
  ADMIN = 1,
  SUPER_ADMIN = 2,
}

/**
 * Only 1 or none of `allowedRoles` and `restrictedRoles` is allowed to be present in a `NavLink` object.
 * However, if both are present then `restrictedRoles` is given priority over `allowedRoles`
 */
interface NavLink {
  url: string;
  text: string;
  urlRegex: RegExp;
  allowedRoles?: RoleWeight | RoleWeight[];
  restrictedRoles?: RoleWeight | RoleWeight[];
}

const Navbar = () => {
  const {
    isAuthenticated,
    currentUser: { lastName, role },
  } = useAppSelector(state => state.authStore);

  const {
    LOGS,
    USERS,
    VOTES,
    TOKENS,
    PARTIES,
    RESULTS,
    ELECTIONS,
    DASHBOARD,
    CONTESTANTS,
    NOTIFICATIONS,
    FACE_ID_REGISTER,
    AUTH: { LOGIN, REGISTER_USER },
  } = PATHS;

  const navLinks: NavLink[] = [
    {
      text: 'Dashboard',
      url: DASHBOARD,
      urlRegex: new RegExp(`^${DASHBOARD}$`),
    },
    {
      text: 'Users',
      url: USERS,
      urlRegex: new RegExp(`^${USERS}`),
      allowedRoles: RoleWeight.SUPER_ADMIN,
    },
    {
      text: 'Tokens',
      url: TOKENS,
      urlRegex: new RegExp(`^${TOKENS}`),
      allowedRoles: RoleWeight.SUPER_ADMIN,
    },
    {
      text: role === 'USER' ? 'My Elections' : 'Elections',
      url: ELECTIONS.FETCH,
      urlRegex: new RegExp(`^${ELECTIONS.FETCH}`),
    },
    {
      text: 'Results',
      url: RESULTS.FETCH,
      urlRegex: new RegExp(`^${RESULTS.RESULT}`),
    },
    {
      text: 'Verify Vote',
      url: VOTES.VERIFY,
      urlRegex: new RegExp(`^${VOTES.VERIFY}`),
      allowedRoles: RoleWeight.USER,
    },
    {
      text: 'Contestants',
      url: CONTESTANTS.FETCH,
      urlRegex: new RegExp(`^${CONTESTANTS.FETCH}`),
      restrictedRoles: RoleWeight.USER,
    },
    {
      text: 'Parties',
      url: PARTIES.FETCH,
      urlRegex: new RegExp(`^${PARTIES.FETCH}`),
      restrictedRoles: RoleWeight.USER,
    },
    { text: 'Logs', url: LOGS, urlRegex: new RegExp(`^${LOGS}`), restrictedRoles: RoleWeight.USER },
  ];

  const navLinkFilter = ({ allowedRoles, restrictedRoles }: NavLink) => {
    if (restrictedRoles !== undefined) {
      return Array.isArray(restrictedRoles)
        ? !restrictedRoles.includes(RoleWeight[role])
        : restrictedRoles !== RoleWeight[role];
    } else if (allowedRoles !== undefined) {
      return Array.isArray(allowedRoles)
        ? allowedRoles.includes(RoleWeight[role])
        : allowedRoles === RoleWeight[role];
    }

    return true;
  };

  const filteredNavLinks = useMemo(() => navLinks.filter(navLinkFilter), [navLinks]);

  const navigate = useNavigate();
  const { pathname } = useLocation();
  const [showMore, setShowMore] = useState(false);
  const [menuOpened, setMenuOpened] = useState(false);
  const matchesPhone = useMediaQuery('(max-width:640px)');
  const matchesTablet = useMediaQuery('(max-width:800px)');
  const matchesLaptop = useMediaQuery('(max-width:1900px)');
  const maxNavLinks = useMemo(() => {
    if (matchesPhone) return filteredNavLinks.length;
    if (matchesTablet) return 3;
    else if (matchesLaptop) return 5;

    return filteredNavLinks.length;
  }, [filteredNavLinks, matchesLaptop, matchesTablet, matchesPhone]);

  const [logout, { error, isError, isLoading, isSuccess, data }] = useLogoutMutation();

  const toggleNav = () => setMenuOpened(opened => !opened);

  const toggleShowMore = () => setShowMore(show => !show);

  const handleLogout = async () => {
    await logout();
    navigate(LOGIN);
  };

  const handleNavLinkClick = () => {
    toggleNav();
    toggleShowMore();
  };

  useHandleReduxQueryError({ error, isError });
  useHandleReduxQuerySuccess({ isSuccess, response: data });

  return (
    <nav className='bg-white -mx-4 px-4 h-16 mb-5 py-3 flex gap-5 items-center justify-between border-b sticky top-0 z-1200 sm:-mx-8 sm:px-8'>
      <IconButton onClick={toggleNav} aria-label='menu-hamburger' className='sm:!hidden'>
        {menuOpened ? <MenuOpenRounded /> : <MenuRounded />}
      </IconButton>

      <Link to={DASHBOARD} className='hidden items-center gap-2 sm:flex'>
        <img src={logo} alt='Electranet Logo' className='w-8 rounded' />
      </Link>

      <div
        className={`nav-links flex gap-5 bg-white top-16 max-sm:w-screen max-sm:h-[calc(100dvh-64px)] max-sm:fixed max-sm:flex-col max-sm:overflow-y-auto max-sm:p-4 transition-[inset] duration-500 ${
          menuOpened ? 'right-0' : 'right-full'
        }`}
      >
        <Link
          to={DASHBOARD}
          onClick={toggleNav}
          className='flex items-center gap-2 w-fit sm:hidden'
        >
          <img src={logo} alt='Electranet Logo' className='w-10 h-10' />
          <span className='font-medium'>Electranet</span>
        </Link>
        {filteredNavLinks.slice(0, maxNavLinks).map(({ text, url, urlRegex }) => (
          <Link
            to={url}
            key={text}
            onClick={toggleNav}
            className={`nav-link ${urlRegex.test(pathname) && 'selected'}`}
          >
            {text}
          </Link>
        ))}
        {filteredNavLinks.length > maxNavLinks && (
          <div className='relative'>
            <Tooltip title='More'>
              <IconButton
                id='more'
                aria-label='more'
                onClick={toggleShowMore}
                className='h-[30.7px] w-[30.7px] cursor-pointer'
              >
                <MoreVert />
              </IconButton>
            </Tooltip>

            <div
              className={`border border-[rgba(0,0,0,0.2)] shadow-lg nav-links flex flex-col gap-2 p-2 rounded bg-white absolute top-[calc(100%+5px)] right-3 z-60 duration-300 ${
                showMore || 'opacity-0 invisible'
              }`}
            >
              {filteredNavLinks.slice(maxNavLinks).map(({ text, url, urlRegex }) => (
                <Link
                  to={url}
                  key={text}
                  onClick={handleNavLinkClick}
                  className={`nav-link h-[30.7px] text-center !w-full ${
                    urlRegex.test(pathname) && 'selected'
                  }`}
                >
                  {text}
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>

      <ThemeToggle />

      <Tooltip title='Notifications'>
        <LinkIconButton to={NOTIFICATIONS} className='w-9 h-9' aria-label='notifications'>
          <Notifications className='text-primary-700' />
        </LinkIconButton>
      </Tooltip>

      <Overlay visible={showMore} onClick={toggleShowMore} extraClassNames='bg-transparent' />

      {isAuthenticated ? (
        <div className='dropdown'>
          <Chip
            label={lastName}
            component='button'
            variant='outlined'
            onClick={() => {}}
            avatar={<Avatar alt={lastName} src='' />}
          />
          <div className='content'>
            <LinkButton to={FACE_ID_REGISTER} size='small'>
              Face ID
            </LinkButton>
            <Button size='small' onClick={handleLogout} disabled={isLoading}>
              Logout
            </Button>
          </div>
        </div>
      ) : (
        <div className='flex gap-3'>
          <LinkButton to={REGISTER_USER} variant='outlined' className='max-[400px]:!hidden'>
            Sign up
          </LinkButton>
          <LinkButton to={LOGIN} variant='contained'>
            Login
          </LinkButton>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
