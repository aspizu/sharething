import {cn} from "@/lib/utils"
import {ComponentProps, ReactNode} from "react"

interface NavLinkProps extends ComponentProps<"a"> {
    icon: ReactNode
    active?: boolean
}

export function NavLink({className, icon, active, ...props}: NavLinkProps) {
    return (
        <a
            className={cn(
                "text-muted-foreground hover:text-primary flex items-center gap-3 rounded-lg px-3 py-2 transition-all",
                active && "bg-muted text-primary",
                className,
            )}
            {...props}
        >
            {icon}
            {props.children}
        </a>
    )
}
