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
        Schema::create('releases', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('organization_id')
                ->constrained()
                ->cascadeOnDelete();
            $table->foreignUuid('project_id')
                ->constrained()
                ->cascadeOnDelete();
            $table->foreignUuid('environment_id')
                ->nullable()
                ->constrained()
                ->cascadeOnDelete();
            $table->string('name');
            $table->string('version')
                ->nullable();
            $table->text('description')
                ->nullable();
            $table->text('scope')
                ->nullable();
            $table->string('status');
            $table->string('risk_level');
            $table->timestamp('test_starts_at')
                ->nullable();
            $table->timestamp('test_ends_at')
                ->nullable();
            $table->timestamp('planned_go_live_at')
                ->nullable();
            $table->timestamp('approved_at')
                ->nullable();
            $table->timestamp('deployed_at')
                ->nullable();
            $table->timestamp('completed_at')
                ->nullable();
            $table->timestamp('cancelled_at')
                ->nullable();
            $table->foreignUuid('project_manager_user_id')
                ->constrained('users')
                ->cascadeOnDelete();
            $table->text('known_limitations')
                ->nullable();
        });

        Schema::create('release_builds', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('organization_id')
                ->constrained()
                ->cascadeOnDelete();
            $table->foreignUuid('project_id')
                ->constrained()
                ->cascadeOnDelete();
            $table->foreignUuid('release_id')
                ->constrained()
                ->cascadeOnDelete();
            $table->foreignUuid('environment_id')
                ->constrained()
                ->cascadeOnDelete();
            $table->string('label');
            $table->string('version')
                ->nullable();
            $table->string('commit_sha')
                ->nullable();
            $table->string('branch')
                ->nullable();
            $table->string('pipeline_url')
                ->nullable();
            $table->string('artifact_url')
                ->nullable();
            $table->text('release_notes')
                ->nullable();
            $table->string('status');
            $table->timestamp('deployed_at')
                ->nullable();
            $table->foreignUuid('created_by_user_id')
                ->constrained('users')
                ->cascadeOnDelete();
            $table->timestamps();
        });

        Schema::table('releases', function (Blueprint $table) {
            $table->foreignUuid('current_build_id')
                ->nullable()
                ->constrained('release_builds')
                ->cascadeOnDelete();

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('releases', function (Blueprint $table) {
            $table->dropForeign(['current_build_id']);
            $table->dropColumn('current_build_id');
        });

        Schema::dropIfExists('release_builds');
        Schema::dropIfExists('releases');
    }
};
