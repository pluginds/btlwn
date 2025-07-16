import { memo, useCallback, useState, useRef } from 'react';
import { classNames } from '~/utils/classNames';
import { IconButton } from '~/components/ui/IconButton';

interface DragDropFileManagerProps {
  onFileUpload: (files: FileList) => void;
  onFolderCreate: (name: string) => void;
  onFileCreate: (name: string) => void;
  className?: string;
}

export const DragDropFileManager = memo(({
  onFileUpload,
  onFolderCreate,
  onFileCreate,
  className,
}: DragDropFileManagerProps) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const [showCreateMenu, setShowCreateMenu] = useState(false);
  const [newItemName, setNewItemName] = useState('');
  const [createType, setCreateType] = useState<'file' | 'folder'>('file');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);

    const files = e.dataTransfer.files;
    if (files.length > 0) {
      onFileUpload(files);
    }
  }, [onFileUpload]);

  const handleFileInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      onFileUpload(files);
    }
    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  }, [onFileUpload]);

  const handleCreateItem = useCallback(() => {
    if (newItemName.trim()) {
      if (createType === 'file') {
        onFileCreate(newItemName.trim());
      } else {
        onFolderCreate(newItemName.trim());
      }
      setNewItemName('');
      setShowCreateMenu(false);
    }
  }, [newItemName, createType, onFileCreate, onFolderCreate]);

  const handleKeyPress = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleCreateItem();
    } else if (e.key === 'Escape') {
      setShowCreateMenu(false);
      setNewItemName('');
    }
  }, [handleCreateItem]);

  return (
    <div className={classNames('relative', className)}>
      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        multiple
        className="hidden"
        onChange={handleFileInputChange}
      />

      {/* Drag and drop overlay */}
      {isDragOver && (
        <div className="absolute inset-0 z-50 bg-bolt-elements-background-depth-1 bg-opacity-90 border-2 border-dashed border-bolt-elements-borderColorActive flex items-center justify-center">
          <div className="text-center">
            <div className="i-ph:upload-simple text-4xl text-bolt-elements-textSecondary mb-2" />
            <p className="text-bolt-elements-textPrimary font-medium">Drop files here to upload</p>
          </div>
        </div>
      )}

      {/* File manager toolbar */}
      <div className="flex items-center gap-2 p-2 bg-bolt-elements-background-depth-2 border-b border-bolt-elements-borderColor">
        <IconButton
          icon="i-ph:plus"
          size="sm"
          title="Create new file or folder"
          onClick={() => setShowCreateMenu(!showCreateMenu)}
        />
        <IconButton
          icon="i-ph:upload-simple"
          size="sm"
          title="Upload files"
          onClick={() => fileInputRef.current?.click()}
        />
        
        {/* Create menu */}
        {showCreateMenu && (
          <div className="absolute top-12 left-2 z-40 bg-bolt-elements-background-depth-1 border border-bolt-elements-borderColor rounded-lg shadow-lg p-2 min-w-[200px]">
            <div className="flex gap-1 mb-2">
              <button
                className={classNames(
                  'px-2 py-1 text-xs rounded',
                  createType === 'file'
                    ? 'bg-bolt-elements-item-backgroundAccent text-bolt-elements-item-contentAccent'
                    : 'bg-bolt-elements-item-backgroundDefault text-bolt-elements-item-contentDefault hover:bg-bolt-elements-item-backgroundActive'
                )}
                onClick={() => setCreateType('file')}
              >
                File
              </button>
              <button
                className={classNames(
                  'px-2 py-1 text-xs rounded',
                  createType === 'folder'
                    ? 'bg-bolt-elements-item-backgroundAccent text-bolt-elements-item-contentAccent'
                    : 'bg-bolt-elements-item-backgroundDefault text-bolt-elements-item-contentDefault hover:bg-bolt-elements-item-backgroundActive'
                )}
                onClick={() => setCreateType('folder')}
              >
                Folder
              </button>
            </div>
            <input
              type="text"
              value={newItemName}
              onChange={(e) => setNewItemName(e.target.value)}
              onKeyDown={handleKeyPress}
              placeholder={`${createType === 'file' ? 'File' : 'Folder'} name`}
              className="w-full px-2 py-1 text-sm bg-bolt-elements-background-depth-3 border border-bolt-elements-borderColor rounded focus:outline-none focus:border-bolt-elements-borderColorActive"
              autoFocus
            />
            <div className="flex gap-1 mt-2">
              <button
                onClick={handleCreateItem}
                className="px-2 py-1 text-xs bg-bolt-elements-button-primary-background text-bolt-elements-button-primary-text rounded hover:bg-bolt-elements-button-primary-backgroundHover"
              >
                Create
              </button>
              <button
                onClick={() => {
                  setShowCreateMenu(false);
                  setNewItemName('');
                }}
                className="px-2 py-1 text-xs bg-bolt-elements-button-secondary-background text-bolt-elements-button-secondary-text rounded hover:bg-bolt-elements-button-secondary-backgroundHover"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Drop zone (invisible overlay for drag and drop) */}
      <div
        className="absolute inset-0 z-10"
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      />
    </div>
  );
});