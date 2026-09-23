(() => {
  const dialog = document.querySelector('.lightbox');
  if (!dialog || typeof dialog.showModal !== 'function') return;
  const links = [...document.querySelectorAll('[data-viewer]')];
  const image = dialog.querySelector('.viewer-image img');
  const title = dialog.querySelector('#viewer-title');
  const count = dialog.querySelector('.viewer-count');
  let current = 0;
  let opener;
  function render(index) {
    current = (index + links.length) % links.length;
    const link = links[current];
    image.src = link.dataset.animated && !matchMedia('(prefers-reduced-motion: reduce)').matches ? link.dataset.animated : link.href;
    image.alt = link.querySelector('img').alt;
    title.textContent = link.dataset.title;
    count.textContent = `${current + 1} / ${links.length}`;
  }
  links.forEach((link, index) => link.addEventListener('click', event => {
    if (event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
    event.preventDefault();
    opener = link;
    render(index);
    dialog.showModal();
    document.body.classList.add('viewer-open');
  }));
  dialog.querySelector('.viewer-close').addEventListener('click', () => dialog.close());
  dialog.querySelector('.viewer-prev').addEventListener('click', () => render(current - 1));
  dialog.querySelector('.viewer-next').addEventListener('click', () => render(current + 1));
  dialog.addEventListener('keydown', event => {
    if (event.key === 'ArrowRight' || event.key === 'ArrowLeft') {
      event.preventDefault();
      render(current + (event.key === 'ArrowRight' ? 1 : -1));
    }
  });
  dialog.addEventListener('click', event => {
    if (event.target !== dialog) return;
    const box = dialog.getBoundingClientRect();
    if (event.clientX < box.left || event.clientX > box.right || event.clientY < box.top || event.clientY > box.bottom) dialog.close();
  });
  dialog.addEventListener('close', () => {
    document.body.classList.remove('viewer-open');
    opener?.focus({ preventScroll: true });
    image.removeAttribute('src');
  });
  matchMedia('(prefers-reduced-motion: reduce)').addEventListener('change', () => {
    if (dialog.open) render(current);
  });
})();
