import { ReactNode } from 'react';

interface PageContainerProps {
    children: ReactNode;
    header?: ReactNode;
}

export function PageContainer({ children, header }: PageContainerProps) {
    return (
        <div className="flex flex-col h-full space-y-6 w-full animate-fade-in">
            {header && (
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-2">
                    {header}
                </div>
            )}
            <div className="w-full">
                {children}
            </div>
        </div>
    );
}

// Subcomponents for semantic structuring
export function PageHeader({ title, description, actions }: { title: string; description?: string; actions?: ReactNode }) {
    return (
        <>
            <div>
                <h1 className="text-2xl font-display font-bold text-white tracking-tight leading-tight">
                    {title}
                </h1>
                {description && (
                    <p className="text-sm text-[#849495] font-light mt-1 w-full max-w-2xl">
                        {description}
                    </p>
                )}
            </div>
            {actions && <div className="mt-4 md:mt-0">{actions}</div>}
        </>
    );
}
