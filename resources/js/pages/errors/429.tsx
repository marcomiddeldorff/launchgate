import { Gauge } from 'lucide-react';

import ErrorLayout from '@/components/errors/error-layout';

export default function Error429() {
    return (
        <ErrorLayout
            status={429}
            icon={Gauge}
            tone="warning"
            title="Zu viele Anfragen"
            description="Du hast in kurzer Zeit zu viele Anfragen gesendet. Bitte warte einen Moment und versuche es dann erneut."
        />
    );
}
