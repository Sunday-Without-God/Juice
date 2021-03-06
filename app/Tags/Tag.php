<?php

namespace App\Tags;

use DB;
use App\Core\Entity;
use App\Questions\Question;

class Tag extends Entity
{
    /**
     * Indicates if the model should be timestamped.
     *
     * @var bool
     */
    public $timestamps = false;

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = ['name'];

    /**
     * 取得指定標籤的所有題目.
     *
     * @return \Illuminate\Database\Eloquent\Relations\MorphToMany
     */
    public function questions()
    {
        return $this->morphedByMany(Question::class, 'taggable');
    }

    /**
     * The "booting" method of the model.
     *
     * @return void
     */
    protected static function boot()
    {
        parent::boot();

        static::deleting(function (Tag $tag) {
            DB::table('taggables')
                ->where('tag_id', $tag->getAttribute('id'))
                ->delete();
        });
    }
}
