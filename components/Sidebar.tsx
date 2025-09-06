
import React, { useState } from 'react';
import { Page, UserRole } from '../types';
import { useAuth } from '../context/AuthContext';
import TourStep from './common/TourStep';

const NavLink: React.FC<{
  label: string;
  page: Page;
  active: boolean;
  onClick: (page: Page) => void;
}> = ({ label, page, active, onClick }) => {
  const baseClasses = 'pl-11 pr-4 py-2 text-sm rounded-md block transition-colors duration-150 cursor-pointer';
  const activeClasses = 'bg-primary/20 text-text-primary font-semibold';
  const inactiveClasses = 'text-text-secondary hover:bg-zinc-800 hover:text-text-primary';

  return (
    <a onClick={() => onClick(page)} className={`${baseClasses} ${active ? activeClasses : inactiveClasses}`}>
      {label}
    </a>
  );
};

const Section: React.FC<{
  title: string;
  icon: React.ReactNode;
  isOpen: boolean;
  onToggle: () => void;
  children: React.ReactNode;
  isActiveSection: boolean;
}> = ({ title, icon, isOpen, onToggle, children, isActiveSection }) => {
    const baseClasses = 'flex items-center w-full px-4 py-3 text-sm font-medium rounded-lg transition-colors duration-200 cursor-pointer';
    const activeClasses = 'bg-primary text-white';
    const inactiveClasses = 'text-text-secondary hover:bg-card hover:text-text-primary';

  return (
    <div>
      <button 
        onClick={onToggle}
        className={`${baseClasses} ${isActiveSection && !isOpen ? activeClasses : inactiveClasses}`}
      >
        {icon}
        <span className="ml-3 flex-1 text-left">{title}</span>
        <svg className={`h-5 w-5 transform transition-transform duration-200 ${isOpen ? 'rotate-90' : ''}`} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>
      {isOpen && <div className="mt-2 space-y-1">{children}</div>}
    </div>
  );
};


