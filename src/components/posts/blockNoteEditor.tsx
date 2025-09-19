'use client';

import { forwardRef, useEffect, useImperativeHandle, useState } from 'react';
import { useTheme } from 'next-themes';
import {
    Block,
    BlockNoteEditor as BlockNoteEditorType,
    PartialBlock,
} from '@blocknote/core';
import { useCreateBlockNote } from '@blocknote/react';
import { BlockNoteView } from '@blocknote/shadcn';
import '@blocknote/shadcn/style.css';
import * as ButtonComponent from '@/components/ui/button';
import * as DropdownMenu from '@/components/ui/dropdown-menu';

interface BlockNoteEditorProps {
    initialContent?: PartialBlock[];
    onChange?: (blocks: Block[]) => void;
    placeholder?: string;
    className?: string;
}

export interface BlockNoteEditorRef {
    getHTML: () => Promise<string>;
    getBlocks: () => Block[];
    editor: BlockNoteEditorType | null;
}

const BlockNoteEditor = forwardRef<BlockNoteEditorRef, BlockNoteEditorProps>(
    (
        {
            initialContent,
            onChange,
            placeholder = 'Start writing your blog post here...',
            className = 'min-h-[400px]',
        },
        ref
    ) => {
        const { resolvedTheme } = useTheme();
        const [isMounted, setIsMounted] = useState(false);

        // Create editor with initial content
        const editor = useCreateBlockNote({
            initialContent: initialContent || [
                {
                    type: 'paragraph',
                    content: placeholder,
                },
            ],
        });

        // Expose methods to parent component
        useImperativeHandle(
            ref,
            () => ({
                getHTML: async () => {
                    if (!editor) {
                        throw new Error('Editor not initialized');
                    }
                    try {
                        return await editor.blocksToFullHTML(editor.document);
                    } catch (error) {
                        console.error('Error generating HTML:', error);
                        throw new Error('Failed to generate HTML from content');
                    }
                },
                getBlocks: () => {
                    if (!editor) {
                        return [];
                    }
                    return editor.document;
                },
                editor: editor,
            }),
            [editor]
        );

        // Ensure client-side only rendering
        useEffect(() => {
            setIsMounted(true);
        }, []);

        // Handle content changes
        const handleChange = () => {
            if (onChange && editor) {
                onChange(editor.document);
            }
        };

        // Show loading state until mounted
        if (!isMounted) {
            return (
                <div
                    className={`bg-muted animate-pulse rounded-lg ${className}`}
                >
                    <div className="p-4">
                        <div className="bg-muted-foreground/20 mb-4 h-6 w-1/3 rounded"></div>
                        <div className="bg-muted-foreground/20 mb-2 h-4 w-full rounded"></div>
                        <div className="bg-muted-foreground/20 h-4 w-3/4 rounded"></div>
                    </div>
                </div>
            );
        }

        // Render editor only after mounting
        return (
            <div className={`bg-card rounded-lg border ${className}`}>
                <div className="p-4">
                    <BlockNoteView
                        editor={editor}
                        onChange={handleChange}
                        theme={resolvedTheme === 'dark' ? 'dark' : 'light'}
                        shadCNComponents={{
                            Button: ButtonComponent,
                            DropdownMenu,
                        }}
                    />
                </div>
            </div>
        );
    }
);

BlockNoteEditor.displayName = 'BlockNoteEditor';

export default BlockNoteEditor;
