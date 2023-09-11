<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Symfony\Component\HttpFoundation\Response;

class RequestLogger
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        Log::info('Incoming Request:', [
            'method' => $request->method(),
            'url' => $request->fullUrl(),
            'headers' => $request->header(),
            'payload' => $request->all(), // Log request data if needed
        ]);

        // Continue processing the request
        return $next($request);
    }
}
