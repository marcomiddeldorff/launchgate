<?php

namespace App\Actions\Clients;

use App\Models\Client;
use Illuminate\Support\Facades\Auth;

class CreateNewClient
{
    public function create(array $data): Client
    {
        $user = Auth::user();
        $organization = $user->getCurrentOrganization();

        return $organization->clients()->create([
            'name' => $data['name'],
            'reference' => $data['reference'],
            'primary_domain' => $data['primaryDomain'],
            'status' => $data['status'],
            'notes' => $data['notes'],
            'contact_name' => $data['contactName'],
            'contact_email' => $data['contactEmail'],
        ]);
    }
}
