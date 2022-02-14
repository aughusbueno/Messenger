<?php

namespace App\Events;

use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PresenceChannel;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class Message implements ShouldBroadcast
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public $message;
    public $to;
    public $group;
    public $from;
    public $from_name;
    public $timestamp;
    public $attachment;
    public $attachment_type;
    /**
     * Create a new event instance.
     *
     * @return void
     */
    public function __construct($message,$attachment,$attachment_type,$to,$group,$from,$from_name,$timestamp)
    {
        $this->message = $message;
        $this->attachment = $attachment;
        $this->attachment_type = $attachment_type;
        $this->to = $to;
        $this->group = $group;
        $this->from = $from;
        $this->from_name = $from_name;
        $this->timestamp = $timestamp;
    }

    /**
     * Get the channels the event should broadcast on.
     *
     * @return \Illuminate\Broadcasting\Channel|array
     */
    public function broadcastOn()
    {
        return ['chat_'.$this->to];
    }

    public function broadcastAs() {
        return 'message';
    }
}
