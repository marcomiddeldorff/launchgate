import * as React from 'react';

import { cn } from '@/lib/utils';

type TabsContextValue = {
    value: string;
    setValue: (value: string) => void;
};

const TabsContext = React.createContext<TabsContextValue | null>(null);

function useTabs(): TabsContextValue {
    const ctx = React.useContext(TabsContext);

    if (!ctx) {
        throw new Error('Tabs components must be used within <Tabs>.');
    }

    return ctx;
}

type TabsProps = React.ComponentProps<'div'> & {
    value?: string;
    defaultValue: string;
    onValueChange?: (value: string) => void;
};

function Tabs({
    className,
    value,
    defaultValue,
    onValueChange,
    ...props
}: TabsProps) {
    const [internal, setInternal] = React.useState(defaultValue);
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
        <TabsContext.Provider value={{ value: current, setValue }}>
            <div data-slot="tabs" className={cn('flex flex-col gap-4', className)} {...props} />
        </TabsContext.Provider>
    );
}

function TabsList({ className, ...props }: React.ComponentProps<'div'>) {
    return (
        <div
            role="tablist"
            data-slot="tabs-list"
            className={cn(
                'text-muted-foreground inline-flex h-9 w-fit items-center justify-center rounded-lg bg-muted p-1',
                className,
            )}
            {...props}
        />
    );
}

type TabsTriggerProps = React.ComponentProps<'button'> & { value: string };

function TabsTrigger({ className, value, ...props }: TabsTriggerProps) {
    const { value: current, setValue } = useTabs();
    const active = current === value;

    return (
        <button
            type="button"
            role="tab"
            aria-selected={active}
            data-slot="tabs-trigger"
            data-state={active ? 'active' : 'inactive'}
            onClick={() => setValue(value)}
            className={cn(
                'focus-visible:ring-ring/50 inline-flex flex-1 items-center justify-center gap-1.5 rounded-md px-3 py-1 text-sm font-medium whitespace-nowrap transition-colors outline-none focus-visible:ring-[2px] disabled:pointer-events-none disabled:opacity-50 [&_svg]:size-4 [&_svg]:shrink-0',
                active
                    ? 'bg-background text-foreground shadow-sm'
                    : 'hover:text-foreground',
                className,
            )}
            {...props}
        />
    );
}

type TabsContentProps = React.ComponentProps<'div'> & { value: string };

function TabsContent({ className, value, ...props }: TabsContentProps) {
    const { value: current } = useTabs();

    if (current !== value) {
        return null;
    }

    return (
        <div
            role="tabpanel"
            data-slot="tabs-content"
            className={cn('flex-1 outline-none', className)}
            {...props}
        />
    );
}

export { Tabs, TabsList, TabsTrigger, TabsContent };
