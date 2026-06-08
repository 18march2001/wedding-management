<?php

namespace App\Repositories;
use App\Models\VideoModel;
use App\Repositories\Interfaces\VideoRepositoryInterface;

class VideoRepository implements VideoRepositoryInterface
{
    public function getAll()
    {
        return VideoModel::all();
    }

    public function findById(int $id)
    {
        return VideoModel::find($id);
    }

    public function create(array $data)
    {
        return VideoModel::create($data);
    }

    public function update(int $id, array $data)
    {
        $video = $this->findById($id);
        $video->update($data);
        return $video;
    }

    public function delete(int $id)
    {
        $video = $this->findById($id);
        if (!$video) {
            return response()->json(['message' => 'Video not found'], 404);
        }
        $video->delete();
        return $video;
    }
}