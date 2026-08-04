/**
 * LaunchGate domain model types.
 *
 * These mirror the Eloquent models in `app/Models` and the additional entities
 * that are not yet backed by database tables. While the backend is being built
 * out, the frontend renders isolated mock data that satisfies these types (see
 * `resources/js/mocks`). Nested relations are embedded for convenient rendering.
 */

/* -------------------------------------------------------------------------- */
/* Enums / literal unions                                                     */
/* -------------------------------------------------------------------------- */

import type { User } from '@/types/auth';

/**
 * Organization membership roles. Single source of truth on the frontend —
 * mirrors the `App\Enums\OrganizationMembershipRole` PHP enum, keep the two in
 * sync. Enumeration order is the display order. Iterate with
 * `Object.values(OrganizationRole)`.
 *
 * Note: the organization owner is modelled separately (`Organization.owner`),
 * not as a membership role.
 */
export enum OrganizationRole {
    Admin = 'admin',
    ProjectManager = 'project_manager',
    Developer = 'developer',
    Viewer = 'viewer',
}

/**
 * Project membership roles. Single source of truth on the frontend — mirrors
 * the `App\Enums\ProjectMembershipRole` PHP enum. Scoped to a single project
 * and independent of the organization-level roles above.
 */
export enum ProjectRole {
    ProjectManager = 'project_manager',
    Developer = 'developer',
    ClientTester = 'client_tester',
    Approver = 'approver',
}

export enum EnvironmentTypeEnum {
    Development = 'development',
    Testing = 'testing',
    Staging = 'staging',
    Production = 'production',
    Preview = 'preview',
    Custom = 'custom',
}

export type MembershipStatus = 'active' | 'invited' | 'suspended';

export type InvitationStatus = 'default' | 'expired';

export type PlanTier = 'free' | 'pro' | 'agency';

export type ClientStatus = 'active' | 'prospect' | 'archived';

export type ProjectStatus = 'active' | 'on_hold' | 'archived';

export type EnvironmentType = 'staging' | 'production' | 'review' | 'local';

export type ReleaseStatus =
    | 'draft'
    | 'testing'
    | 'blocked'
    | 'pending_approval'
    | 'approved'
    | 'scheduled'
    | 'live'
    | 'completed'
    | 'cancelled';

export type RiskLevel = 'low' | 'medium' | 'high' | 'critical';

export type BuildStatus =
    'pending' | 'building' | 'deployed' | 'failed' | 'superseded';

export type ReviewItemType = 'quick_check' | 'test_case';

/** Result a tester records for a single review item. */
export type ReviewResult =
    'passed' | 'failed' | 'blocked' | 'question' | 'not_applicable';

/** State of a review item within a release (aggregate of its run). */
export type ReviewItemStatus =
    | 'not_started'
    | 'in_progress'
    | 'passed'
    | 'failed'
    | 'blocked'
    | 'question'
    | 'not_applicable'
    | 'retest_required';

export type Priority = 'low' | 'medium' | 'high' | 'urgent';

export type IssueStatus =
    | 'open'
    | 'in_progress'
    | 'fixed'
    | 'retest'
    | 'reopened'
    | 'closed'
    | 'wont_fix';

/** Severity as felt/reported by the tester. */
export type IssueSeverity = 'trivial' | 'minor' | 'major' | 'critical';

/** Impact on the release / go-live decision. */
export type IssueImpact = 'cosmetic' | 'minor' | 'major' | 'go_live_blocker';

export type ApprovalStatus =
    | 'pending'
    | 'approved'
    | 'approved_with_conditions'
    | 'rejected'
    | 'expired';

export type ApprovalDecisionType =
    'approve' | 'approve_with_conditions' | 'reject';

export type AuditEventType =
    | 'release_created'
    | 'build_added'
    | 'build_promoted'
    | 'review_assigned'
    | 'review_passed'
    | 'review_failed'
    | 'issue_created'
    | 'issue_status_changed'
    | 'retest_requested'
    | 'approval_requested'
    | 'approval_decided'
    | 'release_completed'
    | 'comment_added';

/* -------------------------------------------------------------------------- */
/* Entities                                                                   */
/* -------------------------------------------------------------------------- */

