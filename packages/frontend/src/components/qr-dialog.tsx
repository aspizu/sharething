import prettyBytes from "pretty-bytes"
import {QRCodeSVG} from "qrcode.react"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "./ui/dialog"

export interface QRDialogProps {
    name: string
    url: string
    open: boolean
    size: number
    onOpenChange: (open: boolean) => void
}

export default function QRDialog({name, url, size, onOpenChange, open}: QRDialogProps) {
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Scan to download</DialogTitle>
                    <DialogDescription>
                        {name} ({prettyBytes(size)})
                    </DialogDescription>
                    <div className="m-4 rounded bg-white p-4">
                        <QRCodeSVG value={url} className="h-full w-full" />
                    </div>
                </DialogHeader>
            </DialogContent>
        </Dialog>
    )
}
