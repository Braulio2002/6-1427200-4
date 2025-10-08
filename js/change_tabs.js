// Inicializa pestañas de Producto | Imágenes y visor modal
document.addEventListener('DOMContentLoaded', function () {
  const productTab = document.getElementById('product-tab');
  const imagesTab = document.getElementById('images-tab');
  const informationSection = document.getElementById('information-section');
  const imagesSection = document.getElementById('images-section');

  if (productTab && imagesTab && informationSection && imagesSection) {
    // Estado inicial
    informationSection.classList.remove('hidden');
    imagesSection.classList.add('hidden');
    productTab.classList.add('bg-blue-600', 'text-white');
    productTab.classList.remove('bg-gray-100', 'text-gray-700');
    imagesTab.classList.remove('bg-blue-600', 'text-white');
    imagesTab.classList.add('bg-gray-100', 'text-gray-700');

    productTab.addEventListener('click', function () {
      informationSection.classList.remove('hidden');
      imagesSection.classList.add('hidden');
      productTab.setAttribute('aria-selected','true');
      productTab.setAttribute('tabindex','0');
      imagesTab.setAttribute('aria-selected','false');
      imagesTab.setAttribute('tabindex','-1');
      productTab.classList.add('bg-blue-600', 'text-white');
      productTab.classList.remove('bg-gray-100', 'text-gray-700');
      imagesTab.classList.remove('bg-blue-600', 'text-white');
      imagesTab.classList.add('bg-gray-100', 'text-gray-700');
    });

    imagesTab.addEventListener('click', function () {
      informationSection.classList.add('hidden');
      imagesSection.classList.remove('hidden');
      imagesTab.setAttribute('aria-selected','true');
      imagesTab.setAttribute('tabindex','0');
      productTab.setAttribute('aria-selected','false');
      productTab.setAttribute('tabindex','-1');
      imagesTab.classList.add('bg-blue-600', 'text-white');
      imagesTab.classList.remove('bg-gray-100', 'text-gray-700');
      productTab.classList.remove('bg-blue-600', 'text-white');
      productTab.classList.add('bg-gray-100', 'text-gray-700');
      const galleryImages = imagesSection.querySelectorAll('img');
      galleryImages.forEach(function(img) {
        img.classList.add('max-w-full');
      });
    });
    // Navegación con flechas entre tabs
    [productTab, imagesTab].forEach(function(tab){
      tab.addEventListener('keydown', function(e){
        if(e.key === 'ArrowRight' || e.key === 'ArrowLeft'){
          const next = this === productTab ? imagesTab : productTab;
          next.focus();
          next.click();
        }
      });
    });
  }
  // Marcar miniatura activa
  window.setActiveThumb = function(btn){
    const allThumbs = document.querySelectorAll('.thumb');
    allThumbs.forEach(function(t){ t.classList.remove('ring-2','ring-blue-500'); });
    const parent = btn && typeof btn.closest === 'function' ? btn.closest('.thumb') : null;
    if (parent) { parent.classList.add('ring-2','ring-blue-500'); }
  }
});

// Intercambio de imagen principal desde miniaturas
function toExchangeImage(imgElement) {
  const mainImg = document.getElementById('img_main');
  const newSrc = imgElement?.src;
  if (mainImg && newSrc) {
    mainImg.src = newSrc;
  }
}

// Modal para visualizar imagen ampliada
function viewImage(src) {
  const modal = document.getElementById('image-modal');
  const modalImg = document.getElementById('modal-image');
  if (!modal || !modalImg) return;
  modalImg.src = src;
  if (typeof modal.showModal === 'function') {
    modal.showModal();
  } else {
    modal.setAttribute('open','');
  }
}

function closeModal() {
  const modal = document.getElementById('image-modal');
  if (!modal) return;
  if (typeof modal.close === 'function') {
    modal.close();
  } else {
    modal.removeAttribute('open');
  }
}

// Cerrar modal al presionar ESC o hacer clic fuera de la imagen
document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape') {
    closeModal();
    const openTab = document.querySelector('#product-tab[aria-selected="true"], #images-tab[aria-selected="true"]');
    if(openTab){ openTab.focus(); }
  }
  // Navegación de imagen (opcional): flechas cambian miniaturas
  if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
    const thumbs = Array.from(document.querySelectorAll('.thumb img'));
    const main = document.getElementById('img_main');
    if(!thumbs.length || !main) return;
    const idx = thumbs.findIndex(t => t.src === main.src);
    const delta = e.key === 'ArrowRight' ? 1 : -1;
    const nextIdx = (idx + delta + thumbs.length) % thumbs.length;
    toExchangeImage(thumbs[nextIdx]);
    const parentBtn = thumbs[nextIdx].closest('button');
    if(parentBtn){ window.setActiveThumb(parentBtn); }
  }
});

document.addEventListener('click', function (e) {
  const modal = document.getElementById('image-modal');
  if (!modal) return;
  const isBackdrop = e.target === modal;
  if (isBackdrop) closeModal();
});