export type DomainUser = {
    id: string;
    name: string;
    email: string;
    initials: string;
    avatarUrl?: string | null;
    jobTitle?: string | null;
};

export type OrganizationCapabilities = {
    customTemplates: boolean;
    pdfReports: boolean;
    whiteLabel: boolean;
    integrations: boolean;
    api: boolean;
    advancedRoles: boolean;
};

export type PlanLimits = {
    activeProjects: number | 'unlimited';
    activeReleases: number | 'unlimited';
    storageGb: number;
};

export type Organization = {
    id: string;
    owner_user_id: string;
    name: string;
    slug: string;
    logo_url: string | null;
    default_locale: string;
    timezone: string;
    created_at: string;

    owner_user: User;
    memberships_count: number;
    invitations_count: number;
    memberships: OrganizationMembership[];
    invitations: Invitation[];
};

export type OrganizationMembership = {
    id: string;
    role: string;
    status: string;
    joined_at: string;

    user: User;
    organization: Organization;
};

export type OrganizationMember = {
    id: string;
    user: DomainUser;
    role: OrganizationRole;
    status: MembershipStatus;
    canApprove: boolean;
    joinedAt: string | null;
    lastSeenAt?: string | null;
};

export type Client = {
    id: string;
    name: string;
    reference: string | null;
    primary_domain?: string | null;
    status: ClientStatus;
    notes: string | null;
    logo_url: string | null;
    contact_name: string | null;
    contact_email: string | null;
    created_at: string;
    archived_at: string | null;

    organization: Organization;
};

export type ClientContact = {
    id: string;
    name: string;
    email: string;
    role?: string | null;
    phone?: string | null;
    isPrimary: boolean;
};

export type Project = {
    id: string;
    name: string;
    client_id: string;
    project_manager_user_id: string;
    default_locale: string;
    timezone: string;
    description?: string | null;
    status: ProjectStatus;
    repository_url: string | null;

    created_at: string;
    archived_at?: string | null;

    project_manager: User;
    client: Client;
    releases: Release[];
    environments: Environment[];
    members: ProjectMember[];
    organization: Organization;
};

export type ProjectMember = {
    id: string;
    user_id: string;
    user: User;
    role: ProjectRole;
};

export type Environment = {
    id: string;
    project_id: string;
    name: string;
    type: EnvironmentType;
    url: string | null;
    access_notes?: string | null;
    username?: string | null;
    is_default_for_testing: boolean;
    is_active: boolean;
};

export type ReleaseBuild = {
    id: string;
    releaseId: string;
    label: string;
    version?: string | null;
    commitSha?: string | null;
    branch?: string | null;
    pipelineUrl?: string | null;
    artifactUrl?: string | null;
    releaseNotes?: string | null;
    status: BuildStatus;
    environmentName: string;
    isCurrent: boolean;
    deployedAt?: string | null;
    createdBy: DomainUser;
    createdAt: string;
};

export type Release = {
    id: string;
    projectId: string;
    projectName: string;
    clientName: string;
    name: string;
    version?: string | null;
    description?: string | null;
    scope?: string | null;
    status: ReleaseStatus;
    riskLevel: RiskLevel;
    environmentName?: string | null;
    testStartsAt?: string | null;
    testEndsAt?: string | null;
    plannedGoLiveAt?: string | null;
    approvedAt?: string | null;
    deployedAt?: string | null;
    completedAt?: string | null;
    cancelledAt?: string | null;
    projectManager: DomainUser;
    currentBuild?: ReleaseBuild | null;
    knownLimitations: KnownLimitation[];
    progress: ReviewProgressSummary;
    openBlockerCount: number;
    openIssueCount: number;
    pendingRetestCount: number;
    pendingApprovalCount: number;
    createdAt: string;
};

export type KnownLimitation = {
    id: string;
    title: string;
    description: string;
    acknowledged: boolean;
};

export type ReviewProgressSummary = {
    total: number;
    passed: number;
    failed: number;
    blocked: number;
    question: number;
    notApplicable: number;
    notStarted: number;
    requiredTotal: number;
    requiredCompleted: number;
};

