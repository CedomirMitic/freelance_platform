<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Models\User;

class Application extends Model
{
    protected $fillable = [
        'project_id',
        'user_id',
        'cv_path',
        'motivation_path',
        'extra_path'
    ];

    public function project()
    {
        return $this->belongsTo(Project::class);
    }
    public function user()
{
    return $this->belongsTo(User::class);
}
}