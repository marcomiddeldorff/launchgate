<?php

namespace App\Http\Controllers;

use App\Actions\Clients\CreateNewClient;
use App\Actions\Clients\UpdateClient;
use App\Http\Requests\Clients\StoreClientRequest;
use App\Http\Requests\Clients\UpdateClientRequest;
use App\Models\Client;
use App\Support\Toast;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Gate;
use Inertia\Inertia;
use Inertia\Response;

class ClientController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(): Response
    {
        $clients = Client::forCurrentOrganization()->get();

        return Inertia::render('clients/index', [
            'clients' => $clients,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create(): Response
    {
        return Inertia::render('clients/create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreClientRequest $request, CreateNewClient $createNewClient): RedirectResponse
    {
        $client = $createNewClient->create($request->validated());

        Toast::success('Der Kunde '.$client->name.' wurde erstellt.');

        return redirect()->route('clients.index');
    }

    /**
     * Display the specified resource.
     */
    public function show(Client $client): Response
    {
        return Inertia::render('clients/show', [
            'client' => $client,
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Client $client): Response
    {
        return Inertia::render('clients/edit', [
            'client' => $client,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateClientRequest $request, Client $client, UpdateClient $updateClient): RedirectResponse
    {
        $updateClient->update($request->validated(), $client);

        Toast::success('Der Kunde '.$client->name.' wurde aktualisiert.');

        return redirect()->route('clients.show', $client->id);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Client $client): RedirectResponse
    {
        Gate::authorize('delete', $client);

        $client->delete();

        Toast::success('Der Kunde wurde gelöscht.');

        return redirect()->route('clients.index');
    }
}
