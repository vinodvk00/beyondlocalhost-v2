'use client';

import { useState } from 'react';
import { useTheme } from 'next-themes';
import { useCreateBlockNote } from '@blocknote/react';
import { BlockNoteView } from '@blocknote/shadcn';
import '@blocknote/shadcn/style.css';
import * as Button from '@/components/ui/button';
import * as DropdownMenu from '@/components/ui/dropdown-menu';

// Demo component to test BlockNote editor
export default function BlockNoteDemo() {
    const { theme, resolvedTheme } = useTheme();

    // State for storing outputs
    const [jsonOutput, setJsonOutput] = useState<string>('');
    const [htmlOutput, setHtmlOutput] = useState<string>('');
    const [standardHtmlOutput, setStandardHtmlOutput] = useState<string>('');
    const [markdownOutput, setMarkdownOutput] = useState<string>('');
    const [showOutputs, setShowOutputs] = useState<boolean>(false);
    // Create a new editor instance
    const editor = useCreateBlockNote({
        initialContent: [
            {
                type: 'paragraph',
                content: 'Welcome to BlockNote! 👋',
            },
            {
                type: 'paragraph',
                content: 'This is a demo editor. Try:',
            },
            {
                type: 'paragraph',
                content: '• Type / to see the slash menu',
            },
            {
                type: 'paragraph',
                content: '• Select text to see formatting options',
            },
            {
                type: 'paragraph',
                content: '• Press Enter to create new blocks',
            },
            {
                type: 'heading',
                props: {
                    level: 2,
                },
                content: 'Features to explore:',
            },
            {
                type: 'paragraph',
                content: 'Try creating headings, lists, and other blocks!',
            },
        ],
    });

    const handleSave = () => {
        // Get the editor content as JSON
        const content = editor.document;
        const jsonString = JSON.stringify(content, null, 2);

        setJsonOutput(jsonString);
        setShowOutputs(true);

        console.log('Editor content (JSON):', jsonString);
        alert('JSON content saved! Check output below and console.');
    };

    const handleSaveAsHTML = async () => {
        try {
            // Get full HTML with BlockNote styling
            const fullHTML = await editor.blocksToFullHTML(editor.document);
            const standardHTML = await editor.blocksToHTMLLossy(
                editor.document
            );

            setHtmlOutput(fullHTML);
            setStandardHtmlOutput(standardHTML);
            setShowOutputs(true);

            console.log('Full HTML (with BlockNote styling):', fullHTML);
            console.log('Standard HTML (lossy):', standardHTML);

            alert('HTML content saved! Check output below and console.');
        } catch (error) {
            console.error('Error converting to HTML:', error);
            alert('Error converting to HTML. Check console for details.');
        }
    };

    const handleSaveAsMarkdown = async () => {
        try {
            const markdown = await editor.blocksToMarkdownLossy(
                editor.document
            );

            setMarkdownOutput(markdown);
            setShowOutputs(true);

            console.log('Markdown (lossy):', markdown);
            alert('Markdown content saved! Check output below and console.');
        } catch (error) {
            console.error('Error converting to Markdown:', error);
            alert('Error converting to Markdown. Check console for details.');
        }
    };

    const handleShowAllFormats = async () => {
        try {
            const content = editor.document;
            const fullHTML = await editor.blocksToFullHTML(editor.document);
            const standardHTML = await editor.blocksToHTMLLossy(
                editor.document
            );
            const markdown = await editor.blocksToMarkdownLossy(
                editor.document
            );

            const jsonString = JSON.stringify(content, null, 2);

            setJsonOutput(jsonString);
            setHtmlOutput(fullHTML);
            setStandardHtmlOutput(standardHTML);
            setMarkdownOutput(markdown);
            setShowOutputs(true);

            console.log('=== ALL FORMATS ===');
            console.log('1. JSON (Native):', jsonString);
            console.log('2. Full HTML:', fullHTML);
            console.log('3. Standard HTML:', standardHTML);
            console.log('4. Markdown:', markdown);
            console.log('===================');

            alert('All formats saved! Check outputs below and console.');
        } catch (error) {
            console.error('Error converting formats:', error);
            alert('Error converting formats. Check console for details.');
        }
    };

    const handleClear = () => {
        editor.removeBlocks(editor.document);
        setJsonOutput('');
        setHtmlOutput('');
        setStandardHtmlOutput('');
        setMarkdownOutput('');
        setShowOutputs(false);
    };

    return (
        <div className="mx-auto max-w-4xl p-6">
            <div className="mb-4">
                <h1 className="mb-2 text-2xl font-bold">
                    BlockNote Demo Editor
                </h1>
                <p className="text-muted-foreground mb-4">
                    Test the editor functionality before integrating into blog
                    posts
                </p>

                <div className="mb-4 flex flex-wrap gap-2">
                    <Button.Button onClick={handleSave} variant="default">
                        Save as JSON
                    </Button.Button>
                    <Button.Button
                        onClick={handleSaveAsHTML}
                        variant="secondary"
                    >
                        Save as HTML
                    </Button.Button>
                    <Button.Button
                        onClick={handleSaveAsMarkdown}
                        variant="secondary"
                    >
                        Save as Markdown
                    </Button.Button>
                    <Button.Button
                        onClick={handleShowAllFormats}
                        variant="outline"
                    >
                        Show All Formats
                    </Button.Button>
                    <Button.Button onClick={handleClear} variant="destructive">
                        Clear Editor
                    </Button.Button>
                </div>
            </div>

            {/* BlockNote Editor */}
            <div className="bg-card rounded-lg border p-4">
                <BlockNoteView
                    editor={editor}
                    shadCNComponents={{
                        Button,
                        DropdownMenu,
                        // Add other components as needed
                    }}
                    theme={resolvedTheme === 'dark' ? 'dark' : 'light'}
                />
            </div>

            {/* Instructions */}
            <div className="bg-muted mt-6 rounded-lg p-4">
                <h3 className="mb-2 font-semibold">Instructions & Testing:</h3>
                <ul className="space-y-1 text-sm">
                    <li>• Type content and press Enter for new blocks</li>
                    <li>• Type "/" to open the slash menu for block types</li>
                    <li>• Select text to see formatting toolbar</li>
                    <li>• Use keyboard shortcuts (Ctrl+B for bold, etc.)</li>
                </ul>

                <h4 className="mt-3 mb-2 font-semibold">
                    Output Format Testing:
                </h4>
                <ul className="space-y-1 text-sm">
                    <li>
                        • <strong>JSON</strong>: Native format for database
                        storage (lossless)
                    </li>
                    <li>
                        • <strong>HTML</strong>: For displaying posts with
                        proper styling
                    </li>
                    <li>
                        • <strong>Markdown</strong>: For compatibility with
                        other systems
                    </li>
                    <li>
                        • <strong>All Formats</strong>: Compare all output
                        formats
                    </li>
                    <li>• Outputs shown below and logged to console</li>
                </ul>
            </div>

            {/* Output Display */}
            {showOutputs && (
                <div className="mt-8 space-y-6">
                    <h2 className="text-xl font-bold">Output Results</h2>

                    {/* JSON Output */}
                    {jsonOutput && (
                        <div className="rounded-lg border">
                            <div className="bg-muted border-b px-4 py-2">
                                <h3 className="font-semibold">
                                    JSON Format (Database Storage)
                                </h3>
                                <p className="text-muted-foreground text-sm">
                                    Lossless, native BlockNote format
                                </p>
                            </div>
                            <pre className="bg-background overflow-x-auto p-4 text-sm">
                                <code>{jsonOutput}</code>
                            </pre>
                        </div>
                    )}

                    {/* Full HTML Output */}
                    {htmlOutput && (
                        <div className="rounded-lg border">
                            <div className="bg-muted border-b px-4 py-2">
                                <h3 className="font-semibold">
                                    Full HTML (With BlockNote Styling)
                                </h3>
                                <p className="text-muted-foreground text-sm">
                                    Best for blog post display
                                </p>
                            </div>
                            <div className="space-y-4 p-4">
                                <div>
                                    <h4 className="mb-2 font-medium">
                                        Rendered Output:
                                    </h4>
                                    <div
                                        className="bg-background rounded border p-4"
                                        dangerouslySetInnerHTML={{
                                            __html: htmlOutput,
                                        }}
                                    />
                                </div>
                                <div>
                                    <h4 className="mb-2 font-medium">
                                        HTML Code:
                                    </h4>
                                    <pre className="bg-muted overflow-x-auto rounded p-2 text-xs">
                                        <code>{htmlOutput}</code>
                                    </pre>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Standard HTML Output */}
                    {standardHtmlOutput && (
                        <div className="rounded-lg border">
                            <div className="bg-muted border-b px-4 py-2">
                                <h3 className="font-semibold">
                                    Standard HTML (Lossy)
                                </h3>
                                <p className="text-muted-foreground text-sm">
                                    Simplified HTML without BlockNote styling
                                </p>
                            </div>
                            <div className="space-y-4 p-4">
                                <div>
                                    <h4 className="mb-2 font-medium">
                                        Rendered Output:
                                    </h4>
                                    <div
                                        className="bg-background rounded border p-4"
                                        dangerouslySetInnerHTML={{
                                            __html: standardHtmlOutput,
                                        }}
                                    />
                                </div>
                                <div>
                                    <h4 className="mb-2 font-medium">
                                        HTML Code:
                                    </h4>
                                    <pre className="bg-muted overflow-x-auto rounded p-2 text-xs">
                                        <code>{standardHtmlOutput}</code>
                                    </pre>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Markdown Output */}
                    {markdownOutput && (
                        <div className="rounded-lg border">
                            <div className="bg-muted border-b px-4 py-2">
                                <h3 className="font-semibold">
                                    Markdown Format
                                </h3>
                                <p className="text-muted-foreground text-sm">
                                    Lossy conversion, good for portability
                                </p>
                            </div>
                            <pre className="bg-background overflow-x-auto p-4 text-sm">
                                <code>{markdownOutput}</code>
                            </pre>
                        </div>
                    )}

                    {/* Clear Outputs Button */}
                    <div className="flex justify-center">
                        <Button.Button
                            onClick={() => setShowOutputs(false)}
                            variant="outline"
                        >
                            Hide Outputs
                        </Button.Button>
                    </div>
                </div>
            )}
        </div>
    );
}
