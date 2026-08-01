import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';
import type { DomainUser } from '@/types';

const sizeClasses = {
    xs: 'size-5 text-[10px]',
    sm: 'size-7 text-xs',
    md: 'size-9 text-sm',
    lg: 'size-11 text-base',
} as const;

type AvatarSize = keyof typeof sizeClasses;

export function UserAvatar({
    user,
    size = 'sm',
    className,
}: {
    user: Pick<DomainUser, 'name' | 'initials' | 'avatarUrl'>;
    size?: AvatarSize;
    className?: string;
}) {
    return (
        <Avatar className={cn(sizeClasses[size], className)}>
            {user.avatarUrl && (
                <AvatarImage src={user.avatarUrl} alt={user.name} />
            )}
            <AvatarFallback className="bg-primary/10 font-medium text-primary">
                {user.initials}
            </AvatarFallback>
        </Avatar>
    );
}

/** Avatar plus name (and optional secondary line). */
export function UserInline({
    user,
    secondary,
    size = 'sm',
    className,
}: {
    user: DomainUser;
    secondary?: string;
    size?: AvatarSize;
    className?: string;
}) {
    return (
        <span className={cn('flex min-w-0 items-center gap-2', className)}>
            <UserAvatar user={user} size={size} />
            <span className="min-w-0">
                <span className="block truncate text-sm font-medium">
                    {user.name}
                </span>
                {secondary && (
                    <span className="block truncate text-xs text-muted-foreground">
                        {secondary}
                    </span>
                )}
            </span>
        </span>
    );
}

export function MemberAvatarGroup({
    users,
    max = 4,
    size = 'sm',
}: {
    users: DomainUser[];
    max?: number;
    size?: AvatarSize;
}) {
    const shown = users.slice(0, max);
    const overflow = users.length - shown.length;

    return (
        <div className="flex items-center -space-x-2">
            {shown.map((user) => (
                <Tooltip key={user.id}>
                    <TooltipTrigger asChild>
                        <span className="inline-block rounded-full ring-2 ring-background">
                            <UserAvatar user={user} size={size} />
                        </span>
                    </TooltipTrigger>
                    <TooltipContent>{user.name}</TooltipContent>
                </Tooltip>
            ))}
            {overflow > 0 && (
                <span
                    className={cn(
                        'inline-flex items-center justify-center rounded-full bg-muted font-medium text-muted-foreground ring-2 ring-background',
                        sizeClasses[size],
                    )}
                >
                    +{overflow}
                </span>
            )}
        </div>
    );
}
