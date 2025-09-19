'use client';

import { forwardRef } from 'react';
import dynamic from 'next/dynamic';
import { Block, PartialBlock } from '@blocknote/core';

// Import the ref type
export type { BlockNoteEditorRef } from './blockNoteEditor';

// Dynamic import with SSR disabled
const BlockNoteEditor = dynamic(() => import('./blockNoteEditor'), {
    ssr: false,
    loading: () => (
        <div className="bg-muted min-h-[400px] animate-pulse rounded-lg">
            <div className="p-4">
                <div className="bg-muted-foreground/20 mb-4 h-6 w-1/3 rounded"></div>
                <div className="bg-muted-foreground/20 mb-2 h-4 w-full rounded"></div>
                <div className="bg-muted-foreground/20 mb-2 h-4 w-3/4 rounded"></div>
                <div className="bg-muted-foreground/20 h-4 w-1/2 rounded"></div>
            </div>
        </div>
    ),
});

interface DynamicBlockNoteEditorProps {
    initialContent?: PartialBlock[];
    onChange?: (blocks: Block[]) => void;
    placeholder?: string;
    className?: string;
}

const DynamicBlockNoteEditor = forwardRef<any, DynamicBlockNoteEditorProps>(
    (props, ref) => {
        return <BlockNoteEditor {...props} ref={ref} />;
    }
);

DynamicBlockNoteEditor.displayName = 'DynamicBlockNoteEditor';

export default DynamicBlockNoteEditor;
