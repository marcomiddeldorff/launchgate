import { ShieldX } from 'lucide-react';

import ErrorLayout from '@/components/errors/error-layout';

export default function Error403() {
    return (
        <ErrorLayout
            status={403}
            icon={ShieldX}
            tone="danger"
            title="Kein Zugriff"
            description="Du hast keine Berechtigung, diese Seite aufzurufen. Falls du glaubst, dass das ein Fehler ist, wende dich an deine Organisation."
        />
    );
}
