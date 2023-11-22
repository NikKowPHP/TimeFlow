<?php

namespace App\Http\Controllers\Api;

use App\Models\Role;
use App\Models\User;
use Illuminate\Http\Request;
use App\Http\Requests\LoginRequest;
use Illuminate\Support\Facades\Log;
use App\Http\Controllers\Controller;
use App\Http\Requests\SignupRequest;
use Illuminate\Support\Facades\Auth;
use Laravel\Socialite\Facades\Socialite;

class AuthController extends Controller
{
    //
    public function signup(SignupRequest $signupRequest)
    {
        $data = $signupRequest->validated();

        $user = User::create([
            'name' => $data['name'],
            'email' => $data['email'],
            'password' => bcrypt($data['password'])
        ]);

        $default_role = Role::where('role', 'user')->first();

        if ($default_role) {
            $user->roles()->attach($default_role);
        }

        $token = $user->createToken('main')->plainTextToken;

        return response(compact('user', 'token'));

    }
    public function login(LoginRequest $loginRequest)
    {
        $credentials = $loginRequest->validated();
        if (!Auth::attempt($credentials)) {
            return response([
                'message' => 'Provided email address or password is incorrect'
            ]);
        }
        $user = Auth::user();
        header('Access-Control-Allow-Origin: http://localhost:3000');
        $token = $user->createToken('main')->plainTextToken;
        return response(compact('user', 'token'));
    }
    public function logout(Request $request)
    {
        $user = $request->user();
        $user->currentAccessToken()->delete();
        return response('', 204);
    }

    public function redirectToGoogle()
    {
        return response()->json([
            'url' => Socialite::driver('google')->stateless()->redirect()->getTargetUrl(),
        ]);
    }
    public function handleGoogleCallback()
    {
        try {
            $user = Socialite::driver('google')->stateless()->user();

            $existingUser = User::where('email', $user->email)->first();

            if ($existingUser) {
                Auth::login($existingUser);
                $user = Auth::user();
                $token = $user->createToken('main')->plainTextToken;

                return response(compact('user', 'token'));
            } else {
                $newUserData = [
                    'name' => $user->name,
                    'email' => $user->email,
                ];
                $newUser = User::create($newUserData);
                $defaultRole = Role::where('role', 'user')->first();

                if ($defaultRole) {
                    $newUser->roles()->attach($defaultRole);
                }
                Auth::login($newUser);
                $token = $newUser->createToken('main')->plainTextToken;
                return redirect('/calendar')->with(compact('user', 'token'));
            }
        } catch (\Exception $e) {
            return redirect('/login')->with('error', 'Failed to authenticate with Google');
        }
    }

}