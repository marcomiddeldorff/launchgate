import type { StatusTone } from '@/lib/status';
import type { OrganizationCapabilities, PlanLimits, PlanTier } from '@/types';

export type PlanMeta = {
    tier: PlanTier;
    name: string;
    tagline: string;
    priceMonthly: number | null;
    priceLabel: string;
    highlighted: boolean;
    tone: StatusTone;
    features: string[];
    capabilities: OrganizationCapabilities;
    limits: PlanLimits;
};

export const plans: Record<PlanTier, PlanMeta> = {
    free: {
        tier: 'free',
        name: 'Free',
        tagline: 'Für den ersten Release und kleine Tests.',
        priceMonthly: 0,
        priceLabel: '0 €',
        highlighted: false,
        tone: 'neutral',
        features: [
            '1 aktives Projekt',
            '1 aktiver Release',
            'Test-Runner und Issue-Tracking',
            'Basis-Abschlussbericht',
            '1 GB Anhänge',
        ],
        capabilities: {
            customTemplates: false,
            pdfReports: false,
            whiteLabel: false,
            integrations: false,
            api: false,
            advancedRoles: false,
        },
        limits: { activeProjects: 1, activeReleases: 1, storageGb: 1 },
    },
    pro: {
        tier: 'pro',
        name: 'Pro',
        tagline: 'Für Teams mit mehreren Kunden und Releases.',
        priceMonthly: 49,
        priceLabel: '49 €',
        highlighted: true,
        tone: 'primary',
        features: [
            'Mehrere Projekte und Releases',
            'Wiederverwendbare Prüf-Vorlagen',
            'Erweiterte Berichte und PDF-Export',
            'Retest-Workflow und Audit-Timeline',
            '50 GB Anhänge',
        ],
        capabilities: {
            customTemplates: true,
            pdfReports: true,
            whiteLabel: false,
            integrations: false,
            api: false,
            advancedRoles: false,
        },
        limits: {
            activeProjects: 'unlimited',
            activeReleases: 'unlimited',
            storageGb: 50,
        },
    },
    agency: {
        tier: 'agency',
        name: 'Agency',
        tagline: 'Für Agenturen mit White-Label und Integrationen.',
        priceMonthly: 149,
        priceLabel: '149 €',
        highlighted: false,
        tone: 'retest',
        features: [
            'White-Label und eigene Domain',
            'Integrationen (Jira, GitHub, Slack)',
            'API-Zugriff',
            'Erweiterte Rollen und Berechtigungen',
            '500 GB Anhänge',
        ],
        capabilities: {
            customTemplates: true,
            pdfReports: true,
            whiteLabel: true,
            integrations: true,
            api: true,
            advancedRoles: true,
        },
        limits: {
            activeProjects: 'unlimited',
            activeReleases: 'unlimited',
            storageGb: 500,
        },
    },
};

export const planList: PlanMeta[] = [plans.free, plans.pro, plans.agency];

export const planMeta = (tier: PlanTier): PlanMeta => plans[tier];

/** Human-readable copy shown when a capability is locked behind a plan. */
export const capabilityLabels: Record<keyof OrganizationCapabilities, string> =
    {
        customTemplates: 'Eigene Vorlagen',
        pdfReports: 'PDF-Berichte',
        whiteLabel: 'White-Label',
        integrations: 'Integrationen',
        api: 'API-Zugriff',
        advancedRoles: 'Erweiterte Rollen',
    };

/** The lowest plan that unlocks a given capability, for upgrade hints. */
export function requiredPlanFor(
    capability: keyof OrganizationCapabilities,
): PlanTier {
    if (plans.pro.capabilities[capability]) {
        return 'pro';
    }

    return 'agency';
}
