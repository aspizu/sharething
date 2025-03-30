import {ModeToggle} from "@/components/mode-toggle"
import {Button} from "@/components/ui/button"
import {Input} from "@/components/ui/input"
import {Progress} from "@/components/ui/progress"
import {tryCatch} from "@/lib/try-cache"
import {uploadFiles} from "@/lib/uploadthing"
import {formatDistanceToNow} from "date-fns"
import {File, Image, Link, Music, Text, Upload, Video, X} from "lucide-react"
import prettyBytes from "pretty-bytes"
import {ChangeEvent, useRef, useState} from "react"
import {flushSync} from "react-dom"
import {toast} from "sonner"

export interface FileEntry {
    id: string
    name: string
    type: string
    url: string
    size: number
    createdAt: Date
}

export function FileEntry({name, type, url, size, createdAt}: FileEntry) {
    function onCopyLinkClick() {
        navigator.clipboard.writeText(url)
        toast.success("Copied link to clipboard")
    }

    return (
        <div className="border-border group hover:bg-muted/50 flex items-center gap-3 rounded-lg border p-3 transition-colors">
            <div className="bg-muted/50 flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border">
                {type.startsWith("image") ?
                    <Image size="18" className="text-blue-500" />
                : type.startsWith("video") ?
                    <Video size="18" className="text-purple-500" />
                : type.startsWith("audio") ?
                    <Music size="18" className="text-emerald-500" />
                : type.startsWith("text") ?
                    <Text size="18" className="text-amber-500" />
                :   <File size="18" className="text-gray-500" />}
            </div>
            <div className="flex min-w-0 flex-col gap-1">
                <span className="truncate font-medium">{name}</span>
                <div className="text-muted-foreground flex gap-2 text-xs">
                    <span>{prettyBytes(size)}</span>•
                    <time dateTime={createdAt.toISOString()}>
                        uploaded {formatDistanceToNow(createdAt)} ago
                    </time>
                </div>
            </div>
            <div className="ml-auto flex gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={onCopyLinkClick}
                    title="Copy link"
                >
                    <Link size="16" />
                </Button>
                <Button
                    asChild
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    title="Open in new tab"
                >
                    <a href={url} target="_blank" rel="noreferrer">
                        <Upload size="16" />
                    </a>
                </Button>
            </div>
        </div>
    )
}

export default function App() {
    const [file, setFile] = useState<File | undefined>(undefined)
    const [files, setFiles] = useState<FileEntry[]>([])
    const [progress, setProgress] = useState<number>(0)
    const [isUploading, setIsUploading] = useState(false)
    const fileInput = useRef<HTMLInputElement>(null)

    async function onUploadClick() {
        if (!file) {
            toast.warning("Please select a file first")
            return
        }

        flushSync(() => {
            setIsUploading(true)
            setProgress(0.1)
        })

        const response = await tryCatch(
            uploadFiles("uploader", {
                files: [file],
                onUploadProgress: ({progress}) => setProgress(progress),
            }),
        )

        if (response.error) {
            if (response.error.message === "Invalid config: FileSizeMismatch") {
                toast.error("That file is too large")
            } else {
                toast.error(response.error.message)
            }
            setIsUploading(false)
            return
        }

        const data = response.data[0]
        flushSync(() => {
            setIsUploading(false)
            setProgress(1)
            setFiles((files) => [
                {
                    id: data.key,
                    name: file.name,
                    type: file.type,
                    url: data.ufsUrl,
                    size: file.size,
                    createdAt: new Date(),
                },
                ...files, // New files appear at the top
            ])
        })

        toast.success("File uploaded successfully!")
        setFile(undefined)
    }

    function onFileChange(event: ChangeEvent<HTMLInputElement>) {
        const selectedFile = event.target.files?.item(0)
        if (selectedFile) {
            setFile(selectedFile)
        }
    }

    function clearSelection() {
        if (fileInput.current) {
            fileInput.current.value = ""
        }
        setFile(undefined)
    }

    return (
        <div className="mx-auto flex max-w-[640px] flex-col gap-4 p-4">
            <div className="flex items-center justify-between border-b pb-4">
                <h1 className="text-2xl font-bold tracking-tight">ShareThing</h1>
                <ModeToggle />
            </div>

            <div className="bg-card flex flex-col gap-4 rounded-xl border p-4 shadow-sm">
                <div className="flex items-center gap-2">
                    <div className="relative flex-1">
                        <Input
                            ref={fileInput}
                            disabled={isUploading}
                            type="file"
                            onChange={onFileChange}
                            className="cursor-pointer"
                        />
                        {file && (
                            <Button
                                variant="ghost"
                                size="icon"
                                className="absolute top-1/2 right-2 h-6 w-6 -translate-y-1/2 rounded-full"
                                onClick={clearSelection}
                            >
                                <X size="14" />
                            </Button>
                        )}
                    </div>
                    <Button
                        disabled={isUploading || !file}
                        onClick={onUploadClick}
                        className="gap-1"
                    >
                        {isUploading ?
                            <>
                                <span className="animate-pulse">Uploading</span>
                            </>
                        :   <>
                                <Upload size="16" />
                                <span>Upload</span>
                            </>
                        }
                    </Button>
                </div>

                {isUploading && (
                    <div className="space-y-1">
                        <div className="flex justify-between text-sm">
                            <span>Uploading {file?.name}</span>
                            <span>{Math.round(progress)}%</span>
                        </div>
                        <Progress value={progress} className="h-2" />
                    </div>
                )}
            </div>

            {files.length > 0 ?
                <div className="space-y-2">
                    <h2 className="text-muted-foreground text-sm font-medium">
                        Recently uploaded
                    </h2>
                    <div className="space-y-2">
                        {files.map((file) => (
                            <FileEntry key={file.id} {...file} />
                        ))}
                    </div>
                </div>
            :   <div className="flex flex-col items-center justify-center rounded-lg border py-12 text-center">
                    <Upload size="48" className="text-muted-foreground mb-4" />
                    <h3 className="text-lg font-medium">No files uploaded yet</h3>
                    <p className="text-muted-foreground text-sm">
                        Upload your first file to get started
                    </p>
                </div>
            }
        </div>
    )
}
