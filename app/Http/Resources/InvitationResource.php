<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class InvitationResource extends InertiaResource
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
            'email' => $this->email,
            'role' => $this->role,
            'expiresAt' => $this->expires_at,
            'createdAt' => $this->created_at,

            'isExpired' => $this->isExpired(),

            'organization' => new OrganizationResource($this->whenLoaded('organization')),
            'invitedBy' => new UserResource($this->whenLoaded('invitedByUser')),
            // 'project' => new ProjectResource($this->whenLoaded('project')),
        ];
    }
}
