/* ============================================
   NUSANTARA STORE – JavaScript
   ============================================ */

(function () {
  'use strict';

  /* ---- Helpers ---- */
  const qs  = (sel, ctx = document) => ctx.querySelector(sel);
  const qsa = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];

  /* =========================================
     1. ANNOUNCEMENT BAR
     ========================================= */
  const annBar  = qs('#announcement-bar');
  const closeAnn = qs('#closeAnn');

  if (closeAnn && annBar) {
    closeAnn.addEventListener('click', () => {
      annBar.classList.add('hidden');
      sessionStorage.setItem('ann-closed', '1');
    });
    if (sessionStorage.getItem('ann-closed')) {
      annBar.classList.add('hidden');
    }
  }

  /* =========================================
     2. NAVBAR – scroll behaviour & mobile menu
     ========================================= */
  const navbar    = qs('#navbar');
  const hamburger = qs('#hamburger');
  const navLinks  = qs('#nav-links');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 10) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  }, { passive: true });

  if (hamburger && navLinks) {
    hamburger.addEventListener('click', () => {
      const isOpen = navLinks.classList.toggle('open');
      hamburger.classList.toggle('open', isOpen);
      hamburger.setAttribute('aria-expanded', String(isOpen));
    });

    // Close mobile nav on link click
    qsa('.nav-link', navLinks).forEach(link => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('open');
        hamburger.classList.remove('open');
      });
    });
  }

  // Active nav link on scroll
  const sections   = qsa('section[id]');
  const navLinkEls = qsa('.nav-link');

  function updateActiveNav() {
    const scrollY = window.scrollY + 100;
    sections.forEach(section => {
      const top    = section.offsetTop;
      const height = section.offsetHeight;
      const id     = section.getAttribute('id');
      if (scrollY >= top && scrollY < top + height) {
        navLinkEls.forEach(l => l.classList.remove('active'));
        const active = qs(`.nav-link[href="#${id}"]`);
        if (active) active.classList.add('active');
      }
    });
  }

  window.addEventListener('scroll', updateActiveNav, { passive: true });

  /* =========================================
     3. SEARCH OVERLAY
     ========================================= */
  const searchBtn     = qs('#searchBtn');
  const searchOverlay = qs('#searchOverlay');
  const searchClose   = qs('#searchClose');
  const searchInput   = qs('#searchInput');

  if (searchBtn && searchOverlay) {
    searchBtn.addEventListener('click', () => {
      searchOverlay.classList.toggle('active');
      if (searchOverlay.classList.contains('active')) {
        searchInput.focus();
      }
    });

    searchClose.addEventListener('click', () => {
      searchOverlay.classList.remove('active');
    });

    searchInput.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') searchOverlay.classList.remove('active');
    });
  }

  /* =========================================
     4. PRODUCT FILTER TABS
     ========================================= */
  const filterTabs = qsa('.filter-tab');
  const produkCards = qsa('.produk-card');

  filterTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const cat = tab.dataset.category;

      // Update active tab
      filterTabs.forEach(t => {
        t.classList.remove('active');
        t.setAttribute('aria-selected', 'false');
      });
      tab.classList.add('active');
      tab.setAttribute('aria-selected', 'true');

      // Filter cards with animation
      produkCards.forEach((card, i) => {
        const cardCat = card.dataset.category;
        const show    = cat === 'semua' || cardCat === cat;

        if (show) {
          card.classList.remove('hidden');
          card.style.animationDelay = `${i * 0.05}s`;
          card.style.animation = 'none';
          requestAnimationFrame(() => {
            requestAnimationFrame(() => {
              card.style.animation = 'fadeInUp 0.4s var(--ease) both';
            });
          });
        } else {
          card.classList.add('hidden');
        }
      });
    });
  });

  /* =========================================
     5. CART – counter & toast
     ========================================= */
  let cartCount = 3;
  const cartBadge = qs('#cartBadge');

  function showToast(msg) {
    const toast = qs('#toast');
    if (!toast) return;
    toast.textContent = msg;
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), 2800);
  }

  function addToCart(name) {
    cartCount++;
    if (cartBadge) cartBadge.textContent = cartCount;
    showToast(`🛒 "${name}" ditambahkan ke keranjang!`);
  }

  qsa('.btn-keranjang').forEach((btn) => {
    btn.addEventListener('click', () => {
      const card   = btn.closest('.produk-card');
      const nama   = qs('.produk-nama', card)?.textContent.trim() || 'Produk';

      // Animate button
      btn.style.transform = 'scale(0.85)';
      setTimeout(() => btn.style.transform = '', 150);

      addToCart(nama);
    });
  });

  /* Cart button in nav */
  const cartBtn = qs('#cartBtn');
  if (cartBtn) {
    cartBtn.addEventListener('click', () => {
      showToast(`🛒 Kamu punya ${cartCount} item di keranjang`);
    });
  }

  /* =========================================
     6. WISHLIST TOGGLE
     ========================================= */
  qsa('.wishlist-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const isActive = btn.classList.toggle('active');
      const card  = btn.closest('.produk-card');
      const nama  = qs('.produk-nama', card)?.textContent.trim() || 'Produk';

      if (isActive) {
        showToast(`❤️ "${nama}" ditambahkan ke wishlist`);
      } else {
        showToast(`🤍 "${nama}" dihapus dari wishlist`);
      }
    });
  });

  /* =========================================
     7. COUNTDOWN TIMER
     ========================================= */
  function startCountdown() {
    const hoursEl = qs('#count-hours');
    const minsEl  = qs('#count-mins');
    const secsEl  = qs('#count-secs');

    if (!hoursEl) return;

    // End time: 8h 45m from page load
    const end = Date.now() + (8 * 3600 + 45 * 60) * 1000;

    function tick() {
      const diff = end - Date.now();
      if (diff <= 0) {
        hoursEl.textContent = '00';
        minsEl.textContent  = '00';
        secsEl.textContent  = '00';
        return;
      }

      const h = Math.floor(diff / 3600000);
      const m = Math.floor((diff % 3600000) / 60000);
      const s = Math.floor((diff % 60000) / 1000);

      const pad = n => String(n).padStart(2, '0');

      hoursEl.textContent = pad(h);
      minsEl.textContent  = pad(m);
      secsEl.textContent  = pad(s);

      requestAnimationFrame(() => setTimeout(tick, 1000));
    }

    tick();
  }

  startCountdown();

  /* =========================================
     8. QUICK VIEW MODAL
     ========================================= */
  const modalOverlay = qs('#modalOverlay');
  const modalClose   = qs('#modalClose');
  const modalContent = qs('#modalContent');

  const productData = {
    1: { name: 'Mug Keramik Klasik',      cat: 'Dapur & Minum',   price: 'Rp 89.000',  desc: 'Mug keramik berkualitas tinggi dengan desain klasik yang elegan. Cocok untuk kopi, teh, atau minuman favoritmu. Kapasitas 350ml, aman untuk microwave dan dishwasher.', rating: '★★★★★', reviews: 128, color: '#fff3e0', stroke: '#e65100', badgeType: 'Baru', badgeCss: 'badge-new' },
    2: { name: 'Dompet Kulit Genuine',    cat: 'Aksesoris',       price: 'Rp 185.000', old: 'Rp 230.000', desc: 'Dompet bifold dari bahan kulit sapi asli yang tahan lama dan nyaman dipakai. Dilengkapi slot kartu dan kompartemen uang tunai yang luas.', rating: '★★★★★', reviews: 256, color: '#efebe9', stroke: '#4e342e', badgeType: '-20%', badgeCss: 'badge-sale' },
    3: { name: 'Lilin Aromaterapi Set',   cat: 'Dekorasi Rumah',  price: 'Rp 125.000', desc: 'Set lilin aromaterapi dari soy wax alami dengan aroma lavender dan vanilla. Bakar selama 40 jam, dikemas dalam stoples kaca premium. Sempurna untuk relaksasi.', rating: '★★★★☆', reviews: 89, color: '#f1f8e9', stroke: '#33691e', badgeType: 'Terlaris', badgeCss: 'badge-popular' },
    4: { name: 'Notebook Hardcover',      cat: 'Alat Tulis',      price: 'Rp 65.000',  desc: 'Notebook hardcover premium dengan halaman dotted 160 lembar. Dilengkapi elastic closure, ribbon bookmark, dan pocket di halaman belakang. Kertas bebas tinta tembus.', rating: '★★★★★', reviews: 312, color: '#ede7f6', stroke: '#4527a0' },
    5: { name: 'Rak Kayu Mini',           cat: 'Dekorasi Rumah',  price: 'Rp 210.000', old: 'Rp 245.000', desc: 'Rak kayu mini dari bahan oak solid untuk memajang tanaman hias, foto, atau koleksi kecilmu. Desain minimalis modern yang cocok untuk berbagai gaya interior.', rating: '★★★★☆', reviews: 74, color: '#fff8e1', stroke: '#e65100', badgeType: '-15%', badgeCss: 'badge-sale' },
    6: { name: 'Earbuds Wireless Premium', cat: 'Elektronik',     price: 'Rp 350.000', desc: 'Earbuds TWS dengan driver 10mm untuk suara jernih dan bass yang dalam. Noise cancellation aktif, tahan air IPX5, baterai 6+24 jam. Konektivitas Bluetooth 5.3.', rating: '★★★★★', reviews: 445, color: '#e8eaf6', stroke: '#1a237e', badgeType: 'Baru', badgeCss: 'badge-new' },
    7: { name: 'Hand Cream Mewah',        cat: 'Perawatan Diri',  price: 'Rp 95.000',  desc: 'Hand cream premium dengan formula shea butter dan vitamin E yang melembapkan tangan secara intensif. Aroma mawar dan jasmine yang lembut, cepat meresap.', rating: '★★★★★', reviews: 198, color: '#fce4ec', stroke: '#880e4f', badgeType: 'Favorit', badgeCss: 'badge-popular' },
    8: { name: 'Tumbler Stainless 500ml', cat: 'Dapur & Minum',   price: 'Rp 112.000', old: 'Rp 148.000', desc: 'Tumbler stainless steel double-wall vacuum insulated. Menjaga minuman tetap dingin 24 jam atau panas 12 jam. BPA-free, aman, dan ramah lingkungan.', rating: '★★★★☆', reviews: 367, color: '#e0f7fa', stroke: '#006064', badgeType: '-25%', badgeCss: 'badge-sale' },
  };

  function openModal(id) {
    const p = productData[id];
    if (!p || !modalContent) return;

    modalContent.innerHTML = `
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:1.5rem;align-items:start">
        <div style="aspect-ratio:1;background:linear-gradient(135deg,${p.color} 0%,#f5f5f5 100%);border-radius:16px;display:flex;align-items:center;justify-content:center;position:relative;">
          ${p.badgeType ? `<span class="produk-badge ${p.badgeCss || ''}" style="position:absolute;top:.75rem;left:.75rem">${p.badgeType}</span>` : ''}
          <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="${p.stroke || '#888'}" stroke-width="1" stroke-linecap="round" stroke-linejoin="round">
            <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/>
          </svg>
        </div>
        <div>
          <p style="font-size:.72rem;font-weight:700;text-transform:uppercase;letter-spacing:.1em;color:#9ca3af;margin-bottom:.25rem">${p.cat}</p>
          <h2 id="modalTitle" style="font-size:1.2rem;font-weight:800;color:#1c1c24;line-height:1.3;margin-bottom:.5rem">${p.name}</h2>
          <div style="display:flex;align-items:center;gap:.5rem;margin-bottom:1rem">
            <span style="color:#f59e0b;font-size:.85rem">${p.rating}</span>
            <span style="font-size:.75rem;color:#9ca3af">(${p.reviews} ulasan)</span>
          </div>
          <p style="font-size:.88rem;color:#6b7280;line-height:1.65;margin-bottom:1rem">${p.desc}</p>
          <div style="margin-bottom:1.25rem">
            <span style="font-size:1.5rem;font-weight:800;color:#1a1a2e">${p.price}</span>
            ${p.old ? `<span style="font-size:.85rem;color:#9ca3af;text-decoration:line-through;margin-left:.5rem">${p.old}</span>` : ''}
          </div>
          <button onclick="document.getElementById('modalOverlay').classList.remove('active')" style="width:100%;padding:.75rem;background:#e8622a;color:white;border-radius:9999px;font-weight:700;font-size:.95rem;cursor:pointer;border:none;transition:all .25s;font-family:inherit" onmouseover="this.style.background='#d4541f'" onmouseout="this.style.background='#e8622a'">
            🛒 Tambahkan ke Keranjang
          </button>
        </div>
      </div>
    `;

    modalOverlay.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  qsa('.quick-view-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const id = parseInt(btn.dataset.product);
      openModal(id);
    });
  });

  if (modalClose) {
    modalClose.addEventListener('click', () => {
      modalOverlay.classList.remove('active');
      document.body.style.overflow = '';
    });
  }

  if (modalOverlay) {
    modalOverlay.addEventListener('click', (e) => {
      if (e.target === modalOverlay) {
        modalOverlay.classList.remove('active');
        document.body.style.overflow = '';
      }
    });
  }

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modalOverlay.classList.contains('active')) {
      modalOverlay.classList.remove('active');
      document.body.style.overflow = '';
    }
  });

  /* =========================================
     9. NEWSLETTER FORM
     ========================================= */
  const newsletterForm = qs('#newsletterForm');
  const formSuccess    = qs('#formSuccess');

  if (newsletterForm) {
    newsletterForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const emailInput = qs('#emailInput');
      const email = emailInput.value.trim();

      if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        emailInput.style.borderColor = '#ef4444';
        emailInput.placeholder = 'Masukkan email yang valid ya 😊';
        setTimeout(() => {
          emailInput.style.borderColor = '';
          emailInput.placeholder = 'Masukkan email kamu...';
        }, 2500);
        return;
      }

      formSuccess.style.display = 'block';
      emailInput.value = '';
      showToast('🎉 Selamat datang! Penawaran eksklusif menunggumu.');
    });
  }

  /* =========================================
     10. BACK TO TOP BUTTON
     ========================================= */
  const backToTop = qs('#backToTop');

  if (backToTop) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 400) {
        backToTop.classList.add('visible');
      } else {
        backToTop.classList.remove('visible');
      }
    }, { passive: true });

    backToTop.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  /* =========================================
     11. SCROLL-TRIGGERED ANIMATIONS
     ========================================= */
  function initScrollAnimations() {
    const targets = qsa('.trust-item, .kategori-card, .produk-card, .ulasan-card, .footer-col');
    targets.forEach(el => el.classList.add('anim-on-scroll'));

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

    targets.forEach(el => observer.observe(el));
  }

  initScrollAnimations();

  /* =========================================
     12. KATEGORI FILTER LINK
     ========================================= */
  qsa('.kategori-card').forEach(card => {
    card.addEventListener('click', (e) => {
      const filter = card.dataset.filter;
      if (!filter) return;

      // Trigger the corresponding filter tab
      const tab = qs(`.filter-tab[data-category="${filter}"]`);
      if (tab) {
        tab.click();
      }
    });
  });

  /* =========================================
     13. SMOOTH SCROLL POLYFILL (anchor links)
     ========================================= */
  qsa('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const targetId = anchor.getAttribute('href');
      if (targetId === '#') return;
      const target = qs(targetId);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  /* =========================================
     14. WISHLIST NAV ICON FEEDBACK
     ========================================= */
  const wishlistBtn = qs('#wishlistBtn');
  if (wishlistBtn) {
    wishlistBtn.addEventListener('click', () => {
      showToast('❤️ Lihat wishlist kamu');
    });
  }

  console.log('🛍️ Nusantara Store loaded successfully.');

})();
