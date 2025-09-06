
import React from 'react';
import Router from './Router';

const App: React.FC = () => {
  return (
    <div className="flex h-screen bg-background text-text-primary font-sans">
      <Router />
    </div>
  );
};

export default App;
