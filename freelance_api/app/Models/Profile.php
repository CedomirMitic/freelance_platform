<?php

namespace App\Models;

use App\Models\User;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Profile extends Model
{
    protected $fillable = [
        'user_id',
        'first_name',
        'last_name',
    ];

    public function user(): BelongsTo
    {
        // this model belongs to user table
        return $this->belongsTo(User::class);
    }
}
