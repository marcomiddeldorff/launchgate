import { FileText, ImageIcon, Paperclip, Upload, X } from 'lucide-react';
import { useRef, useState } from 'react';
import type { DragEvent } from 'react';

import { Button } from '@/components/ui/button';
import { formatBytes } from '@/lib/format';
import { cn } from '@/lib/utils';
import type { Attachment } from '@/types';

export function AttachmentList({ attachments }: { attachments: Attachment[] }) {
    if (attachments.length === 0) {
        return <p className="text-sm text-muted-foreground">Keine Anhänge.</p>;
    }

    return (
        <ul className="grid gap-2 sm:grid-cols-2">
            {attachments.map((attachment) => {
                const isImage = attachment.mimeType.startsWith('image/');
                const Icon = isImage ? ImageIcon : FileText;

                return (
                    <li key={attachment.id}>
                        <a
                            href={attachment.url}
                            className="flex items-center gap-3 rounded-lg border p-2.5 transition-colors hover:border-primary/40 hover:bg-accent/50"
                        >
                            <span className="flex size-9 shrink-0 items-center justify-center rounded-md bg-muted text-muted-foreground">
                                <Icon className="size-4" aria-hidden />
                            </span>
                            <span className="min-w-0 flex-1">
                                <span className="block truncate text-sm font-medium">
                                    {attachment.name}
                                </span>
                                <span className="text-xs text-muted-foreground">
                                    {formatBytes(attachment.sizeBytes)}
                                </span>
                            </span>
                        </a>
                    </li>
                );
            })}
        </ul>
    );
}

type LocalFile = { id: string; name: string; size: number };

/**
 * Drag-and-drop file upload (demo only — files are held in local state and not
 * sent anywhere). Keyboard-accessible via the "Datei auswählen" button.
 */
export function FileUploader({
    label = 'Dateien hierher ziehen oder auswählen',
    hint = 'PNG, JPG oder PDF · bis 10 MB',
}: {
    label?: string;
    hint?: string;
}) {
    const [files, setFiles] = useState<LocalFile[]>([]);
    const [dragging, setDragging] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);

    const addFiles = (list: FileList | null) => {
        if (!list) {
            return;
        }

        const mapped = Array.from(list).map((file) => ({
            id: `${file.name}-${file.size}-${Math.random().toString(36).slice(2)}`,
            name: file.name,
            size: file.size,
        }));

        setFiles((prev) => [...prev, ...mapped]);
    };

    const onDrop = (event: DragEvent) => {
        event.preventDefault();
        setDragging(false);
        addFiles(event.dataTransfer.files);
    };

    return (
        <div className="space-y-3">
            <div
                onDragOver={(e) => {
                    e.preventDefault();
                    setDragging(true);
                }}
                onDragLeave={() => setDragging(false)}
                onDrop={onDrop}
                className={cn(
                    'flex flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed p-6 text-center transition-colors',
                    dragging ? 'border-primary bg-primary/5' : 'border-border',
                )}
            >
                <span className="flex size-10 items-center justify-center rounded-full bg-muted text-muted-foreground">
                    <Upload className="size-5" aria-hidden />
                </span>
                <p className="text-sm font-medium">{label}</p>
                <p className="text-xs text-muted-foreground">{hint}</p>
                <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => inputRef.current?.click()}
                >
                    <Paperclip /> Datei auswählen
                </Button>
                <input
                    ref={inputRef}
                    type="file"
                    multiple
                    className="sr-only"
                    onChange={(e) => addFiles(e.target.files)}
                    aria-label="Datei auswählen"
                />
            </div>

            {files.length > 0 && (
                <ul className="space-y-2">
                    {files.map((file) => (
                        <li
                            key={file.id}
                            className="flex items-center gap-3 rounded-md border p-2 text-sm"
                        >
                            <FileText
                                className="size-4 text-muted-foreground"
                                aria-hidden
                            />
                            <span className="min-w-0 flex-1 truncate">
                                {file.name}
                            </span>
                            <span className="text-xs text-muted-foreground">
                                {formatBytes(file.size)}
                            </span>
                            <button
                                type="button"
                                onClick={() =>
                                    setFiles((prev) =>
                                        prev.filter((f) => f.id !== file.id),
                                    )
                                }
                                className="text-muted-foreground hover:text-foreground"
                                aria-label={`${file.name} entfernen`}
                            >
                                <X className="size-4" />
                            </button>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}
