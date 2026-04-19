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
        Schema::create('cash_transactions', function (Blueprint $table): void {
            $table->id();
            $table->enum('type', ['income', 'expense']);
            $table->enum('source', ['general', 'proker']);
            $table->string('description');
            $table->decimal('amount', 12, 2);
            $table->date('transaction_date');
            $table->foreignId('work_program_id')->nullable()->constrained('work_programs')->nullOnDelete();
            $table->foreignId('created_by')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('cash_transactions');
    }
};