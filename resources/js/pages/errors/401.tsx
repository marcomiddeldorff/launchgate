import { LockKeyhole } from 'lucide-react';

import ErrorLayout from '@/components/errors/error-layout';

export default function Error401() {
    return (
        <ErrorLayout
            status={401}
            icon={LockKeyhole}
            tone="warning"
            title="Nicht angemeldet"
            description="Für diesen Bereich musst du angemeldet sein. Bitte melde dich an und versuche es anschließend erneut."
        />
    );
}
