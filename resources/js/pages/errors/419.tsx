import { RefreshCw } from 'lucide-react';

import ErrorLayout from '@/components/errors/error-layout';

export default function Error419() {
    return (
        <ErrorLayout
            status={419}
            icon={RefreshCw}
            tone="warning"
            title="Sitzung abgelaufen"
            description="Deine Sitzung ist aus Sicherheitsgründen abgelaufen. Lade die Seite neu und versuche es anschließend erneut."
        />
    );
}
