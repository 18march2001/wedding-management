<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Services\VideoService;
use App\Http\Requests\VideoRequest;

class VideoController extends Controller
{
    public function __construct(
        private VideoService $service
    ) {}

    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return $this->service->getVideos();
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(VideoRequest $request)
    {
        return $this->service->createVideo($request->validated());

    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        return $this->service->getVideoById($id);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(VideoRequest $request, string $id)
    {
        return $this->service->updateVideo($id, $request->validated());
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        return $this->service->deleteVideo($id);
    }
}
