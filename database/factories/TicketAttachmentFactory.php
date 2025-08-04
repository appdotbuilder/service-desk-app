<?php

namespace Database\Factories;

use App\Models\Ticket;
use App\Models\TicketAttachment;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\TicketAttachment>
 */
class TicketAttachmentFactory extends Factory
{
    /**
     * The name of the factory's corresponding model.
     *
     * @var class-string<\App\Models\TicketAttachment>
     */
    protected $model = TicketAttachment::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $filenames = [
            'error_screenshot.png',
            'system_log.txt',
            'error_report.pdf',
            'network_diagram.jpg',
            'troubleshooting_steps.docx',
            'configuration_backup.json',
            'performance_graph.png',
            'error_details.pdf',
        ];

        $mimeTypes = [
            '.png' => 'image/png',
            '.jpg' => 'image/jpeg',
            '.txt' => 'text/plain',
            '.pdf' => 'application/pdf',
            '.docx' => 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
            '.json' => 'application/json',
        ];

        $filename = fake()->randomElement($filenames);
        $extension = '.' . pathinfo($filename, PATHINFO_EXTENSION);
        $mimeType = $mimeTypes[$extension] ?? 'application/octet-stream';

        return [
            'ticket_id' => Ticket::factory(),
            'filename' => $filename,
            'filepath' => 'ticket-attachments/' . fake()->uuid() . $extension,
            'mime_type' => $mimeType,
            'file_size' => fake()->numberBetween(1024, 5242880), // 1KB to 5MB
        ];
    }
}