<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('tickets', function (Blueprint $table) {
            $table->id();
            $table->string('title')->comment('Ticket title/subject');
            $table->text('description')->comment('Detailed problem description');
            $table->enum('priority', ['Rendah', 'Sedang', 'Tinggi'])->default('Rendah')->comment('Ticket priority level');
            $table->enum('status', ['pending', 'in_progress', 'finished'])->default('pending')->comment('Current ticket status');
            $table->string('department')->comment('Department that created the ticket');
            $table->foreignId('created_by')->constrained('users');
            $table->foreignId('assigned_to')->nullable()->constrained('users');
            $table->timestamps();
            
            // Add indexes for performance
            $table->index('status');
            $table->index('priority');
            $table->index('department');
            $table->index('created_by');
            $table->index('assigned_to');
            $table->index(['status', 'created_at']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('tickets');
    }
};