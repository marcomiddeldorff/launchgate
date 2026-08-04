import { CircleAlert } from 'lucide-react';

import ErrorLayout from '@/components/errors/error-layout';

export default function Error400() {
    return (
        <ErrorLayout
            status={400}
            icon={CircleAlert}
            tone="warning"
            title="Ungültige Anfrage"
            description="Die Anfrage konnte nicht verarbeitet werden, weil sie fehlerhaft oder unvollständig war. Bitte prüfe deine Eingabe und versuche es erneut."
        />
    );
}
