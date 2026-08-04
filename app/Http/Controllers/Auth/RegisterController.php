<?php

namespace App\Http\Controllers\Auth;

use App\Actions\Fortify\CreateNewUser;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class RegisterController extends Controller
{
    /**
     * Handle the incoming request.
     */
    public function __invoke(Request $request, CreateNewUser $createNewUser)
    {
        $data = $request->all();

        $user = $createNewUser->create($data);

        if ($user) {
            Auth::login($user);

            return redirect()->route('dashboard');
        }

        return back();
    }
}
