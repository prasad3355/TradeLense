import { Outlet } from 'react-router-dom';
import Sidebar from '../../components/Sidebar';

export function AppLayout() {
    const handleUploadClick = () => {
        // Placeholder for future upload logic
        console.log('Upload clicked. Feature pending Phase 2.');
    };

    return (
        <div className="flex min-h-screen bg-black text-[#e5e2e1] font-sans">
            <Sidebar onUploadClick={handleUploadClick} />
            <main className="flex-1 ml-64 p-8 overflow-y-auto w-full">
                <Outlet />
            </main>
        </div>
    );
}
