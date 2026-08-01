import { Link } from '@inertiajs/react';
import { ChevronRight } from 'lucide-react';
import { Fragment } from 'react';
import type { ReactNode } from 'react';

import { cn } from '@/lib/utils';

export type Crumb = { title: string; href?: string };

/**
 * Contextual page header rendered at the top of each content page: breadcrumbs,
 * title, optional description and a right-aligned action slot. Living in the
 * page body (not the app bar) lets breadcrumbs reflect the loaded record.
 */
export function PageHeader({
    title,
    description,
    breadcrumbs,
    actions,
    icon,
    className,
}: {
    title: ReactNode;
    description?: ReactNode;
    breadcrumbs?: Crumb[];
    actions?: ReactNode;
    icon?: ReactNode;
    className?: string;
}) {
    return (
        <div className={cn('flex flex-col gap-3', className)}>
            {breadcrumbs && breadcrumbs.length > 0 && (
                <nav aria-label="Breadcrumb">
                    <ol className="flex flex-wrap items-center gap-1 text-sm text-muted-foreground">
                        {breadcrumbs.map((crumb, index) => {
                            const isLast = index === breadcrumbs.length - 1;

                            return (
                                <Fragment key={`${crumb.title}-${index}`}>
                                    <li>
                                        {crumb.href && !isLast ? (
                                            <Link
                                                href={crumb.href}
                                                className="transition-colors hover:text-foreground"
                                            >
                                                {crumb.title}
                                            </Link>
                                        ) : (
                                            <span
                                                className={cn(
                                                    isLast &&
                                                        'font-medium text-foreground',
                                                )}
                                                aria-current={
                                                    isLast ? 'page' : undefined
                                                }
                                            >
                                                {crumb.title}
                                            </span>
                                        )}
                                    </li>
                                    {!isLast && (
                                        <li
                                            aria-hidden
                                            className="text-muted-foreground/60"
                                        >
                                            <ChevronRight className="size-3.5" />
                                        </li>
                                    )}
                                </Fragment>
                            );
                        })}
                    </ol>
                </nav>
            )}

            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div className="flex items-start gap-3">
                    {icon}
                    <div className="space-y-1">
                        <h1 className="text-2xl font-semibold tracking-tight text-balance">
                            {title}
                        </h1>
                        {description && (
                            <p className="max-w-2xl text-sm text-pretty text-muted-foreground">
                                {description}
                            </p>
                        )}
                    </div>
                </div>
                {actions && (
                    <div className="flex shrink-0 flex-wrap items-center gap-2">
                        {actions}
                    </div>
                )}
            </div>
        </div>
    );
}
