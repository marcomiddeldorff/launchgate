<?php

namespace App\Http\Requests\Projects;

use App\Enums\ProjectStatus;
use App\Models\Project;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Gate;
use Illuminate\Validation\Rule;

class ProjectRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return Gate::check('create', Project::class);
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, ValidationRule|array|string>
     */
    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'max:255'],
            'client_id' => ['required', 'string', 'exists:clients,id', function (string $attribute, mixed $value, \Closure $fail) {
                $organization = $this->user()->ensureOrganizationIsSet();

                if ($organization->clients()->whereIn('id', [$value])->doesntExist()) {
                    $fail('Der ausgewählte Kunde gehört nicht zur aktuell ausgewählten Organisation');
                }
            }],
            'description' => ['nullable', 'string', 'max:1000'],
            'status' => ['required', Rule::enum(ProjectStatus::class)],
            'default_locale' => ['nullable', 'string', Rule::in(array_map(fn ($locale) => $locale['locale'], config('localization.locales')))],
            'timezone' => ['nullable', 'string', Rule::in(\DateTimeZone::listIdentifiers())],
            'project_manager_user_id' => ['required', 'string', 'exists:users,id', function (string $attribute, mixed $value, \Closure $fail) {
                $organization = $this->user()->ensureOrganizationIsSet();

                if (! $organization->isMember($value) && ! $organization->isOwner($value)) {
                    $fail('Der ausgewählte Projektmanager gehört nicht zur aktuell ausgewählten Organisation');
                }
            }],
            'repository_url' => ['nullable', 'url', 'max:255'],
        ];
    }
}
