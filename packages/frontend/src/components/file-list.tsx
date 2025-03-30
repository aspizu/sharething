import {Upload} from "lucide-react"
import {FileEntry, FileEntryProps} from "./file-entry"

interface FileListProps {
    files: FileEntryProps[]
    onRemove?: (id: string) => void
}

export function FileList({files, onRemove}: FileListProps) {
    if (files.length > 0) {
        return (
            <div className="space-y-2">
                <h2 className="text-muted-foreground text-sm font-medium">
                    Recently uploaded
                </h2>
                <div className="space-y-2">
                    {files.map((file) => (
                        <FileEntry key={file.id} {...file} onRemove={onRemove} />
                    ))}
                </div>
            </div>
        )
    } else {
        return (
            <div className="flex flex-col items-center justify-center rounded-xl border py-12 text-center shadow-sm">
                <Upload size="48" className="text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium">No files uploaded yet</h3>
                <p className="text-muted-foreground text-sm">
                    Upload your first file to get started
                </p>
            </div>
        )
    }
}
