import {ReactNode} from "react"
import {Footer} from "./footer"
import {Header} from "./header"

export function Layout({children}: {children: ReactNode}) {
    return (
        <div className="flex min-h-screen flex-col">
            <Header />
            <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
                {children}
            </main>
            <Footer />
        </div>
    )
}
