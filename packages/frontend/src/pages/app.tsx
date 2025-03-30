import {FileList} from "@/components/file-list"
import FileUpload from "@/components/file-upload"
import {Layout} from "@/components/layout"
import usePersistentState from "@/hooks/use-persistent-state"
import {tryCatch} from "@/lib/try-cache"
import {uploadFiles} from "@/lib/uploadthing"
import JSZip from "jszip"
import {useState} from "react"
import {flushSync} from "react-dom"
import {toast} from "sonner"

export interface FileEntry {
    id: string
    name: string
    type: string
    url: string
    size: number
    createdAt: number
}

export default function App() {
    const [files, setFiles] = usePersistentState<FileEntry[]>("uploaded-files", [])
    const [progress, setProgress] = useState<number>(0)
    const [isUploading, setIsUploading] = useState(false)

    async function onUpload(toUpload: File[], {archive}: {archive: boolean}) {
        flushSync(() => {
            setIsUploading(true)
            setProgress(0.1)
        })

        if (archive) {
            const zip = new JSZip()
            for (const file of toUpload) {
                zip.file(file.name, file)
            }
            const file = await zip.generateAsync({
                compression: "DEFLATE",
                compressionOptions: {level: 9},
                type: "blob",
            })
            toUpload = [new File([file], "archive.zip", {type: "application/zip"})]
        }

        const response = await tryCatch(
            uploadFiles("uploader", {
                files: toUpload,
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
        flushSync(() => {
            setIsUploading(false)
            setProgress(1)
            setFiles([
                ...response.data.map((data) => ({
                    id: data.key,
                    name: data.name,
                    type: data.type,
                    url: data.ufsUrl,
                    size: data.size,
                    createdAt: Date.now(),
                })),
                ...files,
            ])
        })

        if (toUpload.length === 1) {
            toast.success("File uploaded successfully!")
        } else {
            toast.success(`${toUpload.length} files uploaded successfully!`)
        }
    }

    function onFileRemove(id: string) {
        const file = files.find((file) => file.id === id)!
        setFiles(files.filter((file) => file.id !== id))
        toast("File forgotten", {
            action: {
                label: "Undo",
                onClick: () => {
                    setFiles((files) => [file, ...files])
                },
            },
        })
    }

    return (
        <Layout>
            <div className="mx-auto flex w-full max-w-2xl flex-col gap-4">
                <FileUpload
                    onUpload={onUpload}
                    isUploading={isUploading}
                    progress={progress}
                />
                <FileList files={files} onRemove={onFileRemove} />
            </div>
        </Layout>
    )
}
