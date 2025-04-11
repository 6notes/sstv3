import { cloneElement, ReactElement } from 'react';
import { Navigate } from 'react-router-dom';

import { useAppContext } from '../lib/contextLib';

interface Props {
  children: ReactElement;
}

function querystring(name: string, url = window.location.href) {
  const parsedName = name.replace(/[[]]/gu, '\\$&');
  const regex = new RegExp(`[?&]${parsedName}(=([^&#]*)|&|#|$)`, 'iu');
  const results = regex.exec(url);
  const indexOfPath = 2;

  if (!results || !results[indexOfPath]) {
    return false;
  }

  return decodeURIComponent(results[indexOfPath].replace(/\+/gu, ' '));
}

export default function UnauthenticatedRoute(props: Props) {
  const { isAuthenticated } = useAppContext();
  const { children } = props;
  const redirect = querystring('redirect');

  if (isAuthenticated) {
    return <Navigate to={redirect || '/'} />;
  }

  return cloneElement(children, props);
}
