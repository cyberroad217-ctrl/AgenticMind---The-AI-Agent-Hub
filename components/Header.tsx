
import React from 'react';

interface HeaderProps {
  onNavigate: (page: 'home' | 'blog' | 'admin' | 'marketplace') => void;
  currentPage: string;
}

const Header: React.FC<HeaderProps> = ({ onNavigate, currentPage }) => {
  return (
    <header className="sticky top-0 z-50 glass border-b border-white/5 px-6 py-3.5">
      <div className="max-w-6xl mx-auto flex items-center justify-between">
        <div 
          className="flex items-center gap-3 cursor-pointer group"
          onClick={() => onNavigate('home')}
        >
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center font-black text-white group-hover:bg-blue-500 transition-all shadow-xl shadow-blue-600/20 group-hover:scale-105">
            A
          </div>
          <h1 className="text-xl font-black tracking-tighter text-white uppercase italic">
            AI <span className="text-blue-500">LAB</span>
          </h1>
        </div>
        
        <nav className="hidden md:flex items-center gap-8">
          {['home', 'blog', 'marketplace', 'admin'].map((page) => (
            <button 
              key={page}
              onClick={() => onNavigate(page as any)}
              className={`text-[9px] font-black uppercase tracking-[0.2em] transition-all hover:scale-105 ${
                currentPage === page ? 'text-blue-500' : 'text-gray-500 hover:text-white'
              }`}
            >
              {page === 'admin' ? 'Node' : page === 'marketplace' ? 'Market' : page}
            </button>
          ))}
        </nav>

        <div className="flex items-center gap-4">
          <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/5">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse"></span>
            <span className="text-[9px] font-black text-blue-100 uppercase tracking-widest">LIVE</span>
          </div>
          <button className="px-5 py-2 rounded-lg bg-blue-600 text-[9px] font-black uppercase tracking-widest text-white hover:bg-blue-500 transition-all shadow-xl shadow-blue-600/20 active:scale-95">
            Join
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
