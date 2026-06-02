<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Services\GalleryService;
use App\Http\Requests\GalleryRequest;

class GalleryController extends Controller
{
    public function __construct(
        private GalleryService $service
    ) {}
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return $this->service->getGalleries();
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(GalleryRequest $request)
    {
        $data = $request->validated();
        if ($request->hasFile('image')) {
            $data['image'] = $request->file('image');
        }

        return $this->service->createGallery($data);
    }

    /**
     * Display the specified resource.
     */
    public function show(int $id)
    {
        return $this->service->getGalleryById($id);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(GalleryRequest $request, int $id)
    {
        $data = $request->validated();
        if ($request->hasFile('image')) {
            $data['image'] = $request->file('image');
        }

        return $this->service->updateGallery($id, $data);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(int $id)
    {
        return $this->service->deleteGallery($id);
    }
}
