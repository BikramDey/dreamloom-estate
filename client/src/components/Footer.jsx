import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin } from 'react-icons/fa';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

export default function Footer() {
  const { currentUser } = useSelector((state) => state.user);
  return (
    <footer className='fixed bottom-[0%] left-[0%] right-[0%] z-20 bg-slate-800 text-white py-2 text-base'>
      <div className='max-w-6xl mx-auto flex flex-col sm:flex-row justify-between items-center'>
        {/* Left side: Navigation Links */}
        <div className='mb-4 sm:mb-0'>
          <ul className='flex gap-6'>
            <Link to='/'>
              <li className='hover:underline'>Home</li>
            </Link>
            <Link to='/about'>
              <li className='hover:underline'>About</li>
            </Link>
            <Link to='/profile'>
              {currentUser ? (
                <li className='hover:underline'>Profile</li>
            ) : (
              <li className='hover:underline'> Sign in</li>
            )}
            </Link>
          </ul>
        </div>

        {/* Right side: Social Media Icons */}
        <div className='flex gap-4'>
          <a href='https://facebook.com' target='_blank' rel='noopener noreferrer'>
            <FaFacebook className='hover:text-blue-500' size = '18'/>
          </a>
          <a href='https://twitter.com' target='_blank' rel='noopener noreferrer'>
            <FaTwitter className='hover:text-blue-400' size = '18'/>
          </a>
          <a href='https://instagram.com' target='_blank' rel='noopener noreferrer'>
            <FaInstagram className='hover:text-pink-500' size = '18'/>
          </a>
          <a href='https://linkedin.com' target='_blank' rel='noopener noreferrer'>
            <FaLinkedin className='hover:text-blue-600' size = '18'/>
          </a>
        </div>
      </div>

      {/* Bottom Section: Copyright */}
      <div className='text-center mt-1'>
        <p className='text-base text-slate-400 font-bold'>
          &copy; 2024 Sahand Estate. All rights reserved.
        </p>
      </div>
    </footer>
    
  );
}
