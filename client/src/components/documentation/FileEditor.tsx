import { useState, useEffect } from "react";

type FileEditorProps = {
  content: string;
  onChange: (content: string) => void;
};

const FileEditor = ({ content, onChange }: FileEditorProps) => {
  const [editableContent, setEditableContent] = useState(content);
  
  useEffect(() => {
    setEditableContent(content);
  }, [content]);
  
  const handleContentChange = (e: React.FormEvent<HTMLDivElement>) => {
    const newContent = e.currentTarget.innerText;
    setEditableContent(newContent);
    onChange(newContent);
  };
  
  return (
    <div className="flex-1 overflow-y-auto p-8 notion-editor">
      <div
        className="outline-none text-[hsl(var(--dark-1))]"
        contentEditable
        suppressContentEditableWarning={true}
        onInput={handleContentChange}
        dangerouslySetInnerHTML={{ __html: formatContent(editableContent) }}
      />
    </div>
  );
};

const formatContent = (content: string): string => {
  if (!content) return '';
  
  let formatted = content
    .replace(/\n\n/g, '</p><p>')
    .replace(/\n/g, '<br>')
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    .replace(/\[\[(.*?)\]\]/g, '<span class="text-[hsl(var(--primary))]">$1</span>');
  
  // Wrap the content in paragraphs if it's not already
  if (!formatted.startsWith('<h1>') && !formatted.startsWith('<h2>') && !formatted.startsWith('<p>')) {
    formatted = `<p>${formatted}</p>`;
  }
  
  // Replace headers
  formatted = formatted
    .replace(/# (.*?)(\n|$)/g, '<h1 class="text-2xl font-bold text-white mb-6">$1</h1>')
    .replace(/## (.*?)(\n|$)/g, '<h2 class="text-xl font-semibold text-white mt-6 mb-3">$1</h2>')
    .replace(/### (.*?)(\n|$)/g, '<h3 class="text-lg font-semibold text-white mt-4 mb-2">$1</h3>');
  
  return formatted;
};

export default FileEditor;
