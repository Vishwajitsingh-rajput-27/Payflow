import React from 'react';
import './App.css';

function App() {
  const [page, setPage] = React.useState('home');

  switch (page) {
    case 'home':
      return <Home onNavigate={setPage} />;
    case 'admin':
      return <Admin onNavigate={setPage} />;
    case 'user':
      return <User onNavigate={setPage} />;
    // Removed deploy-guide case
    default:
      return <Home onNavigate={setPage} />;
  }
}

export default App;