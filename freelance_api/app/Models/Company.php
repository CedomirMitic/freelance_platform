<?php

namespace App\Models;

use App\Models\User;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Company extends Model
{
    protected $fillable = [
        'user_id',
        'company_name',
        'address',
    ];

    public function user(): BelongsTo
    {
        // "This model belongs to user table"
        return $this->belongsTo(User::class);
    }
}
