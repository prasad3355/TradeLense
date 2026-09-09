import { Outlet } from 'react-router-dom';
import Sidebar from '../../components/Sidebar';
import { Header } from './Header';
import { useState } from 'react';

export function AppLayout() {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const handleUploadClick = () => {
        // Placeholder for future upload logic
        console.log('Upload clicked. Feature pending Phase 2.');
    };

    const closeSidebar = () => setIsSidebarOpen(false);
    const openSidebar = () => setIsSidebarOpen(true);

    return (
        <div className="flex min-h-screen bg-black text-[#e5e2e1] font-sans selection:bg-brand-cyan/30">
            <Sidebar
                onUploadClick={handleUploadClick}
                isOpen={isSidebarOpen}
                onClose={closeSidebar}
            />

            {/* Main content wrapper */}
            <div className="flex-1 lg:ml-64 flex flex-col min-h-screen">
                <Header onOpenSidebar={openSidebar} />

                {/* Main Content Area */}
                <main
                    className="flex-1 w-full max-w-[1400px] mx-auto p-4 lg:p-8 overflow-x-hidden"
                    id="main-content"
                    role="main"
                >
                    <div className="animate-fade-in w-full h-full">
                        <Outlet />
                    </div>
                </main>
            </div>
        </div>
    );
}
