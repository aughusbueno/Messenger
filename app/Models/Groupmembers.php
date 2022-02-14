<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Groupmembers extends Model
{
    use HasFactory;

    
    protected $fillable = ['groupchats_id','user_id'];
}
