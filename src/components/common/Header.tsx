import React from 'react';
import { Link } from 'react-router-dom';
import { LogIn, User as UserIcon } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import ThemeToggle from './ThemeToggle';
import { motion } from 'framer-motion';
import Logo from './Logo';

const Header = () => {
  const { isAuthenticated } = useAuth();

  return (
    <header className="bg-surface shadow-md sticky top-0 z-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Logo />
          <div className="flex items-center gap-4">
            <ThemeToggle />
            {isAuthenticated ? (
              <Link to="/profile">
                <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                  <UserIcon className="h-6 w-6 text-secondary hover:text-accent-hover" />
                </motion.div>
              </Link>
            ) : (
              <Link to="/login">
                 <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                    <LogIn className="h-6 w-6 text-secondary hover:text-accent-hover" />
                 </motion.div>
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
