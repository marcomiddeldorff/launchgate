import { Check, Search } from "lucide-react"
import * as React from "react"

import { cn } from "@/lib/utils"

export type AutocompleteOption = {
  value: string
  label: string
  disabled?: boolean
}

type AutocompleteProps = {
  /** The selectable entries. */
  options: AutocompleteOption[]
  /** Currently selected value (controlled). */
  value?: string | null
  /** Fired when the user picks an entry. */
  onChange?: (value: string, option: AutocompleteOption) => void
  /**
   * Fired whenever the typed query changes. Use it to fetch/refine `options`
   * remotely. When provided, client-side filtering is skipped by default.
   */
  onInputChange?: (query: string) => void
  /**
   * Filter `options` by the query on the client. Defaults to `true` unless
   * `onInputChange` is supplied (remote filtering).
   */
  filter?: boolean
  /** Minimum characters before the list opens. Defaults to 1. */
  minChars?: number
  /** Renders a hidden input so the value is submitted with native forms. */
  name?: string
  id?: string
  placeholder?: string
  disabled?: boolean
  emptyMessage?: string
  className?: string
  inputClassName?: string
  autoFocus?: boolean
  "aria-invalid"?: boolean | "true" | "false"
  "aria-describedby"?: string
}

function Autocomplete({
  options,
  value = null,
  onChange,
  onInputChange,
  filter,
  minChars = 1,
  name,
  id,
  placeholder,
  disabled,
  emptyMessage = "Keine Einträge gefunden.",
  className,
  inputClassName,
  autoFocus,
  "aria-invalid": ariaInvalid,
  "aria-describedby": ariaDescribedby,
}: AutocompleteProps) {
  const reactId = React.useId()
  const fieldId = id ?? reactId
  const listId = `${fieldId}-list`

  const shouldFilter = filter ?? onInputChange === undefined

  const selectedOption = React.useMemo(
    () => options.find((option) => option.value === value) ?? null,
    [options, value]
  )

  const [query, setQuery] = React.useState(selectedOption?.label ?? "")
  const [open, setOpen] = React.useState(false)
  const [activeIndex, setActiveIndex] = React.useState(-1)

  const rootRef = React.useRef<HTMLDivElement>(null)
  const inputRef = React.useRef<HTMLInputElement>(null)
  const listRef = React.useRef<HTMLUListElement>(null)

  // Keep the visible text in sync when the selection changes from the outside.
  React.useEffect(() => {
    setQuery(selectedOption?.label ?? "")
  }, [selectedOption?.label])

  const filtered = React.useMemo(() => {
    if (!shouldFilter) {
      return options
    }

    const needle = query.trim().toLowerCase()

    if (needle === "") {
      return options
    }

    return options.filter((option) =>
      option.label.toLowerCase().includes(needle)
    )
  }, [options, query, shouldFilter])

  const canOpen = query.trim().length >= minChars
  const isOpen = open && canOpen && !disabled

  // Close when clicking anywhere outside the component.
  React.useEffect(() => {
    if (!isOpen) {
      return
    }

    function onPointerDown(event: MouseEvent) {
      if (!rootRef.current?.contains(event.target as Node)) {
        setOpen(false)
      }
    }

    document.addEventListener("mousedown", onPointerDown)

    return () => document.removeEventListener("mousedown", onPointerDown)
  }, [isOpen])

  // Scroll the highlighted entry into view while navigating with the keyboard.
  React.useEffect(() => {
    if (!isOpen || activeIndex < 0) {
      return
    }

    const active = listRef.current?.querySelector<HTMLElement>(
      `[data-index="${activeIndex}"]`
    )

    active?.scrollIntoView({ block: "nearest" })
  }, [activeIndex, isOpen])

  function commitQuery(next: string) {
    setQuery(next)
    setOpen(true)
    setActiveIndex(-1)
    onInputChange?.(next)
  }

  function select(option: AutocompleteOption) {
    if (option.disabled) {
      return
    }

    setQuery(option.label)
    setOpen(false)
    setActiveIndex(-1)
    onChange?.(option.value, option)
    inputRef.current?.focus()
  }

  function moveActive(direction: 1 | -1) {
    if (filtered.length === 0) {
      return
    }

    setOpen(true)

    setActiveIndex((current) => {
      let next = current

      for (let step = 0; step < filtered.length; step += 1) {
        next = (next + direction + filtered.length) % filtered.length

        if (!filtered[next]?.disabled) {
          return next
        }
      }

      return current
    })
  }

  function onKeyDown(event: React.KeyboardEvent<HTMLInputElement>) {
    switch (event.key) {
      case "ArrowDown":
        event.preventDefault()
        moveActive(1)
        break
      case "ArrowUp":
        event.preventDefault()
        moveActive(-1)
        break
      case "Enter":
        if (isOpen && activeIndex >= 0 && filtered[activeIndex]) {
          event.preventDefault()
          select(filtered[activeIndex])
        }
        break
      case "Escape":
        if (isOpen) {
          event.preventDefault()
          setOpen(false)
          setActiveIndex(-1)
        }
        break
      case "Tab":
        setOpen(false)
        break
    }
  }

  return (
    <div ref={rootRef} className={cn("relative w-full", className)}>
      {name ? (
        <input type="hidden" name={name} value={value ?? ""} />
      ) : null}

      <div className="relative">
        <Search
          className="text-muted-foreground pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2"
          aria-hidden
        />
        <input
          ref={inputRef}
          id={fieldId}
          type="text"
          role="combobox"
          autoComplete="off"
          aria-autocomplete="list"
          aria-expanded={isOpen}
          aria-controls={listId}
          aria-activedescendant={
            isOpen && activeIndex >= 0
              ? `${listId}-option-${activeIndex}`
              : undefined
          }
          aria-invalid={ariaInvalid}
          aria-describedby={ariaDescribedby}
          disabled={disabled}
          autoFocus={autoFocus}
          placeholder={placeholder}
          value={query}
          onChange={(event) => commitQuery(event.target.value)}
          onFocus={() => setOpen(true)}
          onKeyDown={onKeyDown}
          className={cn(
            "border-input placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground flex h-9 w-full min-w-0 rounded-md border bg-transparent py-1 pr-3 pl-9 text-base shadow-xs transition-[color,box-shadow] outline-none disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
            "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
            "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
            inputClassName
          )}
        />
      </div>

      {isOpen ? (
        <ul
          ref={listRef}
          id={listId}
          role="listbox"
          className="bg-popover text-popover-foreground animate-in fade-in-0 zoom-in-95 absolute z-50 mt-1 max-h-60 w-full overflow-y-auto overscroll-contain rounded-md border p-1 shadow-md"
        >
          {filtered.length === 0 ? (
            <li className="text-muted-foreground px-2 py-2 text-sm">
              {emptyMessage}
            </li>
          ) : (
            filtered.map((option, index) => {
              const isActive = index === activeIndex
              const isSelected = option.value === value

              return (
                <li
                  key={option.value}
                  id={`${listId}-option-${index}`}
                  role="option"
                  aria-selected={isSelected}
                  aria-disabled={option.disabled}
                  data-index={index}
                  data-active={isActive}
                  onMouseDown={(event) => event.preventDefault()}
                  onMouseEnter={() =>
                    !option.disabled && setActiveIndex(index)
                  }
                  onClick={() => select(option)}
                  className={cn(
                    "relative flex cursor-pointer items-center gap-2 rounded-sm py-1.5 pr-2 pl-8 text-sm outline-none select-none",
                    isActive && "bg-accent text-accent-foreground",
                    option.disabled && "pointer-events-none opacity-50"
                  )}
                >
                  {isSelected ? (
                    <Check className="absolute left-2 size-4" aria-hidden />
                  ) : null}
                  <span className="truncate">{option.label}</span>
                </li>
              )
            })
          )}
        </ul>
      ) : null}
    </div>
  )
}

export { Autocomplete }
