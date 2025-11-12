import { JSX } from 'react';
import { Navigate } from 'react-router-dom';

export default function ProtectedRoute({ children }: {children: JSX.Element}) {
    const token = localStorage.getItem('token');
    return token ? children: <Navigate to="/login" replace/>;   // If token exists, redirect to the child component. Otherwise, navigate to login page.
}