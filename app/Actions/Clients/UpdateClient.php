<?php

namespace App\Actions\Clients;

use App\Models\Client;

class UpdateClient
{
    public function update(array $data, Client $client): void
    {
        $client->update([
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
