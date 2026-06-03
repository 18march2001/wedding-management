<?php

namespace App\Services;
use App\Repositories\Interfaces\TestimonialRepositoryInterface;

class TestimonialService
{
    public function __construct(
        private TestimonialRepositoryInterface $repository
    ) {}

    public function getAllTestimonials()
    {
        return $this->repository->all();
    }

    public function getTestimonialById($id)
    {
        return $this->repository->find($id);
    }

    public function createTestimonial(array $data)
    {
        return $this->repository->create($data);
    }

    public function updateTestimonial($id, array $data)
    {
        return $this->repository->update($id, $data);
    }

    public function deleteTestimonial($id)
    {
        return $this->repository->delete($id);
    }
}