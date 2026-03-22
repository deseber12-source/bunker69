// Filtro de menú por categorías
document.addEventListener('componentesCargados', () => {
    const filtros = document.querySelectorAll('.filtro-btn');
    const items = document.querySelectorAll('.servicio-item');

    if (!filtros.length || !items.length) return;

    filtros.forEach(btn => {
        btn.addEventListener('click', () => {
            // Quitar clase active de todos
            filtros.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const categoria = btn.getAttribute('data-filter');

            items.forEach(item => {
                if (categoria === 'todos' || item.getAttribute('data-categoria') === categoria) {
                    item.style.display = 'block';
                } else {
                    item.style.display = 'none';
                }
            });
        });
    });
});