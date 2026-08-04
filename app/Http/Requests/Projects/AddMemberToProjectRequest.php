<?php

namespace App\Http\Requests\Projects;

use App\Enums\ProjectMembershipRole;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Gate;
use Illuminate\Validation\Rule;

class AddMemberToProjectRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return Gate::check('addMember', $this->route('project'));
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'email' => $this->input('add_external_user') ? ['required_if:add_external_user,true'] : [],
            'add_external_user' => ['bool'],
            'member_id' => $this->input('add_external_user') ? [] : [
                'required_if:add_external_user,false',
                'exists:organization_memberships,id',
                function ($attribute, $value, $fail) {
                    $organization = $this->user()->ensureOrganizationIsSet();

                    if (! $organization->memberships()->whereIn('id', [$value])->exists()) {
                        $fail('Das ausgewählte Mitglied gehört nicht zur Organisation.');
                    }

                },
            ],
            'role' => ['required', 'string', Rule::enum(ProjectMembershipRole::class)],
            'can_approve' => ['bool'],
            'can_view_internal_comments' => ['bool'],
        ];
    }

    public function messages(): array
    {
        return [
            'email.required_if' => 'Die E-Mail Adresse muss ausgefüllt werden.',
            'member_id.required_if' => 'Das Mitglied muss ausgewählt werden.',
        ];
    }
}
