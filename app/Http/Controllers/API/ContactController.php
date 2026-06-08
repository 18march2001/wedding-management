<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Http\Requests\ContactRequest;
use App\Models\ContactModel;

class ContactController extends Controller
{
    public function update(ContactRequest $request)
    {
        // Assuming you have a ContactModel to handle the contact information
        $contact = ContactModel::first(); // Get the first contact record
        if (!$contact) {
            $contact = new ContactModel(); // Create a new record if it doesn't exist
        }

        $contact->fill($request->validated());
        $contact->save();

        return response()->json(['message' => 'Contact information updated successfully', 'contact' => $contact]);
    }
}
