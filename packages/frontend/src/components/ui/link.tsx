import {cn} from "@/lib/utils"
import {ComponentPropsWithoutRef, forwardRef} from "react"

export type LinkProps = ComponentPropsWithoutRef<"a"> & {
    className?: string
}

const Link = forwardRef<HTMLAnchorElement, LinkProps>(
    ({className, children, ...props}, ref) => {
        return (
            <a
                ref={ref}
                className={cn(
                    "decoration-muted-foreground/75 hover:decoration-muted-foreground font-medium underline underline-offset-3 transition-colors",
                    className,
                )}
                {...props}
            >
                {children}
            </a>
        )
    },
)
Link.displayName = "Link"

export {Link}

export default Link
