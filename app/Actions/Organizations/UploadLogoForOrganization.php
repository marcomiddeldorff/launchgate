<?php

namespace App\Actions\Organizations;

use App\Models\Organization;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;

class UploadLogoForOrganization
{
    public function upload(UploadedFile $file, Organization $organization): void
    {
        $fileName = time().'_'.$organization->id.'_logo.'.$file->extension();

        $filePath = 'organizations/'.$fileName;

        Storage::disk('public')
            ->putFileAs('organizations', $file, $fileName);

        $organization->update([
            'logo_path' => $filePath,
        ]);
    }
}
