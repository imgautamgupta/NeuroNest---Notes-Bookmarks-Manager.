'use client';

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Link from '@tiptap/extension-link';
import Placeholder from '@tiptap/extension-placeholder';
import {
    Bold,
    Italic,
    List,
    ListOrdered,
    Code,
    Heading1,
    Heading2,
    Undo,
    Redo
} from 'lucide-react';
import { cn } from '@/utils/cn';

interface EditorProps {
    content: string;
    onChange: (content: string) => void;
    placeholder?: string;
}

export function Editor({ content, onChange, placeholder }: EditorProps) {
    const editor = useEditor({
        extensions: [
            StarterKit,
            Link.configure({ openOnClick: false }),
            Placeholder.configure({ placeholder: placeholder || 'Start typing your note...' })
        ],
        content: content,
        immediatelyRender: false, // Fix SSR hydration issue
        onUpdate: ({ editor }) => {
            onChange(editor.getHTML());
        }
    });

    if (!editor) return null;

    const MenuButton = ({ onClick, isActive, disabled, icon: Icon, label }: any) => (
        <button
            type="button"
            onClick={onClick}
            disabled={disabled}
            className={cn(
                "p-2 rounded-lg transition-all duration-150 border-none",
                isActive
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "text-muted-foreground hover:bg-accent hover:text-foreground",
                disabled && "opacity-30 cursor-not-allowed"
            )}
            title={label}
        >
            <Icon className="w-4 h-4" />
        </button>
    );

    return (
        <div className="border-2 border-border rounded-xl overflow-hidden bg-card focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20 transition-all">
            {/* Toolbar */}
            <div className="flex items-center gap-0.5 p-2 border-b border-border bg-muted/50">
                <MenuButton
                    onClick={() => editor.chain().focus().toggleBold().run()}
                    isActive={editor.isActive('bold')}
                    icon={Bold}
                    label="Bold (Ctrl+B)"
                />
                <MenuButton
                    onClick={() => editor.chain().focus().toggleItalic().run()}
                    isActive={editor.isActive('italic')}
                    icon={Italic}
                    label="Italic (Ctrl+I)"
                />

                <div className="w-px h-5 bg-border mx-1.5" />

                <MenuButton
                    onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
                    isActive={editor.isActive('heading', { level: 1 })}
                    icon={Heading1}
                    label="Heading 1"
                />
                <MenuButton
                    onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
                    isActive={editor.isActive('heading', { level: 2 })}
                    icon={Heading2}
                    label="Heading 2"
                />

                <div className="w-px h-5 bg-border mx-1.5" />

                <MenuButton
                    onClick={() => editor.chain().focus().toggleBulletList().run()}
                    isActive={editor.isActive('bulletList')}
                    icon={List}
                    label="Bullet List"
                />
                <MenuButton
                    onClick={() => editor.chain().focus().toggleOrderedList().run()}
                    isActive={editor.isActive('orderedList')}
                    icon={ListOrdered}
                    label="Numbered List"
                />
                <MenuButton
                    onClick={() => editor.chain().focus().toggleCodeBlock().run()}
                    isActive={editor.isActive('codeBlock')}
                    icon={Code}
                    label="Code Block"
                />

                <div className="flex-1" />

                <MenuButton
                    onClick={() => editor.chain().focus().undo().run()}
                    disabled={!editor.can().undo()}
                    icon={Undo}
                    label="Undo (Ctrl+Z)"
                />
                <MenuButton
                    onClick={() => editor.chain().focus().redo().run()}
                    disabled={!editor.can().redo()}
                    icon={Redo}
                    label="Redo (Ctrl+Y)"
                />
            </div>

            {/* Editor Content */}
            <div
                className="p-4 min-h-[220px] max-h-[400px] overflow-y-auto cursor-text prose prose-sm dark:prose-invert max-w-none"
                onClick={() => editor.chain().focus()}
            >
                <EditorContent editor={editor} />
            </div>
        </div>
    );
}
