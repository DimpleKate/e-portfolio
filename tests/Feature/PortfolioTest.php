<?php

namespace Tests\Feature;

use Tests\TestCase;

class PortfolioTest extends TestCase
{
    public function test_portfolio_home_page_renders_all_sections(): void
    {
        $response = $this->get('/');

        $response->assertOk();
        $response->assertSee('Dimple Kate B. Bodonia');
        $response->assertSee('id="home"', false);
        $response->assertSee('id="about"', false);
        $response->assertSee('id="education"', false);
        $response->assertSee('id="portfolio"', false);
        $response->assertSee('id="tech-stack"', false);
        $response->assertSee('id="certificates"', false);
        $response->assertSee('id="projects"', false);
        $response->assertSee('id="contact"', false);
    }

    public function test_portfolio_page_exposes_cv_projects_and_certificates(): void
    {
        $response = $this->get('/');

        $response->assertOk();
        $response->assertSee('Dimple-Kate-Bodonia-CV.pdf');
        $response->assertSee('Personal DTR');
        $response->assertDontSee('AbraKeeps');
        $response->assertDontSee('All projects');
        $response->assertDontSee('Web apps');
        $response->assertSee('Kusina ni Mama Reservation &amp; Ordering System', false);
        $response->assertSee('Brew &amp; Go', false);
        $response->assertSee('Technical Support Ticketing System');
        $response->assertSee('Online Safety Through Netiquette');
        $response->assertSee('Startup Now Cordillera');
        $response->assertSee('Introduction to Modern AI');
        $response->assertDontSee('Next Certification');
    }

    public function test_certificates_are_sorted_newest_first_with_normalized_dates(): void
    {
        $response = $this->get('/');

        $response->assertOk();
        $response->assertSeeInOrder([
            'Data Analytics Essentials',
            'Data Science Essentials with Python',
            'Ethical Hacker',
            'Introduction to Cybersecurity',
            'Introduction to Greenhouse Gas Accounting for IT',
            'Networking Basics',
            'Operating Systems Basics',
            'Python Essentials 1',
            'Introduction to Modern AI',
            'Startup Now Cordillera',
            'Startup Fundamentals',
            'Online Safety Through Netiquette',
        ]);
        $response->assertSee('datetime="2026-11"', false);
        $response->assertSee('datetime="2026-10"', false);
        $response->assertSee('datetime="2026-09"', false);
        $response->assertSee('datetime="2026-07"', false);
        $response->assertSee('November 2026');
        $response->assertSee('October 2026');
        $response->assertSee('September 2026');
        $response->assertSee('July 2026');
    }

    public function test_portfolio_excludes_footer_speed_monitor_and_stale_monitors(): void
    {
        $response = $this->get('/');

        $response->assertOk();
        $response->assertDontSee('id="speedMonitor"', false);
        $response->assertDontSee('Testing…');
        $response->assertDontSee('id="pingMonitor"', false);
        $response->assertDontSee('Real-time ping');
        $response->assertDontSee('Designed and built with care.');
        $response->assertDontSee('id="themeToggle"', false);
        $response->assertDontSee('navbar__cta');
    }

    public function test_speedtest_payload_streams_real_bytes_without_caching(): void
    {
        $response = $this->get('/speedtest/payload');

        $response->assertOk();
        $response->assertHeader('Content-Type', 'application/octet-stream');
        $response->assertHeader('Content-Length', (string) (512 * 1024));
        $this->assertStringContainsString('no-store', $response->headers->get('Cache-Control'));
        $this->assertSame(512 * 1024, strlen($response->streamedContent()));
    }

    public function test_sitemap_and_robots_are_available(): void
    {
        $this->get('/sitemap.xml')
            ->assertOk()
            ->assertHeader('Content-Type', 'application/xml; charset=UTF-8')
            ->assertSee('<urlset', false);

        $this->get('/robots.txt')
            ->assertOk()
            ->assertHeader('Content-Type', 'text/plain; charset=UTF-8')
            ->assertSee('Sitemap:');
    }

    public function test_portfolio_section_renders_tabs_for_projects_certificates_and_tech_stack(): void
    {
        $response = $this->get('/');

        $response->assertOk();
        $response->assertSee('href="#portfolio"', false);
        $response->assertSee('data-section="portfolio"', false);
        $response->assertSee('data-portfolio-tab="projects"', false);
        $response->assertSee('data-portfolio-tab="certificates"', false);
        $response->assertSee('data-portfolio-tab="tech-stack"', false);
    }
}
