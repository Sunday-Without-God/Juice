<?php

namespace App\Http\Controllers\Api\V1;

use App\Exams\TokenRepository;
use App\Http\Requests\Api\V1\SubmissionRequest;
use App\Questions\Question;
use App\Submissions\Repository;
use App\Submissions\Submission;
use Cache;
use Carbon\Carbon;
use File;
use Illuminate\Contracts\Filesystem\FileNotFoundException;
use Illuminate\Http\Request;

class SubmissionController extends ApiController
{
    /**
     * User submit code using web interface.
     *
     * @param SubmissionRequest $request
     * @param string $uuid
     * @return \Illuminate\Http\JsonResponse
     */
    public function storeUsingWeb(SubmissionRequest $request, $uuid)
    {
        return $this->store(
            $uuid,
            $request->user()->getAuthIdentifier(),
            [
                'language' => $request->input('language'),
                'code'     => $request->input('code', $request->file('code')),
            ]
        );
    }

    /**
     * User submit code using turn in program.
     *
     * @param Request $request
     * @param string $uuid
     * @return \Illuminate\Http\JsonResponse
     */
    public function storeUsingTurnIn(Request $request, $uuid)
    {
        $data = TokenRepository::getData($request->input('token'));

        if (is_null($data)) {
            return $this->setMessages(['Token mismatch.'])->responseUnauthorized();
        } elseif (! in_array($uuid, $data['questions'])) {
            return $this->setMessages(['Exam question not found.'])->responseNotFound();
        }

        return $this->store(
            $uuid,
            $data['userId'],
            [
                'language' => $request->input('language'),
                'code'     => $request->file('code'),
            ]
        );
    }

    /**
     * Store data into database.
     *
     * @param string $uuid
     * @param int $userId
     * @param array $input
     * @return \Illuminate\Http\JsonResponse
     */
    protected function store($uuid, $userId, array $input)
    {
        $question = Question::where('uuid', $uuid)->firstOrFail(['id']);

        $submission = $question->submissions()->save(new Submission([
            'user_id'      => $userId,
            'language'     => $input['language'],
            'submitted_at' => Carbon::now(),
        ]));

        if (false === $submission || $this->storeCode($submission, $input['code'])) {
            return $this->responseUnknownError();
        }

        return $this->setData($submission->fresh())->responseCreated();
    }

    /**
     * Save the submitted code.
     *
     * @param Submission $submission
     * @param $code
     * @return bool
     */
    protected function storeCode(Submission $submission, $code)
    {
        $repository = new Repository($submission);

        if (! $repository->save($code)) {
            return false;
        }

        $submission->setAttribute('code', $repository->getPath());

        return $submission->save();
    }

    /**
     * Get submission and judge info.
     *
     * @param int $submissionId
     * @return \Illuminate\Http\JsonResponse
     */
    public function show($submissionId)
    {
        $submission = Submission::findOrFail($submissionId);

        $this->authorize($submission);

        return $this->setData($submission)->responseOk();
    }

    /**
     * Get the submission code.
     *
     * @param int $submissionId
     * @return \Illuminate\Http\JsonResponse
     */
    public function code($submissionId)
    {
        $submission = Submission::findOrFail($submissionId);

        $this->authorize($submission);

        try {
            $code = File::get($submission->getAttribute('code'));
        } catch (FileNotFoundException $e) {
            return $this->responseUnknownError();
        }

        return $this->setData($code)->responseOk();
    }
}
