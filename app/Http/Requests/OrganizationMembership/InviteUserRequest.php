<?php

namespace App\Http\Requests\OrganizationMembership;

use App\Enums\OrganizationMembershipRole;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class InviteUserRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return $this->route('organization')->isOwner($this->user()->id);
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'email' => [
                'required',
                'email',
            ],
            'role' => [
                'required',
                'string',
                'in:'.implode(',', array_map(fn ($role) => $role->value, OrganizationMembershipRole::cases()))
            ],
        ];
    }
}
