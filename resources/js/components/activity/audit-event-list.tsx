import {
    CalendarClock,
    CheckCheck,
    CircleCheck,
    CircleX,
    GitCommitHorizontal,
    MessageSquare,
    Bug,
    PlusCircle,
    RotateCcw,
    Send,
    UserCheck,
    Users,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

import { toneClasses } from '@/components/status/status-badge';
import { UserAvatar } from '@/components/user-avatar';
import { formatDateTime, formatRelative } from '@/lib/format';
import type { StatusTone } from '@/lib/status';
import { cn } from '@/lib/utils';
import type { AuditEvent, AuditEventType } from '@/types';

const eventMeta: Record<
    AuditEventType,
    { icon: LucideIcon; tone: StatusTone }
> = {
    release_created: { icon: PlusCircle, tone: 'neutral' },
    build_added: { icon: GitCommitHorizontal, tone: 'info' },
    build_promoted: { icon: RotateCcw, tone: 'warning' },
    review_assigned: { icon: Users, tone: 'neutral' },
    review_passed: { icon: CircleCheck, tone: 'success' },
    review_failed: { icon: CircleX, tone: 'danger' },
    issue_created: { icon: Bug, tone: 'danger' },
    issue_status_changed: { icon: RotateCcw, tone: 'info' },
    retest_requested: { icon: RotateCcw, tone: 'retest' },
    approval_requested: { icon: Send, tone: 'warning' },
    approval_decided: { icon: UserCheck, tone: 'success' },
    release_completed: { icon: CheckCheck, tone: 'success' },
    comment_added: { icon: MessageSquare, tone: 'neutral' },
};

export function AuditEventList({ events }: { events: AuditEvent[] }) {
    return (
        <ol className="relative flex flex-col">
            {events.map((event, index) => {
                const meta = eventMeta[event.type] ?? {
                    icon: CalendarClock,
                    tone: 'neutral' as StatusTone,
                };
                const Icon = meta.icon;
                const isLast = index === events.length - 1;

                return (
                    <li key={event.id} className="flex gap-3">
                        <div className="flex flex-col items-center">
                            <span
                                className={cn(
                                    'flex size-8 shrink-0 items-center justify-center rounded-full border',
                                    toneClasses[meta.tone],
                                )}
                            >
                                <Icon className="size-4" aria-hidden />
                            </span>
                            {!isLast && (
                                <span className="w-px flex-1 bg-border" />
                            )}
                        </div>
                        <div
                            className={cn(
                                'min-w-0 flex-1',
                                isLast ? 'pb-0' : 'pb-6',
                            )}
                        >
                            <p className="text-sm font-medium text-pretty">
                                {event.summary}
                            </p>
                            {event.detail && (
                                <p className="mt-0.5 text-sm text-muted-foreground">
                                    {event.detail}
                                </p>
                            )}
                            <div className="mt-1.5 flex items-center gap-2 text-xs text-muted-foreground">
                                <UserAvatar user={event.actor} size="xs" />
                                <span>{event.actor.name}</span>
                                <span aria-hidden>·</span>
                                <time
                                    dateTime={event.createdAt}
                                    title={formatDateTime(event.createdAt)}
                                >
                                    {formatRelative(event.createdAt)}
                                </time>
                            </div>
                        </div>
                    </li>
                );
            })}
        </ol>
    );
}
