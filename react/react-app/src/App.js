import React, { useState } from 'react';
import LoginPage from './components/LoginPage';
import MainPage from './components/MainPage';

function App() {
  const [user, setUser] = useState(null);

  const handleLogin = (userData) => {
    setUser(userData);
  };

  const handleLogout = () => {
    setUser(null);
  };

  return (
    <div className="App">
      <header className="App-header">
        {user ? (
          <MainPage userData={user} onLogout={handleLogout} />
        ) : (
          <LoginPage onLogin={handleLogin} />
        )}
      </header>
    </div>
  );
}

export default App;
