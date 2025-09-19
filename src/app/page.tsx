'use client';

import dynamic from 'next/dynamic';

const BlockNoteDemo = dynamic(() => import('@/components/Editor/demoEditor'), {
    ssr: false,
    loading: () => (
        <div className="flex items-center justify-center p-8">
            <div className="border-primary h-8 w-8 animate-spin rounded-full border-b-2"></div>
            <span className="text-muted-foreground ml-3">
                Loading editor...
            </span>
        </div>
    ),
});

export default function Home() {
    return (
        <div className="mx-24 mt-12">
            <BlockNoteDemo />
        </div>
    );
}
