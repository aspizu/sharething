import Link from "./ui/link"

export function Footer() {
    return (
        <footer className="text-muted-foreground flex items-center justify-center border-t p-4 text-sm">
            <p>
                Built by <Link href="https://github.com/aspizu"> aspizu</Link>. The
                source code is available on{" "}
                <Link href="https://github.com/aspizu/sharething">GitHub</Link>.
            </p>
        </footer>
    )
}
