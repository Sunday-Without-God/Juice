<?php

namespace App\Providers;

use App\Exams\Exam;
use App\Policies\Api\v1\ExamPolicy;
use App\Policies\Api\V1\SubmissionPolicy;
use App\Submissions\Submission;
use Illuminate\Contracts\Auth\Access\Gate as GateContract;
use Illuminate\Foundation\Support\Providers\AuthServiceProvider as ServiceProvider;

class AuthServiceProvider extends ServiceProvider
{
    /**
     * The policy mappings for the application.
     *
     * @var array
     */
    protected $policies = [
        Exam::class       => ExamPolicy::class,
        Submission::class => SubmissionPolicy::class,
    ];

    /**
     * Register any application authentication / authorization services.
     *
     * @param  \Illuminate\Contracts\Auth\Access\Gate  $gate
     * @return void
     */
    public function boot(GateContract $gate)
    {
        $this->registerPolicies($gate);

        //
    }
}
