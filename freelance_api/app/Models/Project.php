<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Project extends Model
{

    use HasFactory;
    protected $fillable = [
        'user_id',
        'title',
        'description',
        'skills',
        'budget',
        'status',
        'company_url',
    ];
    // Cast the 'skills' attribute to an array
    protected $casts = [
        'skills' => 'array',
    ];

    public function applications()
    {
        return $this->hasMany(Application::class);
    }

}
