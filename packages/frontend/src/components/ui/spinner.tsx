import {cn} from "@/lib/utils"
import {cva, type VariantProps} from "class-variance-authority"

const spinnerVariants = cva(
    "animate-spin inline-block border-2 border-current border-t-transparent rounded-full",
    {
        variants: {
            size: {
                sm: "h-4 w-4",
                default: "h-6 w-6",
                lg: "h-8 w-8",
                xl: "h-10 w-10",
            },
        },
        defaultVariants: {
            size: "default",
        },
    },
)

interface SpinnerProps
    extends React.HTMLAttributes<HTMLDivElement>,
        VariantProps<typeof spinnerVariants> {}

export function Spinner({className, size, ...props}: SpinnerProps) {
    return (
        <div
            role="status"
            className={cn(spinnerVariants({size, className}))}
            {...props}
        >
            <span className="sr-only">Loading...</span>
        </div>
    )
}
