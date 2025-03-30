import {ModeToggle} from "@/components/mode-toggle"
import {Button} from "@/components/ui/button"
import {Input} from "@/components/ui/input"
import {Progress} from "@/components/ui/progress"
import {tryCatch} from "@/lib/try-cache"
import {uploadFiles} from "@/lib/uploadthing"
import {formatDistanceToNow} from "date-fns"
import {File, Image, Link, Music, Text, Video} from "lucide-react"
import prettyBytes from "pretty-bytes"
import {ChangeEvent, useState} from "react"
import {flushSync} from "react-dom"
import {toast} from "sonner"
import {UploadThingError} from "uploadthing/server"

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
        toast("Copied link to clipboard")
    }
    return (
        <div className="border-border flex items-center gap-2 border-b p-2">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded border">
                {type.startsWith("image") ?
                    <Image size="16" />
                : type.startsWith("video") ?
                    <Video size="16" />
                : type.startsWith("audio") ?
                    <Music size="16" />
                : type.startsWith("text") ?
                    <Text size="16" />
                :   <File size="16" />}
            </div>
            <div className="flex flex-col gap-1">
                <span>{name}</span>
                <div className="text-muted-foreground flex gap-2 text-sm">
                    <span>{prettyBytes(size)}</span>•
                    <time dateTime={createdAt.toISOString()}>
                        uploaded {formatDistanceToNow(createdAt)} ago
                    </time>
                </div>
            </div>
            <Button
                asChild
                variant="ghost"
                size="icon"
                onClick={onCopyLinkClick}
                className="ml-auto"
            >
                <a
                    href={url}
                    target="_blank"
                    rel="noreferrer"
                    onClick={(event) => event.preventDefault()}
                >
                    <Link />
                </a>
            </Button>
        </div>
    )
}

export default function App() {
    const [file, setFile] = useState<File | undefined>(undefined)
    const [files, setFiles] = useState<FileEntry[]>([])
    const [progress, setProgress] = useState<number>(0)
    const [isUploading, setIsUploading] = useState(false)
    async function onUploadClick() {
        if (!file) return
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
            if (
                response.error instanceof UploadThingError &&
                response.error.code === "TOO_LARGE"
            ) {
                toast("That file is too large")
            } else {
                toast(response.error.message)
            }
            setIsUploading(false)
            return
        }
        const data = response.data[0]
        flushSync(() => {
            setIsUploading(false)
            setProgress(1)
            setFiles((files) => [
                ...files,
                {
                    id: data.key,
                    name: file.name,
                    type: file.type,
                    url: data.ufsUrl,
                    size: file.size,
                    createdAt: new Date(),
                },
            ])
        })
    }
    function onFileChange(event: ChangeEvent<HTMLInputElement>) {
        setFile(event.target.files?.item(0) ?? undefined)
    }
    return (
        <div className="mx-auto flex max-w-[600px] flex-col gap-4 p-2">
            <div className="flex items-end gap-2 border-b border-dashed py-4">
                <span className="mr-auto text-xl font-bold">ShareThing</span>
                <ModeToggle />
            </div>
            <div className="flex flex-col gap-2 rounded-xl border p-2">
                <div className="flex gap-2">
                    <Input disabled={isUploading} type="file" onChange={onFileChange} />
                    <Button disabled={isUploading} onClick={onUploadClick}>
                        Upload
                    </Button>
                </div>
                {isUploading && (
                    <div>
                        <Progress value={progress} />
                    </div>
                )}
            </div>
            <div className="flex flex-col gap-2">
                {files.map((file) => (
                    <FileEntry key={file.id} {...file} />
                ))}
            </div>
        </div>
    )
}
