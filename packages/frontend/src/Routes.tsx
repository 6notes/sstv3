import { Route, Routes } from 'react-router-dom';

import AuthenticatedRoute from './components/AuthenticatedRoute.tsx';
import UnauthenticatedRoute from './components/UnauthenticatedRoute.tsx';
import Home from './containers/Home.tsx';
import Login from './containers/Login.tsx';
import NewNote from './containers/NewNote.tsx';
import Notes from './containers/notes/Notes.tsx';
import NotFound from './containers/NotFound.tsx';
import Settings from './containers/Settings.tsx';
import Signup from './containers/signup/Signup.tsx';

export default function Links() {
  return (
    <Routes>
      <Route path='/' element={<Home />} />
      <Route
        path='/login'
        element={
          <UnauthenticatedRoute>
            <Login />
          </UnauthenticatedRoute>
        }
      />
      <Route
        path='/signup'
        element={
          <UnauthenticatedRoute>
            <Signup />
          </UnauthenticatedRoute>
        }
      />
      <Route
        path='/settings'
        element={
          <AuthenticatedRoute>
            <Settings />
          </AuthenticatedRoute>
        }
      />
      <Route
        path='/notes/new'
        element={
          <AuthenticatedRoute>
            <NewNote />
          </AuthenticatedRoute>
        }
      />
      <Route
        path='/notes/:id'
        element={
          <AuthenticatedRoute>
            <Notes />
          </AuthenticatedRoute>
        }
      />
      {/* Finally, catch all unmatched routes */}
      <Route path='*' element={<NotFound />} />;
    </Routes>
  );
}
