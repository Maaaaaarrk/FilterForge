try {
  if (localStorage.getItem('filterforge.theme') !== 'retro') document.documentElement.dataset.theme = 'modern';
} catch (e) {
  document.documentElement.dataset.theme = 'modern';
}
