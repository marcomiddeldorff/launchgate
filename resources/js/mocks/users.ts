import type { DomainUser } from '@/types';

/**
 * Isolated frontend mock data. Never mix these records with real server
 * responses — they exist purely to demonstrate the UI while the backend is
 * being built out.
 */
export const users = {
    // Agency team (the LaunchGate customer).
    lena: {
        id: 'usr_lena',
        name: 'Lena Brandt',
        email: 'lena.brandt@pixelwerk.studio',
        initials: 'LB',
        jobTitle: 'Inhaberin',
    },
    jonas: {
        id: 'usr_jonas',
        name: 'Jonas Keller',
        email: 'jonas.keller@pixelwerk.studio',
        initials: 'JK',
        jobTitle: 'Project Manager',
    },
    marie: {
        id: 'usr_marie',
        name: 'Marie Hoffmann',
        email: 'marie.hoffmann@pixelwerk.studio',
        initials: 'MH',
        jobTitle: 'Lead Developer',
    },
    timo: {
        id: 'usr_timo',
        name: 'Timo Fischer',
        email: 'timo.fischer@pixelwerk.studio',
        initials: 'TF',
        jobTitle: 'Frontend Developer',
    },
    // Client side.
    petra: {
        id: 'usr_petra',
        name: 'Petra Weber',
        email: 'p.weber@mueller-gmbh.de',
        initials: 'PW',
        jobTitle: 'Projektleitung Müller GmbH',
    },
    andreas: {
        id: 'usr_andreas',
        name: 'Andreas Schulz',
        email: 'a.schulz@mueller-gmbh.de',
        initials: 'AS',
        jobTitle: 'Fachbereich Vertrieb',
    },
    sabine: {
        id: 'usr_sabine',
        name: 'Sabine Vogel',
        email: 's.vogel@nordstern-logistik.de',
        initials: 'SV',
        jobTitle: 'IT-Leitung Nordstern',
    },
    michael: {
        id: 'usr_michael',
        name: 'Michael Braun',
        email: 'm.braun@nordstern-logistik.de',
        initials: 'MB',
        jobTitle: 'Leiter Disposition',
    },
    katrin: {
        id: 'usr_katrin',
        name: 'Katrin Wolf',
        email: 'k.wolf@aachener-stadtwerke.de',
        initials: 'KW',
        jobTitle: 'Digitalisierung',
    },
} satisfies Record<string, DomainUser>;

export const allUsers: DomainUser[] = Object.values(users);
