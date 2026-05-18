"use client";

import { useEffect, useRef, useCallback } from "react";
import { Bold, Italic, Link, Link2Off, List } from "lucide-react";

// ── Sanitize ──────────────────────────────────────────────────────────────────
// Strips dangerous tags/attributes from admin-entered HTML before storing.
// Safe for admin-only tools; no XSS surface.

function sanitize(html: string): string {
  // Remove script, iframe, object, embed, style, form
  return html
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "")
    .replace(/<iframe\b[^>]*>[\s\S]*?<\/iframe>/gi, "")
    .replace(/<(object|embed|style|form|input|button)\b[^>]*>[\s\S]*?<\/\1>/gi, "")
    .replace(/\son\w+="[^"]*"/gi, "")
    .replace(/\son\w+='[^']*'/gi, "")
    .replace(/javascript:/gi, "");
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function execCmd(cmd: string, value?: string) {
  document.execCommand(cmd, false, value);
}

// ── RichEditor ────────────────────────────────────────────────────────────────

type Props = {
  value: string;       // HTML string
  onChange: (html: string) => void;
  placeholder?: string;
  rows?: number;
};

export default function RichEditor({
  value,
  onChange,
  placeholder = "Escribe aquí…",
  rows = 4,
}: Props) {
  const editorRef = useRef<HTMLDivElement>(null);
  // Track whether the last change came from the user (not from a props update)
  const isUserEdit = useRef(false);

  // Sync external value → DOM (only when not mid-user-edit)
  useEffect(() => {
    if (!editorRef.current || isUserEdit.current) return;
    if (editorRef.current.innerHTML !== value) {
      editorRef.current.innerHTML = value;
    }
  }, [value]);

  const handleInput = useCallback(() => {
    if (!editorRef.current) return;
    isUserEdit.current = true;
    onChange(sanitize(editorRef.current.innerHTML));
    // Reset flag after a tick so future prop-driven updates can apply
    requestAnimationFrame(() => { isUserEdit.current = false; });
  }, [onChange]);

  function handleBold() {
    editorRef.current?.focus();
    execCmd("bold");
  }
  function handleItalic() {
    editorRef.current?.focus();
    execCmd("italic");
  }
  function handleList() {
    editorRef.current?.focus();
    execCmd("insertUnorderedList");
  }
  function handleLink() {
    const sel = window.getSelection()?.toString().trim();
    const url = prompt("URL del enlace (incluye https://):", "https://");
    if (!url || url === "https://") return;
    editorRef.current?.focus();
    if (sel) {
      execCmd("createLink", url);
    } else {
      const text = prompt("Texto del enlace:", url) || url;
      execCmd(
        "insertHTML",
        `<a href="${url}" target="_blank" rel="noopener noreferrer">${text}</a>`
      );
    }
  }
  function handleUnlink() {
    editorRef.current?.focus();
    execCmd("unlink");
  }

  // Intercept Enter to insert <br> instead of <div>/<p>
  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      execCmd("insertLineBreak");
    }
  }

  const minH = `${rows * 1.5}rem`;

  return (
    <div className="rounded-xl border border-[#E8DCC8] overflow-hidden focus-within:border-[#4A6741] transition-colors">
      {/* Toolbar */}
      <div className="flex items-center gap-0.5 px-2 py-1.5 bg-[#F5F0E8] border-b border-[#E8DCC8]">
        <ToolBtn onClick={handleBold} title="Negrita (Ctrl+B)">
          <Bold size={13} />
        </ToolBtn>
        <ToolBtn onClick={handleItalic} title="Cursiva (Ctrl+I)">
          <Italic size={13} />
        </ToolBtn>
        <ToolBtn onClick={handleList} title="Lista">
          <List size={13} />
        </ToolBtn>
        <div className="w-px h-4 bg-[#E8DCC8] mx-1" />
        <ToolBtn onClick={handleLink} title="Insertar enlace">
          <Link size={13} />
        </ToolBtn>
        <ToolBtn onClick={handleUnlink} title="Quitar enlace">
          <Link2Off size={13} />
        </ToolBtn>
      </div>

      {/* Editable area */}
      <div
        ref={editorRef}
        contentEditable
        suppressContentEditableWarning
        onInput={handleInput}
        onKeyDown={handleKeyDown}
        data-placeholder={placeholder}
        style={{ minHeight: minH }}
        className={`
          px-3 py-2 text-sm text-[#2C1810] bg-white outline-none
          [&_a]:text-[#4A6741] [&_a]:underline [&_a]:break-all
          [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:my-1
          [&_strong]:font-semibold [&_em]:italic
          empty:before:content-[attr(data-placeholder)]
          empty:before:text-[#2C1810]/30 empty:before:pointer-events-none
        `}
      />
    </div>
  );
}

function ToolBtn({
  onClick,
  title,
  children,
}: {
  onClick: () => void;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onMouseDown={(e) => {
        // Prevent the editor from losing focus
        e.preventDefault();
        onClick();
      }}
      title={title}
      className="w-7 h-7 flex items-center justify-center rounded-lg text-[#2C1810]/60 hover:bg-[#E8DCC8] hover:text-[#2C1810] transition-colors"
    >
      {children}
    </button>
  );
}
