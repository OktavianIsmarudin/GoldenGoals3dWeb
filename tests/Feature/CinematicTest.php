<?php

namespace Tests\Feature;

use Tests\TestCase;

class CinematicTest extends TestCase
{
    public function test_home_displays_the_cinematic_story_and_room_assets(): void
    {
        $this->get('/')
            ->assertOk()
            ->assertViewIs('cinematic')
            ->assertSee('Golden Goals — More Than a Score')
            ->assertSee(asset('css/cinematic.css'), false)
            ->assertSee(asset('js/cinematic.js'), false)
            ->assertSee(asset('js/logo-geometry.js'), false)
            ->assertSee(asset('js/study-room.js'), false)
            ->assertSee('data-step="4"', false)
            ->assertSee('RUANG BELAJAR KONSEPTUAL / 3D STUDY')
            ->assertSee('https://www.instagram.com/kursuspte_whv/', false);
    }
}
