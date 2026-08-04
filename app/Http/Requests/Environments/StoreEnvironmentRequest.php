<?php

namespace App\Http\Requests\Environments;

use App\Enums\EnvironmentType;
use App\Models\Environment;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Gate;
use Illuminate\Validation\Rule;

class StoreEnvironmentRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return Gate::check('create', [Environment::class, $this->route('project')]);
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'max:255'],
            'type' => ['required', Rule::enum(EnvironmentType::class)],
            'url' => ['nullable', 'url', 'max:255'],
            'access_notes' => ['nullable', 'string', 'max:1000'],
            'username' => ['nullable', 'string', 'max:255'],
            'secret' => ['nullable', 'string', 'max:255'],
            'is_default_for_testing' => ['bool'],
            'is_active' => ['bool'],
        ];
    }
}
