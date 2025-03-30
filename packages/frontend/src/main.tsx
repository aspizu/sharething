import {ThemeProvider} from "@/components/theme-provider"
import "@/index.css"
import App from "@/pages/app"
import {StrictMode} from "react"
import {createRoot} from "react-dom/client"
import {Toaster} from "./components/ui/sonner"

createRoot(document.getElementById("root")!).render(
    <StrictMode>
        <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
            <App />
            <Toaster />
        </ThemeProvider>
    </StrictMode>,
)
