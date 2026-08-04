<?php

namespace App\Http\Requests\Clients;

use App\Enums\ClientStatus;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Gate;
use Illuminate\Validation\Rule;

class UpdateClientRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return Gate::check('create', $this->route('client'));
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
            'reference' => ['nullable', 'string', 'max:255'],
            'primaryDomain' => ['nullable', 'url', 'max:255'],
            'status' => ['required', Rule::enum(ClientStatus::class)],
            'notes' => ['nullable', 'string', 'max:1000'],
            'contactName' => ['nullable', 'string', 'max:255'],
            'contactEmail' => ['nullable', 'email', 'max:255'],
        ];
    }
}
