import './App.css';

import { Auth } from 'aws-amplify';
import { useEffect, useState } from 'react';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import { useNavigate } from 'react-router-dom';

import { AppContext, AppContextType } from './lib/contextLib';
import { onError } from './lib/errorLib.ts';
import Routes from './Routes.tsx';

function App() {
  const nav = useNavigate();
  const [isAuthenticating, setIsAuthenticating] = useState(true);
  const [isAuthenticated, userHasAuthenticated] = useState(false);

  useEffect(() => {
    // Using void to because https://github.com/typescript-eslint/typescript-eslint/issues/9061 and https://github.com/typescript-eslint/typescript-eslint/issues/1184
    void onLoad();
  }, []);

  async function onLoad() {
    try {
      await Auth.currentSession();
      userHasAuthenticated(true);
    } catch (error) {
      if (error !== 'No current user') {
        onError(error);
      }
    }

    setIsAuthenticating(false);
  }

  async function handleLogout() {
    await Auth.signOut();

    userHasAuthenticated(false);

    await nav('/login');
  }

  return (
    !isAuthenticating && (
      <div className='App container py-3'>
        <Navbar collapseOnSelect bg='light' expand='md' className='mb-3 px-3'>
          <Navbar.Brand className='fw-bold text-muted'>Scratch</Navbar.Brand>
          <Navbar.Toggle />
          <Navbar.Collapse className='justify-content-end'>
            <Nav activeKey={window.location.pathname}>
              {isAuthenticated ? (
                <>
                  <Nav.Link href='/settings'>Settings</Nav.Link>
                  <Nav.Link onClick={void handleLogout}>Logout</Nav.Link>
                </>
              ) : (
                <>
                  <Nav.Link href='/signup'>Signup</Nav.Link>
                  <Nav.Link href='/login'>Login</Nav.Link>
                </>
              )}
            </Nav>
          </Navbar.Collapse>
        </Navbar>
        <AppContext.Provider
          value={{ isAuthenticated, userHasAuthenticated } as AppContextType}
        >
          <Routes />
        </AppContext.Provider>
      </div>
    )
  );
}

export default App;
