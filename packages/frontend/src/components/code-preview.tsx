import "@/styles/starry-night.css"
import {common, createStarryNight} from "@wooorm/starry-night"
import {toJsxRuntime} from "hast-util-to-jsx-runtime"
import {useEffect, useState} from "react"
import {Fragment, jsx, jsxs} from "react/jsx-runtime"
import {Spinner} from "./ui/spinner"

export const starryNight = await createStarryNight(common)

export interface CodePreviewProps {
    url: string
    scope: string
}

export default function CodePreview({url, scope}: CodePreviewProps) {
    const [text, setText] = useState<string | undefined>(undefined)
    useEffect(() => {
        fetch(url).then(async (response) => {
            const text = await response.text()
            setText(text)
        })
    }, [url])
    if (text === undefined) {
        return <Spinner />
    }
    const tree = starryNight.highlight(text, scope)
    const reactNode = toJsxRuntime(tree, {Fragment, jsx, jsxs})
    return (
        <div className="h-full overflow-scroll p-4">
            <pre>
                <code>{reactNode}</code>
            </pre>
        </div>
    )
}
