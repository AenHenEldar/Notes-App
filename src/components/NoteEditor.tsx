import { useState, useEffect } from 'react';

interface NoteEditorProps {
  title: string;
  content: string;
  onSave: (title: string, content: string) => void | Promise<void>;
  onDelete: () => void | Promise<void>;
  onCancel?: () => void;
  isNew?: boolean;
}

export function NoteEditor({
  title,
  content,
  onSave,
  onDelete,
  onCancel,
  isNew = false,
}: NoteEditorProps) {
  const [editTitle, setEditTitle] = useState(title);
  const [editContent, setEditContent] = useState(content);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setEditTitle(title);
    setEditContent(content);
  }, [title, content]);

  async function handleSave() {
    setSaving(true);
    await onSave(editTitle, editContent);
    setSaving(false);
  }

  async function handleDelete() {
    if (confirm('Delete this note?')) {
      await onDelete();
    }
  }

  return (
    <div className="note-editor">
      <div className="note-editor-header">
        <input
          type="text"
          className="note-editor-title"
          placeholder="Note title"
          value={editTitle}
          onChange={(e) => setEditTitle(e.target.value)}
        />
        <div className="note-editor-actions">
          <button
            onClick={handleSave}
            disabled={saving}
            className="btn btn-primary btn-sm"
          >
            {saving ? 'Saving...' : 'Save'}
          </button>
          {onCancel && (
            <button onClick={onCancel} className="btn btn-ghost btn-sm">
              Cancel
            </button>
          )}
          {!isNew && (
            <button onClick={handleDelete} className="btn btn-danger btn-sm">
              Delete
            </button>
          )}
        </div>
      </div>
      <textarea
        className="note-editor-content"
        placeholder="Start writing..."
        value={editContent}
        onChange={(e) => setEditContent(e.target.value)}
      />
    </div>
  );
}
