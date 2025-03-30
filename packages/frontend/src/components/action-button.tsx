import {Button} from "@/components/ui/button"
import {Tooltip, TooltipContent, TooltipProvider, TooltipTrigger} from "./ui/tooltip"

interface ActionButtonProps extends React.ComponentProps<typeof Button> {
    tooltip: string
    children: React.ReactNode
}

export const ActionButton = ({tooltip, children, ...props}: ActionButtonProps) => (
    <TooltipProvider>
        <Tooltip>
            <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8" {...props}>
                    {children}
                </Button>
            </TooltipTrigger>
            <TooltipContent>{tooltip}</TooltipContent>
        </Tooltip>
    </TooltipProvider>
)
