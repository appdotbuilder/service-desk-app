<?php

namespace Database\Factories;

use App\Models\Ticket;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Ticket>
 */
class TicketFactory extends Factory
{
    /**
     * The name of the factory's corresponding model.
     *
     * @var class-string<\App\Models\Ticket>
     */
    protected $model = Ticket::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $priorities = ['Rendah', 'Sedang', 'Tinggi'];
        $statuses = ['pending', 'in_progress', 'finished'];
        $departments = ['HR', 'Finance', 'Marketing', 'Sales', 'Operations', 'Legal'];
        
        $issues = [
            'Computer won\'t start',
            'Email not working',
            'Printer connection issues',
            'Software installation request',
            'Network connectivity problems',
            'Password reset needed',
            'File sharing permissions',
            'VPN access issues',
            'Monitor display problems',
            'Keyboard replacement',
            'Mouse not responding',
            'Slow computer performance',
            'Browser crashes frequently',
            'Unable to access shared drive',
            'Video conference setup',
            'Mobile device setup',
            'Application error messages',
            'Database connection timeout',
            'Backup and recovery',
            'Security software alerts',
        ];

        $descriptions = [
            'I\'m experiencing issues with my computer and need technical assistance.',
            'The problem started this morning and is affecting my productivity.',
            'I\'ve tried basic troubleshooting but the issue persists.',
            'This is preventing me from completing my daily tasks.',
            'The error occurs consistently when I try to perform this action.',
            'I need help setting up this new software/hardware.',
            'The system has been running slowly for the past few days.',
            'I\'m getting error messages that I don\'t understand.',
            'This worked fine yesterday but stopped working today.',
            'I need access to this system to complete my work.',
        ];

        return [
            'title' => fake()->randomElement($issues),
            'description' => fake()->randomElement($descriptions) . ' ' . fake()->sentence(10),
            'priority' => fake()->randomElement($priorities),
            'status' => fake()->randomElement($statuses),
            'department' => fake()->randomElement($departments),
            'created_by' => User::factory(),
            'assigned_to' => null, // Will be set by seeder based on status
        ];
    }

    /**
     * Indicate that the ticket is pending.
     */
    public function pending(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'pending',
            'assigned_to' => null,
        ]);
    }

    /**
     * Indicate that the ticket is in progress.
     */
    public function inProgress(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'in_progress',
        ]);
    }

    /**
     * Indicate that the ticket is finished.
     */
    public function finished(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'finished',
        ]);
    }

    /**
     * Indicate that the ticket has high priority.
     */
    public function highPriority(): static
    {
        return $this->state(fn (array $attributes) => [
            'priority' => 'Tinggi',
        ]);
    }

    /**
     * Indicate that the ticket has medium priority.
     */
    public function mediumPriority(): static
    {
        return $this->state(fn (array $attributes) => [
            'priority' => 'Sedang',
        ]);
    }

    /**
     * Indicate that the ticket has low priority.
     */
    public function lowPriority(): static
    {
        return $this->state(fn (array $attributes) => [
            'priority' => 'Rendah',
        ]);
    }
}