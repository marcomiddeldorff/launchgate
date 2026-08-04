import { Clock } from 'lucide-react';

import ErrorLayout from '@/components/errors/error-layout';

export default function Error408() {
    return (
        <ErrorLayout
            status={408}
            icon={Clock}
            tone="warning"
            title="Zeitüberschreitung der Anfrage"
            description="Die Anfrage hat zu lange gedauert und wurde abgebrochen. Bitte prüfe deine Verbindung und versuche es erneut."
        />
    );
}
