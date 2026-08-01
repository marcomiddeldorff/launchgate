import * as React from "react"

import { cn } from "@/lib/utils"

type CardVariant = "default" | "bare"

/**
 * Propagates the Card variant to its sub-components so that `bare` cards can
 * drop the header/content/footer padding without changing the call site.
 */
const CardVariantContext = React.createContext<CardVariant>("default")

const useCardVariant = () => React.useContext(CardVariantContext)

function Card({
  className,
  variant = "default",
  ...props
}: React.ComponentProps<"div"> & { variant?: CardVariant }) {
  return (
    <CardVariantContext.Provider value={variant}>
      <div
        data-slot="card"
        data-variant={variant}
        className={cn(
          "flex flex-col gap-6",
          // `bare` keeps only the structure (no surface, border, shadow or padding).
          variant === "default" &&
            "bg-card text-card-foreground rounded-xl border py-6 shadow-sm",
          className
        )}
        {...props}
      />
    </CardVariantContext.Provider>
  )
}

function CardHeader({ className, ...props }: React.ComponentProps<"div">) {
  const variant = useCardVariant()

  return (
    <div
      data-slot="card-header"
      className={cn(
        "flex flex-col gap-1.5",
        variant === "default" && "px-6",
        className
      )}
      {...props}
    />
  )
}

function CardTitle({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-title"
      className={cn("leading-none font-semibold", className)}
      {...props}
    />
  )
}

function CardDescription({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-description"
      className={cn("text-muted-foreground text-sm", className)}
      {...props}
    />
  )
}

function CardContent({ className, ...props }: React.ComponentProps<"div">) {
  const variant = useCardVariant()

  return (
    <div
      data-slot="card-content"
      className={cn(variant === "default" && "px-6", className)}
      {...props}
    />
  )
}

function CardFooter({ className, ...props }: React.ComponentProps<"div">) {
  const variant = useCardVariant()

  return (
    <div
      data-slot="card-footer"
      className={cn(
        "flex items-center",
        variant === "default" && "px-6",
        className
      )}
      {...props}
    />
  )
}

export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent }
