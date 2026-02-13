import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, LogOut } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { logOut } from '@/services/auth';

export const Navigation: React.FC = () => {
  const [isOpen, setIsOpen] = React.useState(false);
  const location = useLocation();
  const { user } = useAuth();

  const isActive = (path: string) => location.pathname === path;

  const handleLogOut = async () => {
    try {
      await logOut();
      window.location.href = '/';
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-black/95 backdrop-blur-md border-b border-yellow-600/30" style={{ fontFamily: "'Audiowide', sans-serif" }}>
      <div className="max-w-7xl mx-auto px-6 md:px-12 py-3 flex items-center justify-between">
        
        <Link 
          to="/" 
          className="text-white text-lg md:text-xl font-bold uppercase hover:text-yellow-600 transition-colors"
          style={{ fontFamily: "'Audiowide', sans-serif", letterSpacing: '0.1em' }}
        >
          COLLEGE <span className="text-yellow-600">HUB</span>
        </Link>

        
        <div className="hidden md:flex items-center gap-6 flex-1 ml-8">
          <Link
            to="/"
            className={`uppercase text-xs tracking-wider transition-colors ${isActive('/') ? 'text-yellow-600' : 'text-gray-400 hover:text-yellow-600'}`}
            style={{ fontFamily: "'Audiowide', sans-serif", letterSpacing: '0.08em' }}
          >
            Home
          </Link>
          <Link
            to="/schedule"
            className={`uppercase text-xs tracking-wider transition-colors ${isActive('/schedule') ? 'text-yellow-600' : 'text-gray-400 hover:text-yellow-600'}`}
            style={{ fontFamily: "'Audiowide', sans-serif", letterSpacing: '0.08em' }}
          >
            Schedules
          </Link>
          <Link
            to="/classrooms"
            className={`uppercase text-xs tracking-wider transition-colors ${isActive('/classrooms') ? 'text-yellow-600' : 'text-gray-400 hover:text-yellow-600'}`}
            style={{ fontFamily: "'Audiowide', sans-serif", letterSpacing: '0.08em' }}
          >
            Classrooms
          </Link>
          <Link
            to="/schedule-class"
            className={`uppercase text-xs tracking-wider transition-colors ${isActive('/schedule-class') ? 'text-yellow-600' : 'text-gray-400 hover:text-yellow-600'}`}
            style={{ fontFamily: "'Audiowide', sans-serif", letterSpacing: '0.08em' }}
          >
            Schedule Class
          </Link>
          <Link
            to="/drive"
            className={`uppercase text-xs tracking-wider transition-colors ${isActive('/drive') ? 'text-yellow-600' : 'text-gray-400 hover:text-yellow-600'}`}
            style={{ fontFamily: "'Audiowide', sans-serif", letterSpacing: '0.08em' }}
          >
            Drive
          </Link>
          <Link
            to="/study-materials"
            className={`uppercase text-xs tracking-wider transition-colors ${isActive('/study-materials') ? 'text-yellow-600' : 'text-gray-400 hover:text-yellow-600'}`}
            style={{ fontFamily: "'Audiowide', sans-serif", letterSpacing: '0.08em' }}
          >
            Study Materials
          </Link>
          <Link
            to="/community"
            className={`uppercase text-xs tracking-wider transition-colors ${isActive('/community') ? 'text-yellow-600' : 'text-gray-400 hover:text-yellow-600'}`}
            style={{ fontFamily: "'Audiowide', sans-serif", letterSpacing: '0.08em' }}
          >
            Community
          </Link>
          <Link
            to="/schedule"
            className={`uppercase text-xs tracking-wider transition-colors ${isActive('/schedule') ? 'text-yellow-600' : 'text-gray-400 hover:text-yellow-600'}`}
            style={{ fontFamily: "'Audiowide', sans-serif", letterSpacing: '0.08em' }}
          >
            Faculty
          </Link>
        </div>

        
        <div className="hidden md:flex items-center gap-4 pl-6 border-l border-yellow-600/30">
          {user ? (
            <>
              <div className="text-right">
                <p className="text-xs text-gray-400">Logged in as</p>
                <p className="text-sm font-semibold text-white">{user.displayName || user.email}</p>
              </div>
              <button 
                onClick={handleLogOut}
                className="px-4 py-2 border border-red-600 text-red-600 uppercase text-xs tracking-wider hover:bg-red-600 hover:text-black transition-all duration-300 flex items-center gap-2" 
                style={{ fontFamily: "'Audiowide', sans-serif", letterSpacing: '0.08em' }}
              >
                <LogOut className="w-4 h-4" />
                Logout
              </button>
            </>
          ) : (
            <>
              <Link 
                to="/login"
                className="uppercase text-xs tracking-wider text-gray-400 hover:text-yellow-600 transition-colors" 
                style={{ fontFamily: "'Audiowide', sans-serif", letterSpacing: '0.08em' }}
              >
                Login
              </Link>
              <Link 
                to="/signup"
                className="px-4 py-2 border border-yellow-600 text-yellow-600 uppercase text-xs tracking-wider hover:bg-yellow-600 hover:text-black transition-all duration-300" 
                style={{ fontFamily: "'Audiowide', sans-serif", letterSpacing: '0.08em' }}
              >
                Register
              </Link>
            </>
          )}
        </div>

        
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden text-yellow-600 hover:text-yellow-500 transition-colors"
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      
      {isOpen && (
        <div className="md:hidden bg-black/95 border-t border-yellow-600/30">
          <div className="max-w-7xl mx-auto px-6 py-4 space-y-3" style={{ fontFamily: "'Audiowide', sans-serif" }}>
            <Link
              to="/"
              className={`block uppercase text-xs tracking-wider transition-colors ${isActive('/') ? 'text-yellow-600' : 'text-gray-400 hover:text-yellow-600'}`}
              onClick={() => setIsOpen(false)}
              style={{ letterSpacing: '0.08em' }}
            >
              Home
            </Link>
            <Link
              to="/schedule"
              className={`block uppercase text-xs tracking-wider transition-colors ${isActive('/schedule') ? 'text-yellow-600' : 'text-gray-400 hover:text-yellow-600'}`}
              onClick={() => setIsOpen(false)}
              style={{ letterSpacing: '0.08em' }}
            >
              Schedules
            </Link>
            <Link
              to="/classrooms"
              className={`block uppercase text-xs tracking-wider transition-colors ${isActive('/classrooms') ? 'text-yellow-600' : 'text-gray-400 hover:text-yellow-600'}`}
              onClick={() => setIsOpen(false)}
              style={{ letterSpacing: '0.08em' }}
            >
              Classrooms
            </Link>
            <Link
              to="/schedule-class"
              className={`block uppercase text-xs tracking-wider transition-colors ${isActive('/schedule-class') ? 'text-yellow-600' : 'text-gray-400 hover:text-yellow-600'}`}
              onClick={() => setIsOpen(false)}
              style={{ letterSpacing: '0.08em' }}
            >
              Schedule Class
            </Link>
            <Link
              to="/drive"
              className={`block uppercase text-xs tracking-wider transition-colors ${isActive('/drive') ? 'text-yellow-600' : 'text-gray-400 hover:text-yellow-600'}`}
              onClick={() => setIsOpen(false)}
              style={{ letterSpacing: '0.08em' }}
            >
              Drive
            </Link>
            <Link
              to="/study-materials"
              className={`block uppercase text-xs tracking-wider transition-colors ${isActive('/study-materials') ? 'text-yellow-600' : 'text-gray-400 hover:text-yellow-600'}`}
              onClick={() => setIsOpen(false)}
              style={{ letterSpacing: '0.08em' }}
            >
              Study Materials
            </Link>
            <Link
              to="/community"
              className={`block uppercase text-xs tracking-wider transition-colors ${isActive('/community') ? 'text-yellow-600' : 'text-gray-400 hover:text-yellow-600'}`}
              onClick={() => setIsOpen(false)}
              style={{ letterSpacing: '0.08em' }}
            >
              Community
            </Link>
            <Link
              to="/schedule"
              className={`block uppercase text-xs tracking-wider transition-colors ${isActive('/schedule') ? 'text-yellow-600' : 'text-gray-400 hover:text-yellow-600'}`}
              onClick={() => setIsOpen(false)}
              style={{ letterSpacing: '0.08em' }}
            >
              Faculty
            </Link>
            <div className="border-t border-yellow-600/30 pt-3 space-y-2">
              {user ? (
                <>
                  <div className="px-4 py-2 bg-gray-800/50 rounded">
                    <p className="text-xs text-gray-400 mb-1">Logged in as</p>
                    <p className="text-sm font-semibold text-white">{user.displayName || user.email}</p>
                  </div>
                  <button 
                    onClick={() => {
                      handleLogOut();
                      setIsOpen(false);
                    }}
                    className="w-full px-4 py-2 border border-red-600 text-red-600 uppercase text-xs tracking-wider hover:bg-red-600 hover:text-black transition-all duration-300 flex items-center justify-center gap-2" 
                    style={{ letterSpacing: '0.08em' }}
                  >
                    <LogOut className="w-4 h-4" />
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link 
                    to="/login"
                    className="w-full block text-center uppercase text-xs tracking-wider text-gray-400 hover:text-yellow-600 transition-colors px-4 py-2" 
                    onClick={() => setIsOpen(false)}
                    style={{ letterSpacing: '0.08em' }}
                  >
                    Login
                  </Link>
                  <Link 
                    to="/signup"
                    className="w-full px-4 py-2 border border-yellow-600 text-yellow-600 uppercase text-xs tracking-wider hover:bg-yellow-600 hover:text-black transition-all duration-300 text-center"
                    onClick={() => setIsOpen(false)}
                    style={{ letterSpacing: '0.08em' }}
                  >
                    Register
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};
