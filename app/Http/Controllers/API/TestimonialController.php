<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Services\TestimonialService;
use App\Http\Requests\TestimonialRequest;

class TestimonialController extends Controller
{
    public function __construct(TestimonialService $service)
    {
        $this->service = $service;
    }
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return $this->service->getAllTestimonials();
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(TestimonialRequest $request)
    {
        $data = $request->validated();

        return $this->service->createTestimonial($data);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        return $this->service->getTestimonialById($id);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(TestimonialRequest $request, string $id)
    {
        $data = $request->validated();

        return $this->service->updateTestimonial($id, $data);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $this->service->deleteTestimonial($id);

        return response()->json([
            'success' => true,
            'message' => 'Testimonial deleted successfully.'
        ]);
    }
}
