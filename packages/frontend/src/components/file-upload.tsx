import {cn} from "@/lib/utils"
import {Upload, X} from "lucide-react"
import prettyBytes from "pretty-bytes"
import {RefObject, useId, useRef, useState} from "react"
import {FileIcon} from "./file-icon"
import {Button} from "./ui/button"
import {Label} from "./ui/label"
import {Progress} from "./ui/progress"
import {Switch} from "./ui/switch"
import {Tooltip, TooltipContent, TooltipProvider, TooltipTrigger} from "./ui/tooltip"

function truncateFileName(name: string, maxLength = 12) {
    if (name.length <= maxLength) return name
    return `${name.substring(0, maxLength / 2)}...${name.substring(name.length - maxLength / 2)}`
}

function FileCell({file, onRemove}: {file: File; onRemove?: () => void}) {
    return (
        <TooltipProvider>
            <Tooltip>
                <TooltipTrigger asChild>
                    <div className="group dark:hover:bg-muted/50 relative flex h-24 w-24 flex-col items-center justify-center rounded-md border shadow-xs transition-all hover:shadow-md">
                        <FileIcon
                            name={file.name}
                            type={file.type}
                            className="h-6 w-6"
                        />
                        <span
                            className="mt-2 max-w-full px-1 text-center text-xs font-semibold"
                            title={file.name} // Show full name on hover
                        >
                            {truncateFileName(file.name)}
                        </span>
                        <span className="text-muted-foreground absolute bottom-1 left-1/2 -translate-x-1/2 text-xs">
                            {prettyBytes(file.size)}
                        </span>
                        {onRemove && (
                            <button
                                onClick={(e) => {
                                    e.preventDefault()
                                    onRemove()
                                }}
                                className="bg-muted absolute top-1 right-1 rounded-full p-1 opacity-0 transition-opacity group-hover:opacity-100"
                            >
                                <X size={10} />
                            </button>
                        )}
                    </div>
                </TooltipTrigger>
                <TooltipContent>{file.name}</TooltipContent>
            </Tooltip>
        </TooltipProvider>
    )
}

function FileInput({
    rf,
    addFiles,
}: {
    rf: RefObject<HTMLInputElement | null>
    addFiles: (files: FileList) => void
}) {
    return (
        <div className="group relative">
            <div className="border-muted-foreground/20 bg-background flex h-24 w-24 flex-col items-center justify-center gap-2 rounded-lg border border-dashed transition-colors focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-500/50 hover:border-blue-500 hover:bg-blue-50/50 dark:hover:bg-blue-900/10">
                <Upload size={16} className="text-muted-foreground" />
                <span className="text-muted-foreground text-xs">Add files</span>
            </div>
            <input
                ref={rf}
                type="file"
                className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
                multiple
                onChange={(event) => {
                    if (event.target.files) {
                        addFiles(event.target.files)
                        event.target.value = ""
                    }
                }}
                aria-label="File input"
            />
        </div>
    )
}

export interface FileUploadProps {
    onUpload(files: File[], options: {archive: boolean}): Promise<void>
    isUploading: boolean
    progress: number
}

export default function FileUpload({onUpload, isUploading, progress}: FileUploadProps) {
    const inputRef = useRef<HTMLInputElement>(null)
    const [files, setFiles] = useState<File[]>([])
    const [isArchive, setIsArchive] = useState(false)
    const id = useId()
    function addFiles(newfiles: FileList) {
        setFiles([...files, ...newfiles])
    }
    return (
        <div className="flex flex-col gap-4 rounded-lg border p-4">
            <div className="flex items-center">
                {files.length > 1 && (
                    <div className="flex items-center gap-2">
                        <Label htmlFor={id} className={isUploading ? "opacity-50" : ""}>
                            Add to archive
                        </Label>
                        <Switch
                            id={id}
                            disabled={isUploading}
                            checked={isArchive}
                            onCheckedChange={setIsArchive}
                        />
                    </div>
                )}
                <Button
                    className="ml-auto"
                    disabled={isUploading}
                    onClick={() => {
                        if (files.length === 0) {
                            inputRef.current?.focus()
                            inputRef.current?.click()
                            return
                        }
                        onUpload(files, {archive: isArchive})
                        setFiles([])
                    }}
                >
                    Upload{files.length > 1 ? " All" : ""}
                </Button>
            </div>
            <div
                className={cn(
                    "grid grid-cols-[repeat(auto-fill,minmax(min(calc(var(--spacing)*24),100%),1fr))] gap-2",
                    isUploading && "pointer-events-none opacity-50 select-none",
                )}
            >
                {files.map((file, i) => (
                    <FileCell
                        key={i}
                        file={file}
                        onRemove={() => {
                            setFiles(files.filter((f) => f !== file))
                        }}
                    />
                ))}
                <FileInput rf={inputRef} addFiles={addFiles} />
            </div>
            {isUploading && (
                <div className="flex flex-col gap-2">
                    <div className="flex items-center justify-between">
                        <span className="font-semibold">
                            {files.length > 1 ?
                                isArchive ?
                                    `Uploading ${files.length} files as archive`
                                :   `Uploading ${files.length} files`
                            :   `Uploading`}
                        </span>
                        <span className="text-sm">{Math.floor(progress)}%</span>
                    </div>
                    <Progress value={progress} />
                </div>
            )}
        </div>
    )
}
