import * as React from 'react';

import { cn } from '@/lib/utils';

type SwitchProps = Omit<React.ComponentProps<'button'>, 'onChange'> & {
    checked?: boolean;
    defaultChecked?: boolean;
    onCheckedChange?: (checked: boolean) => void;
};

/**
 * Accessible toggle without an extra Radix dependency. Uncontrolled by default,
 * controlled when `checked` is provided.
 */
function Switch({
    className,
    checked,
    defaultChecked = false,
    onCheckedChange,
    disabled,
    ...props
}: SwitchProps) {
    const [internal, setInternal] = React.useState(defaultChecked);
    const isControlled = checked !== undefined;
    const isOn = isControlled ? checked : internal;

    return (
        <button
            type="button"
            role="switch"
            aria-checked={isOn}
            data-slot="switch"
            data-state={isOn ? 'checked' : 'unchecked'}
            disabled={disabled}
            onClick={() => {
                if (!isControlled) {
                    setInternal((v) => !v);
                }
                onCheckedChange?.(!isOn);
            }}
            className={cn(
                'focus-visible:ring-ring/50 inline-flex h-5 w-9 shrink-0 cursor-pointer items-center rounded-full border border-transparent shadow-xs transition-colors outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50',
                isOn ? 'bg-primary' : 'bg-input',
                className,
            )}
            {...props}
        >
            <span
                className={cn(
                    'bg-background pointer-events-none block size-4 rounded-full shadow-sm ring-0 transition-transform',
                    isOn ? 'translate-x-4' : 'translate-x-0.5',
                )}
            />
        </button>
    );
}

export { Switch };
