<?php

namespace App\Services;
use App\Repositories\Interfaces\VideoRepositoryInterface;

class VideoService
{
    public function __construct(
        private VideoRepositoryInterface $repository
    ) {}

    public function getVideos()
    {
        return $this->repository->getAll();
    }

    public function createVideo(array $data)
    {
        return $this->repository->create($data);
    }

    public function getVideoById(string $id)
    {
        return $this->repository->findById($id);
    }

    public function updateVideo(string $id, array $data)
    {
        return $this->repository->update($id, $data);
    }

    public function deleteVideo(string $id)
    {
        return $this->repository->delete($id);
    }
}