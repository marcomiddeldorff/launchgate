import { users } from '@/mocks/users';
import type {
    ReviewAssignment,
    ReviewItem,
    ReviewRun,
    ReviewSuite,
} from '@/types';

const run = (
    id: string,
    reviewItemId: string,
    result: ReviewRun['result'],
    note: string | null,
    createdAt: string,
    testedBy = users.petra,
): ReviewRun => ({
    id,
    reviewItemId,
    result,
    note,
    testedUrl: 'https://staging.portal.mueller-gmbh.de',
    testedBy,
    buildLabel: '2.3.0-rc.5',
    createdAt,
});

type ItemInput = Omit<
    ReviewItem,
    'suiteId' | 'releaseId' | 'attachments' | 'steps' | 'preconditions'
> & {
    steps?: ReviewItem['steps'];
    preconditions?: string | null;
    attachments?: ReviewItem['attachments'];
};

const item = (suiteId: string, input: ItemInput): ReviewItem => ({
    suiteId,
    releaseId: 'rel_kp_23',
    preconditions: null,
    steps: [],
    attachments: [],
    ...input,
});

const suiteAnmeldung: ReviewItem[] = [
    item('sui_anmeldung', {
        id: 'itm_login',
        type: 'quick_check',
        position: 1,
        title: 'Anmeldung mit gültigen Zugangsdaten',
        instruction:
            'Melde dich im Kundenportal mit einem gültigen Konto an (Beispielkonto: kunde@mueller-gmbh.de).',
        expectedResult:
            'Die Anmeldung ist erfolgreich und das Dashboard wird angezeigt.',
        priority: 'high',
        isRequired: true,
        assignee: users.petra,
        deadline: '2026-08-01T18:00:00+02:00',
        status: 'passed',
        lastRun: run(
            'r_login',
            'itm_login',
            'passed',
            'Funktioniert wie erwartet.',
            '2026-07-29T10:12:00+02:00',
        ),
    }),
    item('sui_anmeldung', {
        id: 'itm_pwreset',
        type: 'test_case',
        position: 2,
        title: 'Passwort zurücksetzen',
        instruction:
            'Fordere über „Passwort vergessen“ eine Zurücksetzen-E-Mail an und setze das Passwort neu.',
        expectedResult:
            'Es kommt eine E-Mail an und das neue Passwort funktioniert bei der Anmeldung.',
        preconditions:
            'Ein Konto mit erreichbarer E-Mail-Adresse ist vorhanden.',
        steps: [
            {
                id: 's1',
                position: 1,
                instruction: 'Auf „Passwort vergessen“ klicken.',
                expectedResult: 'Formular zur E-Mail-Eingabe erscheint.',
            },
            {
                id: 's2',
                position: 2,
                instruction: 'E-Mail-Adresse eingeben und absenden.',
                expectedResult: 'Bestätigung „E-Mail wurde versendet“.',
            },
            {
                id: 's3',
                position: 3,
                instruction:
                    'Link in der E-Mail öffnen und neues Passwort setzen.',
                expectedResult: 'Passwort wird gespeichert.',
            },
        ],
        priority: 'urgent',
        isRequired: true,
        assignee: users.petra,
        deadline: '2026-07-30T18:00:00+02:00',
        status: 'retest_required',
        lastRun: run(
            'r_pwreset',
            'itm_pwreset',
            'failed',
            'Es kommt keine E-Mail an.',
            '2026-07-28T09:40:00+02:00',
        ),
    }),
    item('sui_anmeldung', {
        id: 'itm_register',
        type: 'quick_check',
        position: 3,
        title: 'Registrierung neuer Kunde',
        instruction:
            'Registriere einen neuen Testkunden mit gültiger Kundennummer.',
        expectedResult:
            'Konto wird angelegt, Bestätigungs-E-Mail wird versendet.',
        priority: 'medium',
        isRequired: false,
        assignee: users.petra,
        deadline: null,
        status: 'passed',
        lastRun: run(
            'r_register',
            'itm_register',
            'passed',
            null,
            '2026-07-29T11:00:00+02:00',
        ),
    }),
    item('sui_anmeldung', {
        id: 'itm_2fa',
        type: 'quick_check',
        position: 4,
        title: 'Zwei-Faktor-Anmeldung',
        instruction: 'Aktiviere 2FA und melde dich erneut an.',
        expectedResult: 'Nach Passworteingabe wird ein Code abgefragt.',
        priority: 'low',
        isRequired: false,
        assignee: users.petra,
        deadline: null,
        status: 'not_applicable',
        lastRun: run(
            'r_2fa',
            'itm_2fa',
            'not_applicable',
            'Für diesen Release nicht im Scope.',
            '2026-07-29T11:20:00+02:00',
        ),
    }),
    item('sui_anmeldung', {
        id: 'itm_logout',
        type: 'quick_check',
        position: 5,
        title: 'Abmelden',
        instruction: 'Melde dich über das Benutzermenü ab.',
        expectedResult: 'Du wirst abgemeldet und zur Login-Seite geleitet.',
        priority: 'low',
        isRequired: false,
        assignee: users.petra,
        deadline: null,
        status: 'passed',
        lastRun: run(
            'r_logout',
            'itm_logout',
            'passed',
            null,
            '2026-07-29T11:25:00+02:00',
        ),
    }),
];

