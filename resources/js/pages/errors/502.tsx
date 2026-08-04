import { Unplug } from 'lucide-react';

import ErrorLayout from '@/components/errors/error-layout';

export default function Error502() {
    return (
        <ErrorLayout
            status={502}
            icon={Unplug}
            tone="danger"
            title="Ungültige Antwort vom Server"
            description="Der Server hat eine ungültige Antwort erhalten. Das Problem ist meist vorübergehend – bitte versuche es in Kürze erneut."
        />
    );
}
