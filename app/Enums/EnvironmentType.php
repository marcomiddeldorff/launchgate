<?php

namespace App\Enums;

enum EnvironmentType: string
{
    case Production = 'production';
    case Staging = 'staging';
    case Testing = 'testing';
    case Preview = 'preview';
    case Custom = 'custom';
}
