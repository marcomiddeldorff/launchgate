import { ServerOff } from 'lucide-react';

import ErrorLayout from '@/components/errors/error-layout';

export default function Error504() {
    return (
        <ErrorLayout
            status={504}
            icon={ServerOff}
            tone="danger"
            title="Zeitüberschreitung des Servers"
            description="Der Server hat nicht rechtzeitig geantwortet. Das Problem ist meist vorübergehend – bitte versuche es in Kürze erneut."
        />
    );
}
