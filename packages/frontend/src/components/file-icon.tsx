import {File, Image as ImageIcon, Music, Text, Video as VideoIcon} from "lucide-react"
import {starryNight} from "./code-preview"

interface FileIconProps {
    name: string
    type: string
    className?: string
}

export const FileIcon = ({name, type, className}: FileIconProps) => {
    const scope = starryNight.flagToScope(name)
    const iconProps = {size: 18, className: getColorClassName(scope, type, className)}
    if (scope) return <Text {...iconProps} />
    if (type.startsWith("image")) return <ImageIcon {...iconProps} />
    if (type.startsWith("video")) return <VideoIcon {...iconProps} />
    if (type.startsWith("audio")) return <Music {...iconProps} />
    if (type.startsWith("text")) return <Text {...iconProps} />
    return <File {...iconProps} />
}

function getColorClassName(
    scope: string | undefined,
    type: string,
    additionalClasses = "",
) {
    const colorClass =
        type.startsWith("text") || scope ? "text-amber-500"
        : type.startsWith("image") ? "text-blue-500"
        : type.startsWith("video") ? "text-purple-500"
        : type.startsWith("audio") ? "text-emerald-500"
        : "text-gray-500"

    return additionalClasses ? `${colorClass} ${additionalClasses}` : colorClass
}
