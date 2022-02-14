<?php

namespace App\Http\Controllers;

use App\Models\ChatMessage;
use App\Models\Groupchat;
use App\Models\groupmembers;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Response;
use Illuminate\Routing\Controller;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use App\Events\Message;

// *----------------------------------------
// Message channel
// *----------------------------------------
// Server side : Message::Class -> is for sending message to reciever with broadcasting event
// Client side : listen to 'message_'+(your id)
// *----------------------------------------

class MessengerController extends Controller
{
    public $contact_paginate = 15;
    public $message_paginate = 15;

    function messenger () 
    {

        return view('messenger', ['id' => auth()->id()]);
    }

    function getContacts ()
    {
        try{
            $users = ChatMessage::join('users',  function ($j) {
                $j->on('chat_messages.from_id', '=', 'users.id')
                    ->orOn('chat_messages.to_id', '=', 'users.id');
            })
            ->where(function ($q) {
                $q->where('chat_messages.from_id', auth()->id())
                ->orWhere('chat_messages.to_id', auth()->id());
            })
            ->where('users.id','!=',auth()->id())
            ->select('users.id','users.name',DB::raw('MAX(chat_messages.created_at) max_created_at'))
            ->orderBy('max_created_at', 'desc')
            ->groupBy('users.id','users.name','users.active')
            ->get();

            $response = [];

            foreach($users as $user){
                $message = ChatMessage::where('created_at',$user->max_created_at)
                            ->where(function ($q) {
                                $q->where('from_id', auth()->id())
                                ->orWhere('to_id', auth()->id());
                            })
                            ->limit(1)
                            ->get();

                array_push($response,
                    array(
                        'userId' => $user->id,
                        'name' => ucfirst($user->name),
                        'latest' => $user->max_created_at,
                        'message' => $message
                    )
                );
            }

            return response()->json($response);
        }
        catch(\Throwable $th){
            throw $th;
        }
    }

    function createGroup (Request $request)
    {
        try{
            
            $request->validate([
                'group_name' => 'required'
            ]);

            $group = Groupchat::create([
                "name" => $request->group_name,
                "user_id" => auth()->id()
            ]);

            $group->save();

            $gcmem = Groupmembers::create([
                "groupchats_id" => $group->id,
                "user_id" => auth()->id()
            ]);

            $gcmem->save();

            return ["success" => true];
        }
        catch(\Throwable $th){
            throw $th;
        }
    }

    function getGroups ()
    {
        try{
            $groups = Groupmembers::where('user_id','=',auth()->id())->get();

            $response = [];

            foreach($groups as $g){
                $gc = Groupchat::where('id','=',$g->groupchats_id)
                                ->where('isActive','=','1')
                                ->get();

                array_push(
                    $response,$gc
                );
            }

            return response()->json($response);
        }
        catch(\Throwable $th){
            throw $th;
        }
    }

    function getMessages (Request $request)
    {
        if($request->message_group == 0){
            $message = ChatMessage::where('from_id',auth()->id())
                ->where('to_id',$request->message_with)
                ->orWhere('from_id', $request->message_with)
                ->where('to_id',auth()->id())
                ->get();
        }
        else{
            $message = ChatMessage::where('to_group_id',$request->message_group)->get();
        }
        
        $response = [];
            
        foreach($message as $m){
            $mres = User::where('id','=',$m->from_id)->get();
            
            $m->from_name =$mres[0]->name;

            array_push($response,$m);
        }

        return response()->json($response);

    }

    function sendMessage (Request $request)
    {
        $attachment = "";

        if($request->hasFile('attachment')){
           $attachment = time().'.'.$request->file('attachment')->extension();

            $request->file('attachment')->move(public_path('attachments'), $attachment);
        }

        // if(!($request->input('message')) && !($request->hasFile('attachment'))){
        //     return ["success" => false];
        // }

        $request->validate([
            'body' => 'max:5000'
        ]);

        try{
            $newChat = ChatMessage::create([
                'to_id' => $request->input('to'),
                'to_group_id' => $request->input('group'),
                'from_id' => auth()->id(),
                'body' => $request->input('message'),
                'attachment' => $attachment,
                'type' => $request->input('attachment_type') ? $request->input('attachment_type') : "text",
            ]);

            $newChat->save();

            event(new Message(
                $request->input('message'),
                $attachment,
                $request->input('attachment_type'),
                $request->input('to'),
                $request->input('group'),
                auth()->id(),
                auth()->user()->name,
                $request->input('timestamp'),
            ));

            return ["success" => true,"attachment" => $attachment];

            
        }
        catch(\Throwable $th){
            throw $th;
        }
    }
}
