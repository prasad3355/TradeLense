import { Outlet } from 'react-router-dom';

export function RootLayout() {
    return (
        <div className="min-h-screen bg-black text-[#e5e2e1] font-sans">
            <Outlet />
        </div>
    );
}
