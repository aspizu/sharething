import {formatDistanceToNow} from "date-fns"
import {Eye, Link, Upload, X} from "lucide-react"
import prettyBytes from "pretty-bytes"
import {useState} from "react"
import {toast} from "sonner"
import {ActionButton} from "./action-button"
import {FileIcon} from "./file-icon"
import {PreviewDialog} from "./preview-dialog"

export interface FileEntryProps {
    id: string
    name: string
    type: string
    url: string
    size: number
    createdAt: number
    onRemove?: (id: string) => void
}

export function FileEntry({
    id,
    name,
    type,
    url,
    size,
    createdAt,
    onRemove,
}: FileEntryProps) {
    const [isPreviewOpen, setIsPreviewOpen] = useState(false)
    const onCopyLinkClick = () => {
        navigator.clipboard.writeText(url)
        toast.success("Copied link to clipboard")
    }

    const handleRemove = () => onRemove?.(id)

    return (
        <>
            <div className="group border-border hover:bg-muted/50 flex items-center gap-3 rounded-lg border p-3 transition-colors">
                <FileIcon name={name} type={type} />

                <div className="min-w-0 flex-1">
                    <p className="truncate font-medium">{name}</p>
                    <div className="text-muted-foreground flex gap-2 text-xs">
                        <span>{prettyBytes(size)}</span>
                        <span>•</span>
                        <time dateTime={new Date(createdAt).toISOString()}>
                            uploaded {formatDistanceToNow(createdAt)} ago
                        </time>
                    </div>
                </div>

                <div className="ml-auto flex gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                    <ActionButton onClick={onCopyLinkClick} tooltip="Copy link">
                        <Link size={16} />
                    </ActionButton>

                    <ActionButton asChild tooltip="Open in new tab">
                        <a href={url} target="_blank" rel="noreferrer">
                            <Upload size={16} />
                        </a>
                    </ActionButton>

                    <ActionButton
                        tooltip="Preview"
                        onClick={() => setIsPreviewOpen(true)}
                    >
                        <Eye size={16} />
                    </ActionButton>

                    {onRemove && (
                        <ActionButton onClick={handleRemove} tooltip="Forget">
                            <X size={16} />
                        </ActionButton>
                    )}
                </div>
            </div>

            <PreviewDialog
                type={type}
                url={url}
                name={name}
                open={isPreviewOpen}
                onOpenChange={setIsPreviewOpen}
            />
        </>
    )
}
