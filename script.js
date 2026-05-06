document.addEventListener('DOMContentLoaded', () => {
  // Intersection Observer for scroll animations
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target); // Only animate once
      }
    });
  }, observerOptions);

  // Observe all feature cards
  const cards = document.querySelectorAll('.feature-card');
  cards.forEach(card => observer.observe(card));

  // Dynamic parallax effect for hero mockup
  const heroImg = document.querySelector('.hero-img-wrap');
  if (heroImg && window.innerWidth > 1024) {
    window.addEventListener('mousemove', (e) => {
      const mouseX = (e.clientX / window.innerWidth - 0.5) * 20;
      const mouseY = (e.clientY / window.innerHeight - 0.5) * 20;
      
      heroImg.style.transform = `perspective(1000px) rotateY(${ -15 + mouseX}deg) rotateX(${ 5 - mouseY}deg)`;
    });
  }

  // Smooth scroll for anchors
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;
      
      document.querySelector(targetId).scrollIntoView({
        behavior: 'smooth'
      });
    });
  });
  // ─── OS Detection ──────────────────────────────────────────────────────────
  const getOS = () => {
    const userAgent = window.navigator.userAgent;
    const platform = window.navigator.platform;
    const macosPlatforms = ['Macintosh', 'MacIntel', 'MacPPC', 'Mac68K'];
    const windowsPlatforms = ['Win32', 'Win64', 'Windows', 'WinCE'];
    const iosPlatforms = ['iPhone', 'iPad', 'iPod'];

    if (macosPlatforms.indexOf(platform) !== -1) return 'Mac';
    if (iosPlatforms.indexOf(platform) !== -1) return 'iOS';
    if (windowsPlatforms.indexOf(platform) !== -1) return 'Windows';
    if (/Android/.test(userAgent)) return 'Android';
    if (/Linux/.test(platform)) return 'Linux';

    return 'Unknown';
  };

  const userOS = getOS();
  console.log(`[MediaVault] Detected OS: ${userOS}`);

  // ─── Auto-Versioning Logic (GitHub API) ───────────────────────────────────
  const setupAutoVersioning = async () => {
    try {
      const repo = 'amromotaw3/MediaVault-Setup';
      const response = await fetch(`https://api.github.com/repos/${repo}/releases/latest`);
      if (!response.ok) throw new Error('GitHub API request failed');
      
      const release = await response.json();
      const version = release.tag_name.replace(/^v/, ''); 

      // 1. Update Version Badge
      const badge = document.getElementById('app-version-badge');
      if (badge) {
        badge.textContent = `MEDIAVAULT V${version} IS HERE`;
      }

      const winAsset = release.assets.find(a => a.name.toLowerCase().endsWith('.exe'));
      const apkAsset = release.assets.find(a => a.name.toLowerCase().endsWith('.apk'));
      
      const winBtn = document.getElementById('download-win');
      const androidBtn = document.getElementById('download-android');

      // 3. Update Hero Buttons
      if (winBtn && winAsset) {
        winBtn.href = winAsset.browser_download_url;
      }
      
      if (androidBtn && apkAsset) {
        androidBtn.href = apkAsset.browser_download_url;
      }

      // 5. Highlight OS-specific button
      if (userOS === 'Android' && androidBtn) {
        androidBtn.classList.remove('btn-secondary');
        androidBtn.classList.add('btn-primary');
        if (winBtn) {
          winBtn.classList.remove('btn-primary');
          winBtn.classList.add('btn-secondary');
        }
      }
      
      console.log(`[Auto-Version] Site synced with GitHub Release v${version}`);
    } catch (err) {
      console.error('[Auto-Version] Failed to sync with GitHub:', err);
    }
  };

  setupAutoVersioning();
});
