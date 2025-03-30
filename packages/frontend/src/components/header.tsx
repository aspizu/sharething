import {ModeToggle} from "@/components/mode-toggle"

export function Header() {
    return (
        <header className="flex border-b border-dashed p-4">
            <div className="mx-auto flex w-full max-w-2xl items-center">
                <h1 className="mr-auto text-lg font-semibold">ShareThing</h1>
                <ModeToggle />
            </div>
        </header>
    )
}
