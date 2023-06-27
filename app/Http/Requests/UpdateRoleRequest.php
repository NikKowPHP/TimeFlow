<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Contracts\Validation\Validator;
use Illuminate\Http\Exceptions\HttpResponseException;
use Illuminate\Http\JsonResponse;

class UpdateRoleRequest extends FormRequest
{
    protected function failedValidation(Validator $validator)
    {
        $errors = $validator->errors();
        $errorMessage = 'You must choose at least one role';
        throw new HttpResponseException(
            response()->json([
                'message' => $errorMessage,
                'errors'=> $errors,
            ], JsonResponse::HTTP_UNPROCESSABLE_ENTITY)
        );
    }
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array|string>
     */
    public function rules(): array
    {
        // TODO: handle unprocessable content error when there is no roles

        return [
            'user_id' => 'required|int',
            'role_id' => 'required|array',
            'role_id.*' => 'integer|exists:roles,id'
        ];
    }
}
