<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class OrganizationResource extends InertiaResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'slug' => $this->slug,
            'logoUrl' => $this->logo_url,
            'defaultLocale' => $this->default_locale,
            'timezone' => $this->timezone,
            'createdAt' => $this->created_at,

            'owner' => new UserResource($this->whenLoaded('ownerUser')),
            'membershipsCount' => $this->whenCounted('memberships'),
            'invitationsCount' => $this->whenCounted('invitations'),
            'memberships' => OrganizationMembershipResource::collection($this->whenLoaded('memberships')),
            'invitations' => InvitationResource::collection($this->whenLoaded('invitations')),
        ];
    }
}
