<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Auth;
use Illuminate\Auth\Events\Registered;
use App\Models\Groupmembers;

class AuthController extends Controller
{
    function signin () {
        return view('auth.login');
    }

    function signup () {
        return view('auth.register');
    }

    function search (Request $request) {

        $user = User::where('name','LIKE','%'.$request->name.'%')
                    ->where('id','!=',auth()->id())
                    ->get();

        $response = [];

        foreach($user as $u){
            $g = Groupmembers::where('groupchats_id','=',$request->groupid)
                        ->where('user_id','=',$u->id)
                        ->get();

            $u->already_added = $g;
            array_push($response,$u);
        }

        return response()->json($response);
    }

    function addToGroup (Request $request) {
        // if((count($request->id) == 0) || !($request->groupid)) return ["status" => false, "message" => "Empty"];
        $ids = explode(',',$request->id);

        foreach($ids as $id){
            $user = Groupmembers::create([
                'user_id' => $id,
                'groupchats_id' => $request->groupid
            ]);
        }

        return ["status" => true];
    }

    function register (Request $request) {
        // validate
        $fields = $request->validate([
            'name' => 'required|min:6|string',
            'email' => 'required|email|unique:users,email',
            'password' => 'required|min:5|max:12|confirmed',
        ]);

        $user = User::create([
            'name' => $fields['name'],
            'email' => $fields['email'],
            'password' => bcrypt($fields['password']),
        ]);

        event(new Registered($user));

        Auth::login($user);

        if (Auth::attempt(['email'=>$fields['email'], 'password'=>$fields['password']])) {
            $request->session()->regenerate();

            return redirect()->intended('messenger');
        }

        return back()->withErrors([
            'email' => 'Unable to register.',
        ]);
    }

    function logout (Request $request) {
        $user = User::where('id', auth()->id())
                ->update(['active' => false]);

        Auth::logout();
        $request->session()->invalidate();
        $request->session()->regenerateToken();
        return redirect()->route('auth.signin');
    }

    function login (Request $request) {
        $credentials = $request->validate([
            'email' => ['required','email'],
            'password' => ['required'],
        ]);

        if (Auth::attempt($credentials)) {
            $request->session()->regenerate();
            
            $user = User::where('id', auth()->id())
            ->update(['active' => true]);

            return redirect()->route('messenger');
        }

        return back()->withErrors([
            'email' => 'The provided credentials do not match our records.',
        ]);
    }
}