const suiteBestellung: ReviewItem[] = [
    item('sui_bestellung', {
        id: 'itm_warenkorb',
        type: 'quick_check',
        position: 1,
        title: 'Artikel in den Warenkorb legen',
        instruction: 'Lege drei Artikel in den Warenkorb.',
        expectedResult: 'Der Warenkorb zeigt drei Artikel mit korrekter Summe.',
        priority: 'high',
        isRequired: true,
        assignee: users.petra,
        deadline: '2026-08-01T18:00:00+02:00',
        status: 'passed',
        lastRun: run(
            'r_warenkorb',
            'itm_warenkorb',
            'passed',
            null,
            '2026-07-29T13:00:00+02:00',
        ),
    }),
    item('sui_bestellung', {
        id: 'itm_checkout',
        type: 'test_case',
        position: 2,
        title: 'Bestellabschluss durchführen',
        instruction: 'Schließe eine Bestellung vollständig ab.',
        expectedResult:
            'Die Bestellung wird bestätigt und erscheint in der Bestellhistorie.',
        preconditions: 'Es liegen Artikel im Warenkorb.',
        steps: [
            {
                id: 'c1',
                position: 1,
                instruction: 'Zur Kasse gehen.',
                expectedResult: 'Übersicht der Bestellung erscheint.',
            },
            {
                id: 'c2',
                position: 2,
                instruction: 'Lieferadresse bestätigen.',
                expectedResult: 'Adresse wird übernommen.',
            },
            {
                id: 'c3',
                position: 3,
                instruction: 'Auf „Zahlungspflichtig bestellen“ klicken.',
                expectedResult: 'Bestellbestätigung erscheint.',
            },
        ],
        priority: 'urgent',
        isRequired: true,
        assignee: users.petra,
        deadline: '2026-08-01T18:00:00+02:00',
        status: 'failed',
        lastRun: run(
            'r_checkout',
            'itm_checkout',
            'failed',
            'Der Bestell-Button lässt sich doppelt klicken und erzeugt zwei Bestellungen.',
            '2026-07-29T13:30:00+02:00',
        ),
    }),
    item('sui_bestellung', {
        id: 'itm_bestellhistorie',
        type: 'quick_check',
        position: 3,
        title: 'Bestellhistorie anzeigen',
        instruction: 'Öffne die Bestellhistorie im Kundenkonto.',
        expectedResult:
            'Vergangene Bestellungen werden mit Datum und Betrag angezeigt.',
        priority: 'medium',
        isRequired: true,
        assignee: users.petra,
        deadline: null,
        status: 'passed',
        lastRun: run(
            'r_hist',
            'itm_bestellhistorie',
            'passed',
            null,
            '2026-07-29T13:45:00+02:00',
        ),
    }),
    item('sui_bestellung', {
        id: 'itm_storno',
        type: 'quick_check',
        position: 4,
        title: 'Bestellung stornieren',
        instruction: 'Storniere eine offene Bestellung.',
        expectedResult: 'Die Bestellung erhält den Status „Storniert“.',
        priority: 'medium',
        isRequired: true,
        assignee: users.petra,
        deadline: null,
        status: 'question',
        lastRun: run(
            'r_storno',
            'itm_storno',
            'question',
            'Ist eine Stornierung nach Versand noch erlaubt? Bitte fachlich klären.',
            '2026-07-29T14:00:00+02:00',
        ),
    }),
    item('sui_bestellung', {
        id: 'itm_menge',
        type: 'quick_check',
        position: 5,
        title: 'Menge im Warenkorb ändern',
        instruction: 'Ändere die Menge eines Artikels im Warenkorb.',
        expectedResult: 'Die Summe wird korrekt aktualisiert.',
        priority: 'low',
        isRequired: false,
        assignee: users.petra,
        deadline: null,
        status: 'not_started',
        lastRun: null,
    }),
    item('sui_bestellung', {
        id: 'itm_gutschein',
        type: 'quick_check',
        position: 6,
        title: 'Gutscheincode einlösen',
        instruction: 'Löse den Testgutschein „TEST10“ ein.',
        expectedResult: 'Der Rabatt von 10 % wird abgezogen.',
        priority: 'low',
        isRequired: false,
        assignee: users.petra,
        deadline: null,
        status: 'not_started',
        lastRun: null,
    }),
];

