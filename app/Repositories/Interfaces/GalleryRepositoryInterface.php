<?php

namespace App\Repositories\Interfaces;

interface GalleryRepositoryInterface
{
    public function getAll();

    public function findBySlug(string $slug);

    public function create(array $data);

    public function update(int $id, array $data);

    public function delete(int $id);
}