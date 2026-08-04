<?php

namespace App\DTOs;

class LocalizationDTO
{
    public string $locale;

    public string $name;

    public string $localizedName;

    /**
     * @return array<LocalizationDTO>
     */
    public static function getLocales(): array
    {
        $locales = config('localization.locales');

        $result = [];

        foreach ($locales as $locale) {
            $class = new self;
            $class->locale = $locale['locale'];
            $class->name = $locale['name'];
            $class->localizedName = $locale['localizedName'];
            $result[] = $class;
        }

        return $result;
    }
}