const suiteExport: ReviewItem[] = [
    item('sui_export', {
        id: 'itm_csv_basic',
        type: 'test_case',
        position: 1,
        title: 'CSV-Export der Bestellungen',
        instruction: 'Exportiere die Bestellliste als CSV-Datei.',
        expectedResult:
            'Eine CSV-Datei mit allen Bestellungen wird heruntergeladen.',
        preconditions: 'Es sind mindestens fünf Bestellungen vorhanden.',
        steps: [
            {
                id: 'e1',
                position: 1,
                instruction: 'Bestellliste öffnen.',
                expectedResult: 'Liste wird angezeigt.',
            },
            {
                id: 'e2',
                position: 2,
                instruction: 'Auf „CSV-Export“ klicken.',
                expectedResult: 'Download startet.',
            },
            {
                id: 'e3',
                position: 3,
                instruction: 'Datei in Excel öffnen.',
                expectedResult: 'Spalten sind korrekt getrennt.',
            },
        ],
        priority: 'high',
        isRequired: true,
        assignee: users.andreas,
        deadline: '2026-08-02T18:00:00+02:00',
        status: 'failed',
        lastRun: run(
            'r_csv',
            'itm_csv_basic',
            'failed',
            'Umlaute (ä, ö, ü) werden im Export als Fragezeichen dargestellt.',
            '2026-07-29T15:00:00+02:00',
            users.andreas,
        ),
    }),
    item('sui_export', {
        id: 'itm_csv_filter',
        type: 'quick_check',
        position: 2,
        title: 'CSV-Export mit Filter',
        instruction: 'Filtere die Bestellliste nach Zeitraum und exportiere.',
        expectedResult:
            'Nur Bestellungen des gewählten Zeitraums sind enthalten.',
        priority: 'medium',
        isRequired: true,
        assignee: users.andreas,
        deadline: null,
        status: 'blocked',
        lastRun: run(
            'r_csvf',
            'itm_csv_filter',
            'blocked',
            'Nicht prüfbar, solange der Basisexport fehlerhaft ist.',
            '2026-07-29T15:10:00+02:00',
            users.andreas,
        ),
    }),
    item('sui_export', {
        id: 'itm_csv_encoding',
        type: 'quick_check',
        position: 3,
        title: 'CSV-Trennzeichen prüfen',
        instruction: 'Prüfe, ob das Semikolon als Trennzeichen verwendet wird.',
        expectedResult:
            'Die CSV nutzt Semikolon als Trennzeichen (Excel-kompatibel).',
        priority: 'low',
        isRequired: false,
        assignee: users.andreas,
        deadline: null,
        status: 'not_started',
        lastRun: null,
    }),
];

