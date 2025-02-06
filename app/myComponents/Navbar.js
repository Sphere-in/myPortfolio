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

export default function Navbar() {
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
    let lastScrollY = window.scrollY;
    let ticking = false;

    const updateHeaderVisibility = () => {
      const currentScrollY = window.pageYOffset;
      const homeSection = document.getElementById('home');
      const homeSectionBottom = homeSection ? homeSection.getBoundingClientRect().bottom : 0;
      
      setIsVisible(currentScrollY < lastScrollY || homeSectionBottom < window.innerHeight * 1.2);
      
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
      lastScrollY = currentScrollY;
      ticking = false;
    };

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(updateHeaderVisibility);
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
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isVisible ? 'translate-y-0' : '-translate-y-full'} bg-black/80 backdrop-blur-sm      container mx-auto px-4 md:px-8 py-4`}>
      {/* <div className=" "> */}
        <div className=" w-full flex flex-col md:flex-row items-center  justify-between">
          <div className="font-mono text-2xl md:text-4xl font-bold z-20 font-robo mb-4 md:mb-0">
            <p className="text-teal-300 inline-block">RAIHAN</p>._
          </div>
          <button
            className="md:hidden z-20 absolute top-4 right-4"
            onClick={toggleMenu}
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <XIcon className="h-6 w-6 text-white" /> : <MenuIcon className="h-6 w-6 text-white" />}
          </button>
          <nav
            className={`
              ${isMenuOpen ? 'flex' : 'hidden'}
              md:flex w-full md:w-auto
              items-center justify-center
              mt-4 md:mt-0
            `}
          >
            <ul className=" flex flex-col md:flex-row items-center justify-center  gap-4 md:gap-6 font-roboto group text-xl md:text-2xl font-medium">
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
      {/* </div> */}
    </header>
  );
}

