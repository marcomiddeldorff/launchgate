import { Circle } from 'lucide-react';
import * as React from 'react';

import { cn } from '@/lib/utils';

type RadioGroupContextValue = {
    value: string | undefined;
    setValue: (value: string) => void;
    name: string;
};

const RadioGroupContext = React.createContext<RadioGroupContextValue | null>(
    null,
);

type RadioGroupProps = React.ComponentProps<'div'> & {
    value?: string;
    defaultValue?: string;
    name?: string;
    onValueChange?: (value: string) => void;
};

let radioGroupCounter = 0;

function RadioGroup({
    className,
    value,
    defaultValue,
    name,
    onValueChange,
    ...props
}: RadioGroupProps) {
    const [internal, setInternal] = React.useState(defaultValue);
    const fallbackName = React.useMemo(
        () => name ?? `radio-group-${(radioGroupCounter += 1)}`,
        [name],
    );
    const isControlled = value !== undefined;
    const current = isControlled ? value : internal;

    const setValue = React.useCallback(
        (next: string) => {
            if (!isControlled) {
                setInternal(next);
            }
            onValueChange?.(next);
        },
        [isControlled, onValueChange],
    );

    return (
        <RadioGroupContext.Provider
            value={{ value: current, setValue, name: fallbackName }}
        >
            <div
                role="radiogroup"
                data-slot="radio-group"
                className={cn('grid gap-2', className)}
                {...props}
            />
        </RadioGroupContext.Provider>
    );
}

type RadioGroupItemProps = Omit<React.ComponentProps<'button'>, 'value'> & {
    value: string;
};

function RadioGroupItem({ className, value, id, ...props }: RadioGroupItemProps) {
    const ctx = React.useContext(RadioGroupContext);

    if (!ctx) {
        throw new Error('RadioGroupItem must be used within <RadioGroup>.');
    }

    const checked = ctx.value === value;

    return (
        <button
            type="button"
            role="radio"
            id={id}
            aria-checked={checked}
            data-slot="radio-group-item"
            data-state={checked ? 'checked' : 'unchecked'}
            onClick={() => ctx.setValue(value)}
            className={cn(
                'border-input text-primary focus-visible:ring-ring/50 aspect-square size-4 shrink-0 rounded-full border shadow-xs outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50',
                checked && 'border-primary',
                className,
            )}
            {...props}
        >
            {checked && (
                <span className="flex items-center justify-center">
                    <Circle className="size-2 fill-primary text-primary" />
                </span>
            )}
        </button>
    );
}

export { RadioGroup, RadioGroupItem };
