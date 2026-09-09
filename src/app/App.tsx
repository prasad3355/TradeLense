import { RouterProvider } from 'react-router-dom';
import { router } from './router';

/**
 * Tradelense V2 Foundation Entry Point
 * Exposes the application router.
 */
export default function App() {
  return <RouterProvider router={router} />;
}
