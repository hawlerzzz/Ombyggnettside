// Complete Product & Cart Modal System - 100% Working
(function() {
  'use strict';

  console.log('=== Modal System Loading ===');

  // ============================================
  // SHARED UTILITIES
  // ============================================
  
  const getCart = () => JSON.parse(localStorage.getItem('cart') || '[]');
  const saveCart = (cart) => localStorage.setItem('cart', JSON.stringify(cart));
  
  const formatPrice = (price) => {
    if (price === null || price === undefined || isNaN(price)) {
      return '0,00 kr';
    }
    return price.toLocaleString('no-NO', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + ' kr';
  };

  const extractPrice = (priceText) => {
    if (!priceText) return 0;
    const match = priceText.match(/[\d\s,]+/);
    if (!match) return 0;
    const price = parseFloat(match[0].replace(/\s/g, '').replace(',', '.'));
    return isNaN(price) ? 0 : price;
  };

  const updateCartBadge = () => {
    const cart = getCart();
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    
    const cartLinks = document.querySelectorAll('a[href="handlekurv.html"], a[href*="handlekurv"]');
    
    cartLinks.forEach(cartLink => {
      const oldBadge = cartLink.querySelector('.cart-badge');
      if (oldBadge) oldBadge.remove();
      
      if (totalItems > 0) {
        const badge = document.createElement('span');
        badge.className = 'cart-badge';
        badge.textContent = totalItems;
        badge.style.cssText = `
          position: absolute;
          top: 4px;
          right: 4px;
          background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
          color: white;
          font-size: 0.7rem;
          font-weight: 700;
          padding: 0.15rem 0.45rem;
          border-radius: 9999px;
          min-width: 1.2rem;
          height: 1.2rem;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 2px 8px rgba(239, 68, 68, 0.6);
          animation: cartPulse 0.5s ease-in-out;
          border: 2px solid white;
          pointer-events: none;
        `;
        
        cartLink.style.position = 'relative';
        cartLink.appendChild(badge);
      }
    });
  };

  // Add global styles
  const style = document.createElement('style');
  style.textContent = `
    @keyframes cartPulse {
      0%, 100% { transform: scale(1); }
      50% { transform: scale(1.2); }
    }
    @keyframes modalFadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }
    @keyframes modalSlideUp {
      from { transform: translateY(30px) scale(0.95); opacity: 0; }
      to { transform: translateY(0) scale(1); opacity: 1; }
    }
    .modal-overlay {
      animation: modalFadeIn 0.3s ease-out;
    }
    .modal-overlay > div {
      animation: modalSlideUp 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
    }
  `;
  document.head.appendChild(style);

  // ============================================
  // PRODUCT MODAL
  // ============================================

  const createProductModal = () => {
    if (document.getElementById('productModal')) return;
    
    const modalHTML = `
      <div id="productModal" class="modal-overlay" style="display: none; position: fixed; inset: 0; z-index: 9999; align-items: center; justify-content: center; background-color: rgba(0, 0, 0, 0.7); backdrop-filter: blur(8px); padding: 1rem;">
        <div style="background: white; border-radius: 1.5rem; box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.4); max-width: 80rem; width: 100%; max-height: 92vh; overflow: hidden;">
          
          <div style="display: flex; align-items: center; justify-content: space-between; padding: 1.5rem 2rem; border-bottom: 1px solid #e5e7eb; background: linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%); position: relative; overflow: hidden;">
            <div style="position: absolute; top: 0; right: 0; width: 300px; height: 300px; background: radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%); border-radius: 50%;"></div>
            <div style="display: flex; align-items: center; gap: 1rem; position: relative; z-index: 1;">
              <svg style="width: 2rem; height: 2rem; color: white;" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"/>
              </svg>
              <h2 style="font-size: 1.75rem; font-weight: 800; color: white; margin: 0; text-shadow: 0 2px 4px rgba(0,0,0,0.1);">Produktdetaljer</h2>
            </div>
            <button class="close-product-modal" style="color: white; background: rgba(255,255,255,0.2); border: 1px solid rgba(255,255,255,0.3); border-radius: 50%; padding: 0.75rem; cursor: pointer; transition: all 0.3s; position: relative; z-index: 1;">
              <svg style="width: 1.5rem; height: 1.5rem;" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M6 18L18 6M6 6l12 12"/>
              </svg>
            </button>
          </div>

          <div style="overflow-y: auto; max-height: calc(92vh - 110px); background: linear-gradient(to bottom, #f9fafb 0%, white 100%);">
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 3rem; padding: 2.5rem;">
              
              <div style="display: flex; flex-direction: column; gap: 1.5rem;">
                <div style="background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%); border-radius: 1.5rem; padding: 2rem; border: 2px solid #bfdbfe; box-shadow: 0 10px 25px -5px rgba(59, 130, 246, 0.1);">
                  <img id="modalImage" src="" alt="" style="width: 100%; height: auto; object-fit: contain; border-radius: 1rem; max-height: 28rem; box-shadow: 0 10px 20px rgba(0,0,0,0.1);">
                </div>
                
                <div style="display: flex; gap: 1rem;">
                  <div style="display: flex; align-items: center; gap: 0.75rem; background: linear-gradient(135deg, #ecfdf5 0%, #d1fae5 100%); padding: 0.75rem 1.25rem; border-radius: 1rem; border: 2px solid #86efac; flex: 1;">
                    <svg style="width: 1.5rem; height: 1.5rem; color: #16a34a;" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7"/>
                    </svg>
                    <span style="font-weight: 600; color: #166534; font-size: 0.95rem;">På lager</span>
                  </div>
                </div>

                <div style="background: white; border-radius: 1rem; padding: 1.5rem; border: 2px solid #e5e7eb;">
                  <h4 style="font-weight: 700; color: #1f2937; margin: 0 0 1rem 0; display: flex; align-items: center; gap: 0.5rem; font-size: 1rem;">
                    <svg style="width: 1.25rem; height: 1.25rem; color: #3b82f6;" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4z"/>
                    </svg>
                        Garanti
                  </h4>
                  <ul style="list-style: none; padding: 0; margin: 0; display: flex; flex-direction: column; gap: 0.75rem;">
                    <li style="display: flex; align-items: center; gap: 0.75rem; font-size: 0.9rem; color: #4b5563;">
                      <div style="width: 8px; height: 8px; background: #3b82f6; border-radius: 50%;"></div>
                      <span>Se kjøpsvilkår for nærmere informasjon om produktgaranti og reklamasjonsrettigheter</span>
                    </li>
                  </ul>
                </div>
              </div>

              <div style="display: flex; flex-direction: column; gap: 2rem;">
                <div>
                  <h3 id="modalProductName" style="font-size: 2rem; font-weight: 800; color: #1e3a8a; margin: 0 0 0.75rem 0; line-height: 1.2;"></h3>
                  <p id="modalProductSize" style="color: #6b7280; font-size: 1rem; margin: 0 0 1rem 0; font-weight: 500;"></p>
                  <div style="display: flex; align-items: center; gap: 0.75rem;">
                    <span id="modalProductCount" style="font-size: 0.85rem; color: #374151; background: linear-gradient(135deg, #f3f4f6 0%, #e5e7eb 100%); padding: 0.5rem 1rem; border-radius: 2rem; font-weight: 600; border: 1px solid #d1d5db;"></span>
                    <span style="font-size: 0.85rem; font-weight: 700; color: white; background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%); border-radius: 2rem; padding: 0.5rem 1rem;">KVALITETSPRODUKT</span>
                  </div>
                </div>

                <div style="background: linear-gradient(135deg, #ecfdf5 0%, #d1fae5 100%); border: 3px solid #22c55e; border-radius: 1.25rem; padding: 1.75rem;">
                  <div style="display: flex; align-items: baseline; gap: 0.75rem; margin-bottom: 0.5rem;">
                    <span style="font-size: 2.5rem; font-weight: 900; color: #15803d; letter-spacing: -1px;" id="modalPrice">0,00 kr</span>
                    <span style="font-size: 1rem; color: #166534; font-weight: 600;">eks. mva</span>
                  </div>
                  <div style="display: flex; align-items: center; gap: 0.5rem;">
                    <svg style="width: 1rem; height: 1rem; color: #16a34a;" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                    </svg>
                    <p style="font-size: 0.9rem; color: #166534; margin: 0; font-weight: 600;">Inkl. mva: <span id="modalPriceWithVat">0,00 kr</span></p>
                  </div>
                </div>

                <div style="background: linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%); border-radius: 1.25rem; padding: 1.75rem; border: 2px solid #93c5fd;">
                  <h4 style="font-weight: 700; color: #1e40af; margin: 0 0 1rem 0; display: flex; align-items: center; gap: 0.75rem; font-size: 1.1rem;">
                    <svg style="width: 1.5rem; height: 1.5rem;" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                    </svg>
                    Produktinformasjon
                  </h4>
                  <p style="font-size: 0.95rem; color: #1e40af; line-height: 1.7; margin: 0; font-weight: 500;">Høykvalitetsprodukt designet for lang levetid og optimal ytelse.</p>
                </div>

                <div style="background: white; border-radius: 1.25rem; padding: 1.75rem; border: 2px solid #e5e7eb;">
                  <h4 style="font-weight: 700; color: #1f2937; margin: 0 0 1.25rem 0; display: flex; align-items: center; gap: 0.75rem; font-size: 1.1rem;">
                    <svg style="width: 1.5rem; height: 1.5rem; color: #3b82f6;" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                    </svg>
                    Produktegenskaper
                  </h4>
                  <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
                    <div style="display: flex; align-items: start; gap: 0.75rem; background: #f9fafb; padding: 0.75rem; border-radius: 0.75rem;">
                      <span style="color: #16a34a; font-size: 1.25rem;">✓</span>
                      <span style="font-size: 0.9rem; color: #374151; font-weight: 500;">Enkel installasjon</span>
                    </div>
                    <div style="display: flex; align-items: start; gap: 0.75rem; background: #f9fafb; padding: 0.75rem; border-radius: 0.75rem;">
                      <span style="color: #16a34a; font-size: 1.25rem;">✓</span>
                      <span style="font-size: 0.9rem; color: #374151; font-weight: 500;">Lang levetid</span>
                    </div>
                    <div style="display: flex; align-items: start; gap: 0.75rem; background: #f9fafb; padding: 0.75rem; border-radius: 0.75rem;">
                      <span style="color: #16a34a; font-size: 1.25rem;">✓</span>
                      <span style="font-size: 0.9rem; color: #374151; font-weight: 500;">Gjenbrukt</span>
                    </div>
                    <div style="display: flex; align-items: start; gap: 0.75rem; background: #f9fafb; padding: 0.75rem; border-radius: 0.75rem;">
                      <span style="color: #16a34a; font-size: 1.25rem;">✓</span>
                      <span style="font-size: 0.9rem; color: #374151; font-weight: 500;">Slitesterkt</span>
                    </div>
                  </div>
                </div>

                <div style="background: linear-gradient(to bottom, white 0%, #f9fafb 100%); border-radius: 1.25rem; padding: 2rem; border: 2px solid #e5e7eb;">
                  <div style="display: flex; align-items: center; gap: 1.5rem; margin-bottom: 1.5rem;">
                    <label style="font-size: 1rem; font-weight: 700; color: #1f2937;">Antall:</label>
                    <div style="display: flex; align-items: center; border: 2px solid #3b82f6; border-radius: 0.75rem; overflow: hidden;">
                      <button class="product-qty-decrease" style="padding: 0.875rem 1.5rem; background: linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%); color: #1e40af; font-weight: 700; font-size: 1.25rem; border: none; cursor: pointer; transition: all 0.2s;">−</button>
                      <input type="number" id="productQuantity" value="1" min="1" style="width: 5rem; text-align: center; border: none; border-left: 2px solid #3b82f6; border-right: 2px solid #3b82f6; padding: 0.875rem; font-weight: 700; font-size: 1.125rem; color: #1e40af; outline: none; background: white;">
                      <button class="product-qty-increase" style="padding: 0.875rem 1.5rem; background: linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%); color: #1e40af; font-weight: 700; font-size: 1.25rem; border: none; cursor: pointer; transition: all 0.2s;">+</button>
                    </div>
                  </div>

                  <button class="add-to-cart-btn" style="width: 100%; background: linear-gradient(135deg, #1e40af 0%, #3b82f6 100%); color: white; font-weight: 700; font-size: 1.125rem; padding: 1.25rem; border-radius: 1rem; border: none; cursor: pointer; transition: all 0.3s; display: flex; align-items: center; justify-content: center; gap: 0.75rem; box-shadow: 0 10px 25px -5px rgba(59, 130, 246, 0.5);">
                    <svg style="width: 1.75rem; height: 1.75rem;" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2.5">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"/>
                    </svg>
                    LEGG TIL I HANDLEKURV
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
    document.body.insertAdjacentHTML('beforeend', modalHTML);
  };

  const openProductModal = (productCard) => {
    const modal = document.getElementById('productModal');
    if (!modal) return;
    
    const image = productCard.querySelector('img');
    const title = productCard.querySelector('h2');
    const size = productCard.querySelector('.text-sm.font-light');
    const priceElement = productCard.querySelector('.text-green-700');
    const countElement = productCard.querySelector('.text-xs.text-gray-500');

    if (!image || !title || !priceElement) {
      console.error('Missing product elements');
      return;
    }

    document.getElementById('modalImage').src = image.src;
    document.getElementById('modalImage').alt = title.textContent;
    document.getElementById('modalProductName').textContent = title.textContent;
    document.getElementById('modalProductSize').textContent = size ? size.textContent : '';
    document.getElementById('modalProductCount').textContent = countElement ? countElement.textContent : '';
    
    const priceText = priceElement.textContent;
    const price = extractPrice(priceText);
    
    console.log('Opening product modal:', { title: title.textContent, priceText, extractedPrice: price });
    
    document.getElementById('modalPrice').textContent = formatPrice(price);
    document.getElementById('modalPriceWithVat').textContent = formatPrice(price * 1.25);

    document.getElementById('productQuantity').value = 1;
    modal.style.display = 'flex';
    document.body.style.overflow = 'hidden';
  };

  const closeProductModal = () => {
    const modal = document.getElementById('productModal');
    if (modal) {
      modal.style.display = 'none';
      document.body.style.overflow = '';
    }
  };

  const addToCart = () => {
    const productName = document.getElementById('modalProductName').textContent;
    const quantity = parseInt(document.getElementById('productQuantity').value) || 1;
    const priceText = document.getElementById('modalPrice').textContent;
    const price = extractPrice(priceText);

    console.log('Adding to cart:', { productName, quantity, priceText, price });

    if (!productName || price === 0) {
      console.error('Invalid product data');
      return;
    }

    let cart = getCart();
    const existingItem = cart.find(item => item.name === productName);
    
    if (existingItem) {
      existingItem.quantity += quantity;
      console.log('Updated existing item');
    } else {
      const newItem = {
        name: productName,
        price: price,
        priceFormatted: priceText,
        quantity: quantity,
        image: document.getElementById('modalImage').src,
        size: document.getElementById('modalProductSize').textContent
      };
      cart.push(newItem);
      console.log('Added new item:', newItem);
    }

    saveCart(cart);
    console.log('Cart saved:', cart);
    updateCartBadge();

    const btn = document.querySelector('.add-to-cart-btn');
    if (btn) {
      const originalHTML = btn.innerHTML;
      btn.innerHTML = '<svg style="width: 1.75rem; height: 1.75rem;" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7"/></svg> LAGT TIL!';
      btn.style.background = 'linear-gradient(135deg, #16a34a 0%, #22c55e 100%)';

      setTimeout(() => {
        btn.innerHTML = originalHTML;
        btn.style.background = 'linear-gradient(135deg, #1e40af 0%, #3b82f6 100%)';
      }, 2000);
    }
  };

  // ============================================
  // CART MODAL
  // ============================================

  const createCartModal = () => {
    if (document.getElementById('cartModal')) return;
    
    const modalHTML = `
      <div id="cartModal" class="modal-overlay" style="display: none; position: fixed; inset: 0; z-index: 10000; align-items: center; justify-content: center; background-color: rgba(0, 0, 0, 0.7); backdrop-filter: blur(8px); padding: 1rem;">
        <div style="background: white; border-radius: 1.5rem; box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.4); max-width: 60rem; width: 100%; max-height: 92vh; overflow: hidden; display: flex; flex-direction: column;">
          
          <div style="display: flex; align-items: center; justify-content: space-between; padding: 1.5rem 2rem; border-bottom: 1px solid #e5e7eb; background: linear-gradient(135deg, #0000ff 0%, #0000ff 100%); position: relative; overflow: hidden;">
            <div style="position: absolute; top: 0; right: 0; width: 300px; height: 300px; background: radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%); border-radius: 50%;"></div>
            <div style="display: flex; align-items: center; gap: 1rem; position: relative; z-index: 1;">
              <svg style="width: 2rem; height: 2rem; color: white;" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"/>
              </svg>
              <h2 style="font-size: 1.75rem; font-weight: 800; color: white; margin: 0; text-shadow: 0 2px 4px rgba(0,0,0,0.1);">Handlekurv</h2>
              <span id="cartItemCount" style="background: rgba(255,255,255,0.3); color: white; font-size: 0.9rem; font-weight: 700; padding: 0.25rem 0.75rem; border-radius: 9999px; border: 2px solid white;"></span>
            </div>
            <button class="close-cart-modal" style="color: white; background: rgba(255,255,255,0.2); border: 1px solid rgba(255,255,255,0.3); border-radius: 50%; padding: 0.75rem; cursor: pointer; transition: all 0.3s; position: relative; z-index: 1;">
              <svg style="width: 1.5rem; height: 1.5rem;" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M6 18L18 6M6 6l12 12"/>
              </svg>
            </button>
          </div>

          <div id="cartItemsContainer" style="flex: 1; overflow-y: auto; padding: 2rem; background: linear-gradient(to bottom, #f9fafb 0%, white 100%);">
          </div>

          <div style="border-top: 2px solid #e5e7eb; padding: 2rem; background: white;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem; padding-bottom: 1rem; border-bottom: 1px solid #e5e7eb;">
              <div>
                <p style="font-size: 0.9rem; color: #6b7280; margin: 0 0 0.5rem 0;">Totalt eks. mva:</p>
                <p style="font-size: 1.5rem; font-weight: 700; color: #1f2937; margin: 0;" id="cartSubtotal">0,00 kr</p>
              </div>
              <div style="text-align: right;">
                <p style="font-size: 0.9rem; color: #6b7280; margin: 0 0 0.5rem 0;">MVA (25%):</p>
                <p style="font-size: 1.25rem; font-weight: 600; color: #6b7280; margin: 0;" id="cartVat">0,00 kr</p>
              </div>
              <div style="text-align: right;">
                <p style="font-size: 0.9rem; color: #16a34a; margin: 0 0 0.5rem 0; font-weight: 600;">Totalt inkl. mva:</p>
                <p style="font-size: 2rem; font-weight: 900; color: #16a34a; margin: 0;" id="cartTotal">0,00 kr</p>
              </div>
            </div>
            
            <div style="display: flex; gap: 1rem;">
              <button class="clear-cart-btn" style="flex: 1; background: linear-gradient(135deg, #fee2e2 0%, #fecaca 100%); color: #dc2626; font-weight: 700; font-size: 1rem; padding: 1rem; border-radius: 0.75rem; border: 2px solid #fca5a5; cursor: pointer; transition: all 0.3s;">
                <svg style="width: 1.25rem; height: 1.25rem; display: inline; margin-right: 0.5rem;" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                </svg>
                Tøm handlekurv
              </button>
              <button class="checkout-btn" style="flex: 2; background: linear-gradient(135deg, #16a34a 0%, #22c55e 100%); color: white; font-weight: 700; font-size: 1.125rem; padding: 1rem; border-radius: 0.75rem; border: none; cursor: pointer; transition: all 0.3s; box-shadow: 0 10px 25px -5px rgba(34, 197, 94, 0.5);">
                <svg style="width: 1.5rem; height: 1.5rem; display: inline; margin-right: 0.5rem;" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
                </svg>
                GÅ TIL KASSE
              </button>
            </div>
          </div>
        </div>
      </div>
    `;
    document.body.insertAdjacentHTML('beforeend', modalHTML);
  };

  const renderCartItems = () => {
    const cart = getCart();
    const container = document.getElementById('cartItemsContainer');
    const itemCount = document.getElementById('cartItemCount');
    
    if (!container || !itemCount) {
      console.error('Cart container elements not found');
      return;
    }
    
    const totalItems = cart.reduce((sum, item) => sum + (item.quantity || 0), 0);
    itemCount.textContent = `${totalItems} ${totalItems === 1 ? 'vare' : 'varer'}`;

    console.log('Rendering cart:', cart);

    if (cart.length === 0) {
      container.innerHTML = `
        <div style="text-align: center; padding: 4rem 2rem;">
          <svg style="width: 6rem; height: 6rem; color: #d1d5db; margin: 0 auto 1.5rem;" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"/>
          </svg>
          <h3 style="font-size: 1.5rem; font-weight: 700; color: #4b5563; margin: 0 0 0.5rem 0;">Handlekurven er tom</h3>
          <p style="color: #6b7280; font-size: 1rem;">Legg til produkter for å begynne å handle</p>
        </div>
      `;
      updateCartTotals();
      return;
    }

    container.innerHTML = cart.map((item, index) => {
      const itemPrice = item.price || 0;
      const itemQty = item.quantity || 0;
      
      return `
      <div style="background: white; border-radius: 1rem; padding: 1.5rem; margin-bottom: 1rem; border: 2px solid #e5e7eb; box-shadow: 0 2px 4px rgba(0,0,0,0.05); transition: all 0.3s;">
        <div style="display: grid; grid-template-columns: 100px 1fr auto; gap: 1.5rem; align-items: center;">
          
          <div style="background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%); border-radius: 0.75rem; padding: 0.5rem; border: 2px solid #bfdbfe;">
            <img src="${item.image || ''}" alt="${item.name || ''}" style="width: 100%; height: auto; object-fit: contain; border-radius: 0.5rem;">
          </div>

          <div>
            <h4 style="font-size: 1.125rem; font-weight: 700; color: #1f2937; margin: 0 0 0.5rem 0;">${item.name || 'Ukjent produkt'}</h4>
            ${item.size ? `<p style="font-size: 0.875rem; color: #6b7280; margin: 0 0 0.75rem 0;">${item.size}</p>` : ''}
            <div style="display: flex; align-items: center; gap: 1rem;">
              <span style="font-size: 1.25rem; font-weight: 700; color: #16a34a;">${formatPrice(itemPrice)}</span>
              <span style="font-size: 0.875rem; color: #6b7280;">eks. mva</span>
            </div>
          </div>

          <div style="display: flex; flex-direction: column; align-items: flex-end; gap: 1rem;">
            <div style="display: flex; align-items: center; border: 2px solid #3b82f6; border-radius: 0.5rem; overflow: hidden;">
              <button class="cart-qty-decrease" data-index="${index}" style="padding: 0.5rem 0.875rem; background: linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%); color: #1e40af; font-weight: 700; border: none; cursor: pointer; transition: all 0.2s;">−</button>
              <input type="number" value="${itemQty}" min="1" class="cart-qty-input" data-index="${index}" style="width: 3.5rem; text-align: center; border: none; border-left: 2px solid #3b82f6; border-right: 2px solid #3b82f6; padding: 0.5rem; font-weight: 700; color: #1e40af; outline: none;">
              <button class="cart-qty-increase" data-index="${index}" style="padding: 0.5rem 0.875rem; background: linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%); color: #1e40af; font-weight: 700; border: none; cursor: pointer; transition: all 0.2s;">+</button>
            </div>
            <button class="cart-item-remove" data-index="${index}" style="background: linear-gradient(135deg, #fee2e2 0%, #fecaca 100%); color: #dc2626; font-weight: 600; font-size: 0.875rem; padding: 0.5rem 1rem; border-radius: 0.5rem; border: 2px solid #fca5a5; cursor: pointer; transition: all 0.3s; display: flex; align-items: center; gap: 0.5rem;">
              <svg style="width: 1rem; height: 1rem;" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
              </svg>
              Fjern
            </button>
            <div style="font-size: 0.875rem; color: #6b7280; font-weight: 600;">
              Sum: <span style="color: #1f2937; font-weight: 700;">${formatPrice(itemPrice * itemQty)}</span>
            </div>
          </div>
        </div>
      </div>
      `;
    }).join('');

    updateCartTotals();
    attachCartItemListeners();
  };

  const updateCartTotals = () => {
    const cart = getCart();
    const subtotal = cart.reduce((sum, item) => {
      const price = item.price || 0;
      const qty = item.quantity || 0;
      return sum + (price * qty);
    }, 0);
    const vat = subtotal * 0.25;
    const total = subtotal + vat;

    const subtotalEl = document.getElementById('cartSubtotal');
    const vatEl = document.getElementById('cartVat');
    const totalEl = document.getElementById('cartTotal');

    if (subtotalEl) subtotalEl.textContent = formatPrice(subtotal);
    if (vatEl) vatEl.textContent = formatPrice(vat);
    if (totalEl) totalEl.textContent = formatPrice(total);
  };

  const attachCartItemListeners = () => {
    document.querySelectorAll('.cart-qty-decrease').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const index = parseInt(e.currentTarget.dataset.index);
        const cart = getCart();
        if (cart[index].quantity > 1) {
          cart[index].quantity--;
          saveCart(cart);
          renderCartItems();
          updateCartBadge();
        }
      });
    });

    document.querySelectorAll('.cart-qty-increase').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const index = parseInt(e.currentTarget.dataset.index);
        const cart = getCart();
        cart[index].quantity++;
        saveCart(cart);
        renderCartItems();
        updateCartBadge();
      });
    });

    document.querySelectorAll('.cart-qty-input').forEach(input => {
      input.addEventListener('change', (e) => {
        const index = parseInt(e.currentTarget.dataset.index);
        const newQty = parseInt(e.currentTarget.value);
        if (newQty >= 1) {
          const cart = getCart();
          cart[index].quantity = newQty;
          saveCart(cart);
          renderCartItems();
          updateCartBadge();
        }
      });
    });

    document.querySelectorAll('.cart-item-remove').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const index = parseInt(e.currentTarget.dataset.index);
        const cart = getCart();
        cart.splice(index, 1);
        saveCart(cart);
        renderCartItems();
        updateCartBadge();
      });
    });
  };

  const openCartModal = () => {
    const modal = document.getElementById('cartModal');
    if (!modal) return;
    
    renderCartItems();
    modal.style.display = 'flex';
    document.body.style.overflow = 'hidden';
  };

  const closeCartModal = () => {
    const modal = document.getElementById('cartModal');
    if (modal) {
      modal.style.display = 'none';
      document.body.style.overflow = '';
    }
  };

  const clearCart = () => {
    if (confirm('Er du sikker på at du vil tømme handlekurven?')) {
      saveCart([]);
      renderCartItems();
      updateCartBadge();
    }
  };

  const checkout = () => {
    const cart = getCart();
    if (cart.length === 0) {
      alert('Handlekurven er tom!');
      return;
    }
    alert('Går til kasse... (Implementer checkout-funksjonalitet her)');
  };

  // ============================================
  // INITIALIZATION
  // ============================================

  const init = () => {
    console.log('=== Initializing Modal System ===');
    
    // Create modals
    createProductModal();
    createCartModal();
    updateCartBadge();

    // Wait for DOM to be fully ready
    setTimeout(() => {
      // Product card clicks (only if products exist)
      const productCards = document.querySelectorAll('.product-card');
      console.log('Found product cards:', productCards.length);
      
      if (productCards.length > 0) {
        productCards.forEach((card) => {
          card.style.cursor = 'pointer';
          card.addEventListener('click', (e) => {
            if (e.target.closest('.like-btn')) return;
            openProductModal(card);
          });
        });

        // Product modal controls (only if product modal elements exist)
        const closeProductBtn = document.querySelector('.close-product-modal');
        const productModal = document.getElementById('productModal');
        const qtyDecrease = document.querySelector('.product-qty-decrease');
        const qtyIncrease = document.querySelector('.product-qty-increase');
        const addToCartBtn = document.querySelector('.add-to-cart-btn');

        if (closeProductBtn) {
          closeProductBtn.addEventListener('click', closeProductModal);
        }

        if (productModal) {
          productModal.addEventListener('click', (e) => {
            if (e.target.id === 'productModal') closeProductModal();
          });
        }
        
        if (qtyDecrease) {
          qtyDecrease.addEventListener('click', () => {
            const input = document.getElementById('productQuantity');
            if (input && input.value > 1) input.value = parseInt(input.value) - 1;
          });
        }
        
        if (qtyIncrease) {
          qtyIncrease.addEventListener('click', () => {
            const input = document.getElementById('productQuantity');
            if (input) input.value = parseInt(input.value) + 1;
          });
        }
        
        if (addToCartBtn) {
          addToCartBtn.addEventListener('click', addToCart);
        }
      }

      // Cart link clicks (always setup, cart works on any page)
      const cartLinks = document.querySelectorAll('a[href="handlekurv.html"], a[href*="handlekurv"]');
      console.log('Found cart links:', cartLinks.length);
      
      cartLinks.forEach(link => {
        link.addEventListener('click', (e) => {
          e.preventDefault();
          e.stopPropagation();
          console.log('Cart link clicked!');
          openCartModal();
          return false;
        }, true);
      });

      // Cart modal controls (always setup)
      const closeCartBtn = document.querySelector('.close-cart-modal');
      const cartModal = document.getElementById('cartModal');
      const clearCartBtn = document.querySelector('.clear-cart-btn');
      const checkoutBtn = document.querySelector('.checkout-btn');

      if (closeCartBtn) {
        closeCartBtn.addEventListener('click', closeCartModal);
      }

      if (cartModal) {
        cartModal.addEventListener('click', (e) => {
          if (e.target.id === 'cartModal') closeCartModal();
        });
      }
      
      if (clearCartBtn) {
        clearCartBtn.addEventListener('click', clearCart);
      }

      if (checkoutBtn) {
        checkoutBtn.addEventListener('click', checkout);
      }

      // Keyboard shortcuts
      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
          const productModal = document.getElementById('productModal');
          const cartModal = document.getElementById('cartModal');
          
          if (productModal && productModal.style.display === 'flex') {
            closeProductModal();
          } else if (cartModal && cartModal.style.display === 'flex') {
            closeCartModal();
          }
        }
      });

      console.log('=== Modal System Ready ===');
    }, 300);
  };

  // Start initialization
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();