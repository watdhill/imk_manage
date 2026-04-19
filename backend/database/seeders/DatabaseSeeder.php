<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Support\Facades\Hash;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        User::updateOrCreate(
            ['email' => 'admin@imk.test'],
            [
                'name' => 'Administrator',
                'password' => Hash::make('Admin12345!'),
                'role' => 'admin',
            ]
        );

        User::updateOrCreate(
            ['email' => 'bendahara@imk.test'],
            [
                'name' => 'Bendahara IMK',
                'password' => Hash::make('Bendahara123!'),
                'role' => 'bendahara',
            ]
        );

        User::updateOrCreate(
            ['email' => 'ketuadivisi@imk.test'],
            [
                'name' => 'Ketua Divisi IMK',
                'password' => Hash::make('KetuaDivisi123!'),
                'role' => 'ketua_divisi',
            ]
        );

        User::updateOrCreate(
            ['email' => 'anggota@imk.test'],
            [
                'name' => 'Anggota IMK',
                'password' => Hash::make('Anggota123!'),
                'role' => 'anggota',
            ]
        );
    }
}