interface SidebarProps {
    activePage: Page;
    setActivePage: (page: Page) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activePage, setActivePage }) => {
  const [openSection, setOpenSection] = useState<string>(activePage.split('/')[0]);
  const { currentUser } = useAuth();
  const activeSection = activePage.split('/')[0];
  
  const handleToggle = (section: string) => {
    setOpenSection(openSection === section ? '' : section);
  };
  
  const isTopLevelActive = (page: string) => activePage === page;

  if (!currentUser) return null; 

  return (
    <aside className="w-64 flex-shrink-0 bg-card border-r border-border flex flex-col">
      <div className="h-16 flex items-center justify-center px-4 border-b border-border">
        <svg className="h-8 w-auto text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 12h2"/><path d="M6 12h2"/><path d="M10 12h2"/><path d="M14 12h2"/><path d="M18 12h2"/><path d="M12 2v2"/><path d="M12 6v2"/><path d="M12 10v2"/><path d="M12 14v2"/><path d="M12 18v2"/></svg>
        <h1 className="ml-2 text-xl font-bold text-text-primary tracking-tighter">productflow.online</h1>
      </div>
      <nav className="flex-1 p-4 space-y-2 bg-zinc-950">
        
        <a 
          onClick={() => setActivePage('home')}
          className={`flex items-center w-full px-4 py-3 text-sm font-medium rounded-lg transition-colors duration-200 cursor-pointer ${isTopLevelActive('home') ? 'bg-primary text-white' : 'text-text-secondary hover:bg-card hover:text-text-primary'}`}
        >
          <IconHome/>
          <span className="ml-3 flex-1 text-left">Home</span>
        </a>
        
        <TourStep
            target="#my-workspace-nav"
            title="Your Personal Hub"
            content="This is your personalized workspace. Find your saved reports, notifications, and priorities here."
        >
            <a 
              id="my-workspace-nav"
              onClick={() => setActivePage('workspace')}
              className={`flex items-center w-full px-4 py-3 text-sm font-medium rounded-lg transition-colors duration-200 cursor-pointer ${isTopLevelActive('workspace') ? 'bg-primary text-white' : 'text-text-secondary hover:bg-card hover:text-text-primary'}`}
            >
              <IconWorkspace/>
              <span className="ml-3 flex-1 text-left">My Workspace</span>
            </a>
        </TourStep>
        
        <Section title="Product & Strategy" icon={<IconProducts/>} isOpen={openSection === 'product'} onToggle={() => handleToggle('product')} isActiveSection={activeSection === 'product'}>
            <NavLink label="Strategy Suite" page="product/strategy-suite" active={activePage === 'product/strategy-suite'} onClick={setActivePage} />
            <NavLink label="Portfolio" page="product/portfolio" active={activePage.startsWith('product/portfolio') || activePage.startsWith('product/detail')} onClick={setActivePage} />
            <NavLink label="Expected Outcomes" page="product/outcomes" active={activePage === 'product/outcomes'} onClick={setActivePage} />
            <NavLink label="Product KPIs" page="product/kpis/hw-2" active={activePage.startsWith('product/kpis')} onClick={setActivePage} />
            <NavLink label="Personas" page="product/personas" active={activePage === 'product/personas'} onClick={setActivePage} />
            <NavLink label="Contexts" page="product/contexts" active={activePage === 'product/contexts'} onClick={setActivePage} />
        </Section>

        <Section title="Feedback" icon={<IconFeedback/>} isOpen={openSection === 'feedback'} onToggle={() => handleToggle('feedback')} isActiveSection={activeSection === 'feedback'}>
             <NavLink label="Dashboard" page="feedback/dashboard" active={activePage === 'feedback/dashboard'} onClick={setActivePage} />
             <NavLink label="Feedback Hub" page="feedback/hub" active={activePage === 'feedback/hub'} onClick={setActivePage} />
             <NavLink label="Feedback Board" page="feedback/board" active={activePage === 'feedback/board'} onClick={setActivePage} />
             <NavLink label="User Journey" page="feedback/journey" active={activePage === 'feedback/journey'} onClick={setActivePage} />
             <NavLink label="Advanced Analysis" page="feedback/analysis" active={activePage === 'feedback/analysis'} onClick={setActivePage} />
        </Section>
        
        <Section title="Hypothesis" icon={<IconDiscovery/>} isOpen={openSection === 'hypothesis'} onToggle={() => handleToggle('hypothesis')} isActiveSection={activeSection === 'hypothesis'}>
            <NavLink label="Hypothesis Board" page="hypothesis/board" active={activePage === 'hypothesis/board'} onClick={setActivePage} />
        </Section>
        
        <Section title="Upstream" icon={<svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M15 11.25l-3-3m0 0l-3 3m3-3v7.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>} isOpen={openSection === 'upstream'} onToggle={() => handleToggle('upstream')} isActiveSection={activeSection === 'upstream'}>
            <NavLink label="Idea Inbox" page="upstream/inbox" active={activePage === 'upstream/inbox'} onClick={setActivePage} />
            <NavLink label="Initiatives Work" page="upstream/initiatives" active={activePage === 'upstream/initiatives'} onClick={setActivePage} />
            <NavLink label="Unknowns" page="upstream/unknowns" active={activePage === 'upstream/unknowns'} onClick={setActivePage} />
        </Section>
        
        {currentUser.role === UserRole.Admin && (
            <Section title="Settings" icon={<IconSettings/>} isOpen={openSection === 'settings'} onToggle={() => handleToggle('settings')} isActiveSection={activeSection === 'settings'}>
                <NavLink label="Users" page="settings/users" active={activePage === 'settings/users'} onClick={setActivePage} />
                <NavLink label="Integrations" page="settings/integrations" active={activePage === 'settings/integrations'} onClick={setActivePage} />
                <NavLink label="Web Scrapers" page="settings/scrapers" active={activePage === 'settings/scrapers'} onClick={setActivePage} />
                <NavLink label="API & Webhooks" page="settings/api" active={activePage === 'settings/api'} onClick={setActivePage} />
                <NavLink label="Documentation" page="settings/documentation" active={activePage === 'settings/documentation'} onClick={setActivePage} />
                <NavLink label="Changelog" page="settings/changelog" active={activePage === 'settings/changelog'} onClick={setActivePage} />
            </Section>
        )}
      </nav>
      <div className="p-4 border-t border-border">
        <div className="flex items-center">
            <img className="h-10 w-10 rounded-full object-cover" src={currentUser.avatar} alt="User avatar" />
            <div className="ml-3">
                <p className="text-sm font-medium text-text-primary">{currentUser.name}</p>
                <p className="text-xs text-text-secondary">{currentUser.role}</p>
            </div>
        </div>
      </div>
    </aside>
  );
};

// SVG Icons
const IconHome = () => <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>;
const IconWorkspace = () => <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 8v8m-4-5v5m-4-2v2m-2 4h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>;
const IconProducts = () => <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg>;
const IconFeedback = () => <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>;
const IconDiscovery = () => <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M6.343 18.343l-.707.707m12.728 0l-.707-.707M6.343 5.657l-.707-.707M12 21a9 9 0 110-18 9 9 0 010 18z" /></svg>;
const IconSettings = () => <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924-1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066 2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>;

export default Sidebar;
