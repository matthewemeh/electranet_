import { useLocation } from 'react-router-dom';

import logo from '../assets/brand/logo.png';

const Banner = () => {
  const { pathname } = useLocation();

  return (
    <aside
      className={`banner pt-8 bg-gradient-to-tr from-primary-500 to-primary-800 items-center justify-center flex-col gap-5 hidden px-8 ${
        !pathname.includes('register') && 'md:flex'
      }`}
    >
      <div className='mb-4 w-fit flex flex-col gap-2 items-center'>
        <img src={logo} alt='Electranet logo' className='w-20 rounded-md' loading='eager' />
        <span className='text-2xl font-bold text-white'>Electranet</span>
      </div>
    </aside>
  );
};

export default Banner;
