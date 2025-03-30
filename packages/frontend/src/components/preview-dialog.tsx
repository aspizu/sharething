import {Dialog, DialogContent, DialogHeader, DialogTitle} from "@/components/ui/dialog"
import {cn} from "@/lib/utils"
import CodePreview, {starryNight} from "./code-preview"
import {FileIcon} from "./file-icon"

interface PreviewDialogProps {
    type: string
    url: string
    name: string
    open: boolean
    onOpenChange: (open: boolean) => void
}

export const PreviewDialog = ({
    type,
    url,
    name,
    open,
    onOpenChange,
}: PreviewDialogProps) => {
    const renderPreview = () => {
        const scope = starryNight.flagToScope(name)

        if (scope) {
            return (
                <div className="bg-background relative h-[70vh] overflow-hidden rounded-lg border shadow-sm">
                    <CodePreview url={url} scope={scope} />
                </div>
            )
        }

        if (type.startsWith("image")) {
            return (
                <div className="bg-background flex items-center justify-center rounded-lg border p-2 shadow-sm">
                    <img
                        src={url}
                        alt={name}
                        className="max-h-[70vh] max-w-full rounded-md object-contain"
                    />
                </div>
            )
        }

        if (type.startsWith("video")) {
            return (
                <div className="bg-background rounded-lg border shadow-sm">
                    <video controls className="max-h-[70vh] w-full rounded-md">
                        <source src={url} type={type} />
                        Your browser does not support the video tag.
                    </video>
                </div>
            )
        }

        if (type.startsWith("audio")) {
            return (
                <div className="bg-background rounded-lg border p-4 shadow-sm">
                    <div className="flex items-center gap-4">
                        <FileIcon
                            name={name}
                            type={type}
                            className="text-primary h-10 w-10 shrink-0"
                        />
                        <audio controls className="w-full">
                            <source src={url} type={type} />
                            Your browser does not support the audio element.
                        </audio>
                    </div>
                </div>
            )
        }

        return (
            <div className="bg-background flex h-64 flex-col items-center justify-center gap-4 rounded-lg border p-6 shadow-sm">
                <FileIcon
                    name={name}
                    type={type}
                    className={cn(
                        "h-16 w-16 transition-colors duration-200",
                        type.startsWith("text") ? "text-amber-500" : "text-primary",
                    )}
                />
                <p className="text-muted-foreground text-sm font-medium">
                    {type.startsWith("text") ? "Text file" : "Preview not available"}
                </p>
            </div>
        )
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-3xl">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <FileIcon
                            name={name}
                            type={type}
                            className="h-5 w-5 shrink-0"
                        />
                        <span className="truncate">{name}</span>
                    </DialogTitle>
                </DialogHeader>
                <div className="overflow-hidden py-4 transition-all">
                    {renderPreview()}
                </div>
            </DialogContent>
        </Dialog>
    )
}
