import React from 'react';
import { Link } from 'react-router-dom';

const Logo = () => {
  return (
    <Link to="/" className="flex items-baseline gap-2 font-black">
      <span className="text-2xl text-primary tracking-tighter">OPEN BLOC</span>
      <span className="text-xl text-accent font-bold">2025</span>
    </Link>
  );
};

export default Logo;
