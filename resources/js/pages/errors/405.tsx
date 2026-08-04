import { Ban } from 'lucide-react';

import ErrorLayout from '@/components/errors/error-layout';

export default function Error405() {
    return (
        <ErrorLayout
            status={405}
            icon={Ban}
            tone="warning"
            title="Methode nicht erlaubt"
            description="Diese Aktion ist für die aufgerufene Adresse nicht zulässig. Bitte kehre zurück und versuche es auf einem anderen Weg."
        />
    );
}
