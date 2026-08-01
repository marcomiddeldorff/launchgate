import {
    CircleCheck,
    CircleX,
    Info,
    LoaderCircle,
    TriangleAlert,
} from 'lucide-react';
import type { CSSProperties } from 'react';
import { Toaster as Sonner, type ToasterProps } from 'sonner';

import { useAppearance } from '@/hooks/use-appearance';
import { useFlashToast } from '@/hooks/use-flash-toast';

/**
 * On-brand toast host. Toasts use the app's popover surface + radius, our status
 * colours are carried by the leading icon (never colour alone), and sonner's
 * built-in slide/fade animation is kept (it already respects reduced motion).
 */
function Toaster({ ...props }: ToasterProps) {
    const { appearance } = useAppearance();

    useFlashToast();

    return (
        <Sonner
            theme={appearance}
            position="bottom-right"
            closeButton
            gap={10}
            offset={20}
            icons={{
                success: <CircleCheck className="size-5 text-success" />,
                error: <CircleX className="size-5 text-danger" />,
                warning: <TriangleAlert className="size-5 text-warning" />,
                info: <Info className="size-5 text-info" />,
                loading: (
                    <LoaderCircle className="size-5 animate-spin text-muted-foreground" />
                ),
            }}
            toastOptions={{
                classNames: {
                    toast: 'group !items-start !gap-3 !rounded-xl !border !bg-popover !p-4 !text-popover-foreground !shadow-lg',
                    title: '!text-sm !leading-snug !font-semibold',
                    description: '!text-sm !leading-snug !text-muted-foreground',
                    icon: '!mt-0.5 !mr-0',
                    actionButton:
                        '!rounded-md !bg-primary !text-xs !font-medium !text-primary-foreground',
                    cancelButton:
                        '!rounded-md !bg-muted !text-xs !font-medium !text-muted-foreground',
                    closeButton:
                        '!border-border !bg-popover !text-muted-foreground hover:!text-foreground',
                },
            }}
            style={
                {
                    '--normal-bg': 'var(--popover)',
                    '--normal-text': 'var(--popover-foreground)',
                    '--normal-border': 'var(--border)',
                    '--border-radius': 'var(--radius)',
                } as CSSProperties
            }
            {...props}
        />
    );
}

export { Toaster };