export type ReviewSuite = {
    id: string;
    releaseId: string;
    name: string;
    description?: string | null;
    position: number;
    itemCount: number;
    passedCount: number;
    items: ReviewItem[];
};

export type ReviewStep = {
    id: string;
    position: number;
    instruction: string;
    expectedResult?: string | null;
};

export type ReviewItem = {
    id: string;
    suiteId: string;
    releaseId: string;
    type: ReviewItemType;
    position: number;
    title: string;
    instruction: string;
    expectedResult: string;
    preconditions?: string | null;
    steps: ReviewStep[];
    priority: Priority;
    isRequired: boolean;
    assignee?: DomainUser | null;
    deadline?: string | null;
    status: ReviewItemStatus;
    attachments: Attachment[];
    lastRun?: ReviewRun | null;
};

export type ReviewRun = {
    id: string;
    reviewItemId: string;
    result: ReviewResult;
    note?: string | null;
    testedUrl?: string | null;
    testedBy: DomainUser;
    buildLabel: string;
    createdAt: string;
};

export type Issue = {
    id: string;
    number: number;
    releaseId: string;
    releaseName: string;
    projectName: string;
    title: string;
    description: string;
    expectedBehavior?: string | null;
    actualBehavior?: string | null;
    status: IssueStatus;
    severity: IssueSeverity;
    impact: IssueImpact;
    isGoLiveBlocker: boolean;
    needsRetest: boolean;
    assignee?: DomainUser | null;
    reporter: DomainUser;
    buildLabel?: string | null;
    reviewItemTitle?: string | null;
    testedUrl?: string | null;
    attachments: Attachment[];
    comments: IssueComment[];
    history: IssueHistoryEntry[];
    createdAt: string;
    updatedAt: string;
};

export type IssueComment = {
    id: string;
    author: DomainUser;
    body: string;
    isInternal: boolean;
    createdAt: string;
};

export type IssueHistoryEntry = {
    id: string;
    actor: DomainUser;
    from?: IssueStatus | null;
    to: IssueStatus;
    note?: string | null;
    createdAt: string;
};

export type ApprovalRequest = {
    id: string;
    releaseId: string;
    releaseName: string;
    buildLabel: string;
    buildId: string;
    requestedBy: DomainUser;
    approver: DomainUser;
    status: ApprovalStatus;
    message?: string | null;
    conditions?: string | null;
    decidedAt?: string | null;
    createdAt: string;
    dueAt?: string | null;
    decision?: ApprovalDecision | null;
    snapshot: ApprovalSnapshot;
};

export type ApprovalSnapshot = {
    progress: ReviewProgressSummary;
    openBlockerCount: number;
    openIssueCount: number;
    pendingRetestCount: number;
    knownLimitations: KnownLimitation[];
    priorApprovals: number;
};

export type ApprovalDecision = {
    id: string;
    type: ApprovalDecisionType;
    conditions?: string | null;
    comment?: string | null;
    decidedBy: DomainUser;
    decidedAt: string;
};

export type Attachment = {
    id: string;
    name: string;
    mimeType: string;
    sizeBytes: number;
    url: string;
    uploadedBy?: DomainUser | null;
    createdAt: string;
};

export type AuditEvent = {
    id: string;
    type: AuditEventType;
    actor: DomainUser;
    summary: string;
    detail?: string | null;
    createdAt: string;
};

export type ReleaseSnapshot = {
    id: string;
    releaseId: string;
    buildLabel: string;
    checksum: string;
    generatedAt: string;
    generatedBy: DomainUser;
};

/** A tester-facing review assignment, used on "Meine Prüfungen". */
export type ReviewAssignment = {
    id: string;
    reviewItem: ReviewItem;
    projectName: string;
    releaseName: string;
    releaseId: string;
    suiteName: string;
    deadline?: string | null;
    status: ReviewItemStatus;
};

export type Invitation = {
    id: string;
    email: string;
    role: string;
    expires_at: string;
    created_at: string;

    is_expired: boolean;

    organization: Organization;
    invited_by_user: User;
    project: Project;
};

export type Locales = {
    locale: string;
    name: string;
    localizedName: string;
};
