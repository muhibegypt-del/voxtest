import { useState, useRef, useEffect } from 'react';
import {
  Bold,
  Italic,
  Underline,
  List,
  ListOrdered,
  Quote,
  Code,
  Link,
  Image,
  Heading1,
  Heading2,
  Heading3,
} from 'lucide-react';

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  minHeight?: string;
}

export default function RichTextEditor({
  value,
  onChange,
  placeholder = 'Start writing...',
  minHeight = '400px',
}: RichTextEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null);
  const [isFocused, setIsFocused] = useState(false);

  useEffect(() => {
    if (editorRef.current && editorRef.current.innerText !== value) {
      const selection = window.getSelection();
      const range = selection?.getRangeAt(0);
      const startOffset = range?.startOffset || 0;

      editorRef.current.innerText = value;

      if (selection && range && editorRef.current.firstChild) {
        try {
          const newRange = document.createRange();
          newRange.setStart(editorRef.current.firstChild, Math.min(startOffset, value.length));
          newRange.collapse(true);
          selection.removeAllRanges();
          selection.addRange(newRange);
        } catch (e) {
        }
      }
    }
  }, [value]);

  const handleInput = () => {
    if (editorRef.current) {
      onChange(editorRef.current.innerText);
    }
  };

  const applyFormat = (format: string, value?: string) => {
    document.execCommand(format, false, value);
    editorRef.current?.focus();
  };

  const insertLink = () => {
    const url = prompt('Enter URL:');
    if (url) {
      applyFormat('createLink', url);
    }
  };

  const insertImage = () => {
    const url = prompt('Enter image URL:');
    if (url) {
      applyFormat('insertImage', url);
    }
  };

  const formatHeading = (level: number) => {
    applyFormat('formatBlock', `h${level}`);
  };

  const toolbarButtons = [
    {
      icon: <Bold size={18} />,
      command: () => applyFormat('bold'),
      title: 'Bold (Ctrl+B)',
    },
    {
      icon: <Italic size={18} />,
      command: () => applyFormat('italic'),
      title: 'Italic (Ctrl+I)',
    },
    {
      icon: <Underline size={18} />,
      command: () => applyFormat('underline'),
      title: 'Underline (Ctrl+U)',
    },
    {
      icon: <Heading1 size={18} />,
      command: () => formatHeading(1),
      title: 'Heading 1',
    },
    {
      icon: <Heading2 size={18} />,
      command: () => formatHeading(2),
      title: 'Heading 2',
    },
    {
      icon: <Heading3 size={18} />,
      command: () => formatHeading(3),
      title: 'Heading 3',
    },
    {
      icon: <List size={18} />,
      command: () => applyFormat('insertUnorderedList'),
      title: 'Bullet List',
    },
    {
      icon: <ListOrdered size={18} />,
      command: () => applyFormat('insertOrderedList'),
      title: 'Numbered List',
    },
    {
      icon: <Quote size={18} />,
      command: () => applyFormat('formatBlock', 'blockquote'),
      title: 'Quote',
    },
    {
      icon: <Code size={18} />,
      command: () => applyFormat('formatBlock', 'pre'),
      title: 'Code Block',
    },
    {
      icon: <Link size={18} />,
      command: insertLink,
      title: 'Insert Link',
    },
    {
      icon: <Image size={18} />,
      command: insertImage,
      title: 'Insert Image',
    },
  ];

  return (
    <div className="border border-gray-300 rounded-lg overflow-hidden bg-white">
      <div className="bg-gray-50 border-b border-gray-300 p-2 flex flex-wrap gap-1">
        {toolbarButtons.map((button, index) => (
          <button
            key={index}
            type="button"
            onClick={button.command}
            title={button.title}
            className="p-2 hover:bg-gray-200 rounded transition-colors text-gray-700 hover:text-gray-900"
          >
            {button.icon}
          </button>
        ))}
      </div>
      <div
        ref={editorRef}
        contentEditable
        onInput={handleInput}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        className={`p-4 focus:outline-none prose prose-sm max-w-none ${
          isFocused ? 'ring-2 ring-blue-500 ring-inset' : ''
        }`}
        style={{ minHeight }}
        data-placeholder={placeholder}
      />
      <style>{`
        [contenteditable][data-placeholder]:empty:before {
          content: attr(data-placeholder);
          color: #9ca3af;
          pointer-events: none;
        }
        [contenteditable] h1 {
          font-size: 2em;
          font-weight: bold;
          margin: 0.67em 0;
        }
        [contenteditable] h2 {
          font-size: 1.5em;
          font-weight: bold;
          margin: 0.75em 0;
        }
        [contenteditable] h3 {
          font-size: 1.17em;
          font-weight: bold;
          margin: 0.83em 0;
        }
        [contenteditable] blockquote {
          border-left: 4px solid #e5e7eb;
          padding-left: 1em;
          margin: 1em 0;
          color: #6b7280;
        }
        [contenteditable] pre {
          background: #f3f4f6;
          padding: 1em;
          border-radius: 0.375rem;
          overflow-x: auto;
          font-family: monospace;
        }
        [contenteditable] ul, [contenteditable] ol {
          padding-left: 2em;
          margin: 1em 0;
        }
        [contenteditable] a {
          color: #3b82f6;
          text-decoration: underline;
        }
        [contenteditable] img {
          max-width: 100%;
          height: auto;
          border-radius: 0.375rem;
        }
      `}</style>
    </div>
  );
}