export const suitesByRelease: Record<string, ReviewSuite[]> = {
    rel_kp_23: [
        {
            id: 'sui_anmeldung',
            releaseId: 'rel_kp_23',
            name: 'Anmeldung & Registrierung',
            description: 'Zugang, Registrierung und Passwortverwaltung.',
            position: 1,
            itemCount: suiteAnmeldung.length,
            passedCount: suiteAnmeldung.filter((i) => i.status === 'passed')
                .length,
            items: suiteAnmeldung,
        },
        {
            id: 'sui_bestellung',
            releaseId: 'rel_kp_23',
            name: 'Bestellabschluss',
            description: 'Warenkorb, Kasse und Bestellhistorie.',
            position: 2,
            itemCount: suiteBestellung.length,
            passedCount: suiteBestellung.filter((i) => i.status === 'passed')
                .length,
            items: suiteBestellung,
        },
        {
            id: 'sui_export',
            releaseId: 'rel_kp_23',
            name: 'CSV-Export',
            description: 'Export der Bestell- und Rechnungsdaten.',
            position: 3,
            itemCount: suiteExport.length,
            passedCount: suiteExport.filter((i) => i.status === 'passed')
                .length,
            items: suiteExport,
        },
    ],
};

/** Flat, ordered list of items for the test-runner. */
export const runnerItems: Record<string, ReviewItem[]> = {
    rel_kp_23: [...suiteAnmeldung, ...suiteBestellung, ...suiteExport],
};

/** Personal review assignments for "Meine Prüfungen". */
export const myAssignments: ReviewAssignment[] = [
    {
        id: 'asg_1',
        reviewItem: suiteExport[0],
        projectName: 'Kundenportal',
        releaseName: 'Release 2.3',
        releaseId: 'rel_kp_23',
        suiteName: 'CSV-Export',
        deadline: '2026-08-02T18:00:00+02:00',
        status: 'failed',
    },
    {
        id: 'asg_2',
        reviewItem: suiteExport[1],
        projectName: 'Kundenportal',
        releaseName: 'Release 2.3',
        releaseId: 'rel_kp_23',
        suiteName: 'CSV-Export',
        deadline: '2026-07-30T18:00:00+02:00',
        status: 'blocked',
    },
    {
        id: 'asg_3',
        reviewItem: suiteExport[2],
        projectName: 'Kundenportal',
        releaseName: 'Release 2.3',
        releaseId: 'rel_kp_23',
        suiteName: 'CSV-Export',
        deadline: '2026-08-02T18:00:00+02:00',
        status: 'not_started',
    },
    {
        id: 'asg_4',
        reviewItem: suiteBestellung[4],
        projectName: 'Kundenportal',
        releaseName: 'Release 2.3',
        releaseId: 'rel_kp_23',
        suiteName: 'Bestellabschluss',
        deadline: '2026-08-01T18:00:00+02:00',
        status: 'not_started',
    },
    {
        id: 'asg_5',
        reviewItem: suiteAnmeldung[1],
        projectName: 'Kundenportal',
        releaseName: 'Release 2.3',
        releaseId: 'rel_kp_23',
        suiteName: 'Anmeldung & Registrierung',
        deadline: '2026-07-30T18:00:00+02:00',
        status: 'retest_required',
    },
];
