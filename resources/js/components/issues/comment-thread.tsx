import { Lock } from 'lucide-react';
import { useState } from 'react';
import type { FormEvent } from 'react';

import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { UserAvatar } from '@/components/user-avatar';
import { formatDateTime, formatRelative } from '@/lib/format';
import { cn } from '@/lib/utils';
import type { DomainUser, IssueComment } from '@/types';

/** Small lock chip marking content that clients never see. */
export function InternalCommentIndicator({
    className,
}: {
    className?: string;
}) {
    return (
        <span
            className={cn(
                'inline-flex items-center gap-1 rounded-md border border-retest/40 bg-retest/10 px-1.5 py-0.5 text-[11px] font-medium text-retest',
                className,
            )}
        >
            <Lock className="size-3" aria-hidden />
            Nur intern sichtbar
        </span>
    );
}

function CommentItem({ comment }: { comment: IssueComment }) {
    return (
        <li className="flex gap-3">
            <UserAvatar user={comment.author} size="sm" className="mt-0.5" />
            <div
                className={cn(
                    'min-w-0 flex-1 rounded-lg border p-3',
                    comment.isInternal
                        ? 'border-retest/40 bg-retest/5'
                        : 'bg-card',
                )}
            >
                <div className="flex flex-wrap items-center gap-2">
                    <span className="text-sm font-medium">
                        {comment.author.name}
                    </span>
                    {comment.isInternal && <InternalCommentIndicator />}
                    <time
                        className="ml-auto text-xs text-muted-foreground"
                        dateTime={comment.createdAt}
                        title={formatDateTime(comment.createdAt)}
                    >
                        {formatRelative(comment.createdAt)}
                    </time>
                </div>
                <p className="mt-1.5 text-sm text-pretty whitespace-pre-line">
                    {comment.body}
                </p>
            </div>
        </li>
    );
}

/**
 * Public + internal comment history. Internal comments are visually distinct
 * (violet tint + lock) and, in a real app, hidden entirely from client roles.
 */
export function CommentThread({
    comments,
    canViewInternal = true,
}: {
    comments: IssueComment[];
    canViewInternal?: boolean;
}) {
    const visible = canViewInternal
        ? comments
        : comments.filter((c) => !c.isInternal);

    if (visible.length === 0) {
        return (
            <p className="text-sm text-muted-foreground">
                Noch keine Kommentare.
            </p>
        );
    }

    return (
        <ul className="flex flex-col gap-3">
            {visible.map((comment) => (
                <CommentItem key={comment.id} comment={comment} />
            ))}
        </ul>
    );
}

/**
 * Composer with an internal/public toggle. When "internal" is on, the affordance
 * makes unmistakably clear the comment stays hidden from the client.
 */
export function CommentComposer({
    currentUser,
    canPostInternal = true,
    onSubmit,
}: {
    currentUser: DomainUser;
    canPostInternal?: boolean;
    onSubmit?: (body: string, isInternal: boolean) => void;
}) {
    const [body, setBody] = useState('');
    const [internal, setInternal] = useState(false);
    const [submitting, setSubmitting] = useState(false);

    const handleSubmit = (event: FormEvent) => {
        event.preventDefault();

        if (body.trim() === '' || submitting) {
            return;
        }

        setSubmitting(true);
        onSubmit?.(body.trim(), internal);
        // Demo only: reset immediately (no backend persistence yet).
        setBody('');
        setInternal(false);
        setSubmitting(false);
    };

    return (
        <form
            onSubmit={handleSubmit}
            className={cn(
                'rounded-lg border p-3 transition-colors',
                internal && 'border-retest/40 bg-retest/5',
            )}
        >
            <div className="flex gap-3">
                <UserAvatar user={currentUser} size="sm" className="mt-0.5" />
                <Textarea
                    value={body}
                    onChange={(e) => setBody(e.target.value)}
                    placeholder={
                        internal
                            ? 'Interner Kommentar – nur für das Team sichtbar …'
                            : 'Öffentlichen Kommentar schreiben …'
                    }
                    rows={3}
                    className="flex-1 border-0 bg-transparent p-0 shadow-none focus-visible:ring-0"
                    aria-label="Kommentar"
                />
            </div>
            <div className="mt-3 flex flex-wrap items-center justify-between gap-2 border-t pt-3">
                {canPostInternal ? (
                    <label className="flex items-center gap-2 text-sm">
                        <Switch
                            checked={internal}
                            onCheckedChange={setInternal}
                            aria-label="Interner Kommentar"
                        />
                        <span className="flex items-center gap-1">
                            <Lock className="size-3.5 text-muted-foreground" />
                            Nur intern
                        </span>
                    </label>
                ) : (
                    <span className="text-xs text-muted-foreground">
                        Dieser Kommentar ist für alle Beteiligten sichtbar.
                    </span>
                )}
                <Button
                    type="submit"
                    size="sm"
                    disabled={body.trim() === '' || submitting}
                >
                    Kommentar senden
                </Button>
            </div>
        </form>
    );
}
