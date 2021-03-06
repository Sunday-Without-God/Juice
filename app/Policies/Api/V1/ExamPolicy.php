<?php

namespace App\Policies\Api\V1;

use App\Exams\Exam;
use App\Accounts\User;
use Illuminate\Auth\Access\HandlesAuthorization;

class ExamPolicy
{
    use HandlesAuthorization;

    public function before(User $user, $ability, Exam $exam)
    {
        if ($user->hasRole(['admin'])) {
            return true;
        }
    }

    /**
     * 確認使用者有權限查詢該測驗.
     *
     * @param User $user
     * @param Exam $exam
     * @return bool
     */
    public function show(User $user, Exam $exam)
    {
        return $this->isManager($user, $exam);
    }

    /**
     * 檢查是否具有管理此測驗的權限，如無，則確認是否為該測驗之考生.
     *
     * @param User $user
     * @param Exam $exam
     * @return bool
     */
    public function questions(User $user, Exam $exam)
    {
        return $this->fullCheck($user, $exam);
    }

    /**
     * 確認使用者有權限查詢該測驗.
     *
     * @param User $user
     * @param Exam $exam
     * @return bool
     */
    public function submissions(User $user, Exam $exam)
    {
        return $this->fullCheck($user, $exam);
    }

    /**
     * 檢查是否具有查詢成績的權限，如無，則確認是否為該測驗之考生.
     *
     * @param User $user
     * @param Exam $exam
     *
     * @return bool
     */
    public function scores(User $user, Exam $exam)
    {
        return $this->fullCheck($user, $exam);
    }

    /**
     * 檢查使用者身份.
     *
     * @param User $user
     * @param Exam $exam
     *
     * @return bool
     */
    protected function fullCheck(User $user, Exam $exam)
    {
        if ($this->isManager($user, $exam)) {
            return true;
        }

        return $this->inExam($user, $exam);
    }

    /**
     * Check the user is in the exam or not.
     *
     * @param User $user
     * @param Exam $exam
     *
     * @return bool
     */
    protected function inExam(User $user, Exam $exam)
    {
        return ! $exam->load(['users' => function ($query) use ($user) {
            $query->where('user_id', $user->getAuthIdentifier());
        }])->getRelation('users')->isEmpty();
    }

    /**
     * 確認使用者有權限查詢該測驗.
     *
     * @param User $user
     * @param Exam $exam
     * @return bool
     */
    protected function isManager(User $user, Exam $exam)
    {
        $allow = $exam->getAttribute('user_id') === $user->getAuthIdentifier();

        if ($allow) {
            return true;
        }

        $role = $exam->load(['role'])->getRelation('role');

        if (is_null($role)) {
            return false;
        }

        return $user->hasRole([$role->getAttribute('name')]);
    }
}
