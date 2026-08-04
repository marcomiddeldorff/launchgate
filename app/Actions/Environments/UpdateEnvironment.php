<?php

namespace App\Actions\Environments;

use App\Models\Environment;
use App\Models\Project;
use Illuminate\Support\Facades\Hash;

class UpdateEnvironment
{
    public function update(Environment $environment, array $input): void
    {
        $environment->update([
            'name' => $input['name'],
            'type' => $input['type'],
            'url' => $input['url'],
            'access_notes' => $input['access_notes'],
            'username' => $input['username'],
            'encrypted_secret' => Hash::make($input['secret']),
            'is_default_for_testing' => $input['is_default_for_testing'],
            'is_active' => $input['is_active'],
        ]);
    }
}
