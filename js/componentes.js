async function loadComponent(element) {
    const componentName = element.getAttribute('data-component');
    if (!componentName) return;

    try {
        const response = await fetch(`componentes/${componentName}.html`);
        if (!response.ok) throw new Error('Error al cargar componente');
        const html = await response.text();
        element.innerHTML = html;

        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = `css/componentes/${componentName}.css`;
        document.head.appendChild(link);
    } catch (error) {
        console.error(`Error cargando ${componentName}:`, error);
        element.innerHTML = `<p style="color:red; text-align:center;">Error al cargar sección</p>`;
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const components = document.querySelectorAll('[data-component]');
    Promise.all(Array.from(components).map(loadComponent)).then(() => {
        console.log('✅ Todos los componentes cargados');
        document.dispatchEvent(new Event('componentesCargados'));

        const toggle = document.querySelector('.menu-toggle');
        const navMenu = document.querySelector('.nav-menu');
        if (toggle && navMenu) {
            toggle.addEventListener('click', () => {
                navMenu.classList.toggle('active');
            });
        }
    });
});