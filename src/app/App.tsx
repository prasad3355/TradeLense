import { RouterProvider } from 'react-router-dom';
import { router } from './router';
import { AuthProvider } from './auth/AuthContext';

/**
 * Tradelense V2 Foundation Entry Point
 * Exposes the application router.
 */
export default function App() {
  return (
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  );
}
