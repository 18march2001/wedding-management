<?php

namespace App\Repositories;
use App\Models\TestimonialModel;
use App\Repositories\Interfaces\TestimonialRepositoryInterface;

class TestimonialRepository implements TestimonialRepositoryInterface
{
    public function all()
    {
        return TestimonialModel::all();
    }

    public function find($id)
    {
        return TestimonialModel::findOrFail($id);
    }

    public function create(array $data)
    {
        return TestimonialModel::create($data);
    }

    public function update($id, array $data)
    {
        $testimonial = $this->find($id);
        $testimonial->update($data);
        return $testimonial;
    }

    public function delete($id)
    {
        $testimonial = $this->find($id);
        return $testimonial->delete();
    }
}