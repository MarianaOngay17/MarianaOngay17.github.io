document.addEventListener('DOMContentLoaded', () => {
    AOS.init();
    darkMode();
    cargarProyectos();
});


async function cargarProyectos(){
    try {
        const respuesta = await fetch('assets/data/data.json');
        const datos = await respuesta.json();
        renderizarProyectos(datos.proyectos)

    } catch (error) {
        console.error('Error al cargar las habilidades:', error);
    }
}

function renderizarProyectos(lista){

    const contenedor = document.querySelector(".proyectos__content");
    const botonCargarMas = document.getElementById("cargar-mas-proyectos");

    lista.forEach(proyecto => {

        var divProyecto = document.createElement('DIV');
        divProyecto.classList.add('proyectos__proyecto');
        divProyecto.classList.add('proyectos__proyecto--all');

        var tools = proyecto.Tools.map(tool => {
            return `<img src="${tool.icon}" alt="${tool.title}">`;
        }).join('');

        divProyecto.innerHTML = `
                    <img src="${proyecto.LiveDemoImage}" alt="" class="proyectos__livedemo" aria-hidden="true">
                    <div class="proyectos__title">
                        <h3>${proyecto.title}</h3>
                        <div class="proyectos__tools">
                            ${tools}
                            <a 
                            href="${proyecto.GitHub}"
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label="Repositorio de ${proyecto.title} (abre en una nueva pestaña)">
                            <img src="assets/images/Icons/github-icon.png" alt="" aria-hidden="true"></a>
                        </div> 
                    </div> 
                    <a href="${proyecto.LiveDemo}" 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        class="proyectos__livedemo-btn"
                        aria-label="Ver Live Demo de ${proyecto.title}  (abre en una nueva pestaña)">
                        LIVE DEMO
                    </a>
        `;

        contenedor.insertBefore(divProyecto, botonCargarMas);


        
    });

}

function darkMode(){
    const prefiereDarkMode = window.matchMedia('(prefers-color-scheme: dark)');
    const themeToggle = document.getElementById('theme-toggle');

    setTheme(prefiereDarkMode.matches);

    prefiereDarkMode.addEventListener('change', (e) => {
        setTheme(e.matches);
    });

    themeToggle.addEventListener('click', () => {
        const isCurrentDark = themeToggle.getAttribute('aria-pressed') === 'true';
        setTheme(!isCurrentDark);
    });
}

function setTheme(isDark) {
    const themeToggle = document.getElementById('theme-toggle');
    if (!themeToggle) return; 

    themeToggle.setAttribute('aria-pressed', isDark);
    document.body.classList.toggle('dark-mode', isDark);
    
    if (isDark) {
        themeToggle.setAttribute('aria-label', 'Cambiar a modo claro');
    } else {
        themeToggle.setAttribute('aria-label', 'Cambiar a modo oscuro');
    }
}