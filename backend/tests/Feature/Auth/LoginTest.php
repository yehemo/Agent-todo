<?php

namespace Tests\Feature\Auth;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class LoginTest extends TestCase
{
    use RefreshDatabase;

    public function test_can_login_with_correct_credentials(): void
    {
        $user = User::factory()->create(['password' => bcrypt('password123')]);

        $this->postJson('/api/v1/auth/login', [
            'email'    => $user->email,
            'password' => 'password123',
        ])->assertStatus(200)
          ->assertJsonStructure(['data' => ['token', 'user']]);
    }

    public function test_cannot_login_with_wrong_password(): void
    {
        $user = User::factory()->create(['password' => bcrypt('password123')]);

        $this->postJson('/api/v1/auth/login', [
            'email'    => $user->email,
            'password' => 'wrongpassword',
        ])->assertStatus(422);
    }

    public function test_cannot_login_with_nonexistent_email(): void
    {
        $this->postJson('/api/v1/auth/login', [
            'email'    => 'nobody@example.com',
            'password' => 'password123',
        ])->assertStatus(422);
    }

    public function test_logout_revokes_token(): void
    {
        $user  = User::factory()->create(['password' => bcrypt('password123')]);
        $token = $user->createToken('test')->plainTextToken;

        $this->withToken($token)->postJson('/api/v1/auth/logout')->assertStatus(200);

        $this->withToken($token)->getJson('/api/v1/auth/user')->assertStatus(401);
    }
}
