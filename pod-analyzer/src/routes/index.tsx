import React from 'react';
import App from '../App';
import RunningPage from '../RunningPage';
import PendingPage from '../PendingPage';
import FailedPage from '../FailedPage';

export default [
  {
    path: '/pod-analyzer',
    element: <App />,
    children: [
      { path: 'running', element: <RunningPage /> },
      { path: 'pending', element: <PendingPage /> },
      { path: 'failed', element: <FailedPage /> },
    ],
  },
];
