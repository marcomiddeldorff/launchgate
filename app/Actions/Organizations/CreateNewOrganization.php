<?php

namespace App\Actions\Organizations;

use App\Models\Organization;
use App\Models\User;
use Illuminate\Support\Facades\DB;

class CreateNewOrganization
{
    /**
     * @throws \Throwable
     */
    public function create(array $data, User $user): Organization
    {
        return $user->organizations()->create([
            'name' => $data['name'],
            'slug' => $data['slug'],
            'timezone' => $data['timezone'],
            'default_locale' => $data['default_locale'],
        ]);
    }
}
