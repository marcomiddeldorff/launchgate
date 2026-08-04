import { ServerCrash } from 'lucide-react';

import ErrorLayout from '@/components/errors/error-layout';

export default function Error500() {
    return (
        <ErrorLayout
            status={500}
            icon={ServerCrash}
            tone="danger"
            title="Interner Serverfehler"
            description="Auf dem Server ist ein unerwarteter Fehler aufgetreten. Wir wurden informiert – bitte versuche es später noch einmal."
        />
    );
}
