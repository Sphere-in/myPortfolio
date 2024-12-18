'use client';

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import dynamic from 'next/dynamic';

const MenuIcon = dynamic(() => import('lucide-react').then((mod) => mod.Menu), {
  loading: () => <div className="w-6 h-6 bg-gray-300 animate-pulse rounded" />,
  ssr: false
});
const XIcon = dynamic(() => import('lucide-react').then((mod) => mod.X), {
  loading: () => <div className="w-6 h-6 bg-gray-300 animate-pulse rounded" />,
  ssr: false
});

const NavItem = ({ href, label, isActive, onClick }) => (
  <li className="relative w-auto">
    <Link
      href={href}
      onClick={onClick}
      className={`
        hover:text-teal-300 transition-colors duration-300
        group-hover:opacity-50 hover:!opacity-100
        ${isActive ? 'text-teal-300' : 'text-white'}
      `}
    >
      {label}
    </Link>
    {isActive && (
      <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-teal-300" />
    )}
  </li>
);

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [activeSection, setActiveSection] = useState('');
  const pathname = usePathname();

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  const navItems = useMemo(() => [
    { href: '#home', label: '// Home' },
    { href: '#about', label: '// About me' },
    { href: '#projects', label: '// Projects' },
    { href: '#contact', label: '// Contact me' },
  ], []);

  useEffect(() => {
    let lastScrollY = window.pageYOffset;
    let ticking = false;

    const updateActiveSection = () => {
      const sections = ['home', 'about', 'projects', 'contact'];
      let currentSection = '';

      for (const section of sections) {
        const element = document.getElementById(section);
        if (element) {
          const rect = element.getBoundingClientRect();
          if (rect.top <= 100 && rect.bottom >= 100) {
            currentSection = section;
            break;
          }
        }
      }

      setActiveSection(currentSection);
    };

    const handleScroll = () => {
      const currentScrollY = window.pageYOffset;

      if (!ticking) {
        window.requestAnimationFrame(() => {
          setIsVisible(currentScrollY < lastScrollY || currentScrollY < 100);
          updateActiveSection();
          lastScrollY = currentScrollY;
          ticking = false;
        });

        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavClick = (e, href) => {
    e.preventDefault();
    const targetId = href.replace('#', '');
    const element = document.getElementById(targetId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setIsMenuOpen(false);
  };

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-transform duration-300 ${isVisible ? 'translate-y-0' : '-translate-y-full'}`}>
      <div className="bg-black/80 backdrop-blur-sm px-4  md:px-4 md:pt-2 ">
        <div className="w-full flex items-center justify-between mb-4 md:mb-6">

          {/* LOGO  */}
          <div className="font-mono text-2xl md:text-4xl font-bold z-20 font-robo ">
            <p className="text-teal-300 inline-block">RAIHAN</p>._
          </div>

          <button
            className="md:hidden z-20"
            onClick={toggleMenu}
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <XIcon className="h-6 w-6 text-white" /> : <MenuIcon className="h-6 w-6 text-white" />}
          </button>
        </div>

        <nav
          className={`
            ${isMenuOpen ? 'flex' : 'hidden'}
            md:flex flex-col md:flex-row absolute md:relative top-full left-0 w-full md:w-auto
            items-start justify-center space-y-1 md:space-y-0 pl-6 text-xl md:text-1xl font-medium z-10
            bg-black/80 backdrop-blur-sm md:bg-transparent
          `}
        >
          <ul className="flex flex-col md:flex-row items-start gap-4 md:gap-10 font-roboto group desktop-spacing md:pt-5">
            {navItems.map((item) => (
              <NavItem
                key={item.href}
                href={item.href}
                label={item.label}
                isActive={activeSection === item.href.replace('#', '')}
                onClick={(e) => handleNavClick(e, item.href)}
              />
            ))}
          </ul>
        </nav>
      </div>
    </header>
  );
}

