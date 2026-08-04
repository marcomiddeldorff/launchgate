import { MapPinOff } from 'lucide-react';

import ErrorLayout from '@/components/errors/error-layout';

export default function Error404() {
    return (
        <ErrorLayout
            status={404}
            icon={MapPinOff}
            title="Seite nicht gefunden"
            description="Die aufgerufene Seite existiert nicht oder wurde verschoben. Überprüfe die Adresse oder kehre zurück."
        />
    );
}
