document.addEventListener('DOMContentLoaded', () => {
    emailjs.init(EMAILJS_CONFIG.PUBLIC_KEY);

    AOS.init();
    darkMode();
    cargarHabilidades();
    cargarProyectos();

    const proyectosBtn = document.querySelector('#cargar-mas-proyectos');
    const contactoForm = document.querySelector('.contacto__formulario');

    proyectosBtn.addEventListener('click', function(){
        window.location.href = "../proyectos.html";
    });

    contactoForm.addEventListener('submit', function(event) {
        event.preventDefault(); 
        enviarCorreo(contactoForm);
    });

});

const esperar = (ms) => new Promise(resolve => setTimeout(resolve, ms));

async function enviarCorreo(contactoForm){
    const boton = contactoForm.querySelector('button[type="submit"]')
    
    if(contactoForm.checkValidity()){

        boton.textContent = 'Enviando...';

        emailjs.sendForm(EMAILJS_CONFIG.SERVICE_ID, EMAILJS_CONFIG.TEMPLATE_ID, contactoForm)
            .then(() => {

                success();
                contactoForm.reset(); 
                boton.textContent = 'ENVIAR MENSAJE';

            }, (error) => {
                console.error('Fallo el envío:', error);
                boton.textContent = 'Error al enviar';
                setTimeout(() => {
                    boton.textContent = 'ENVIAR MENSAJE';
                }, 3000);
        });
    }else{
        contactoForm.reportValidity();
    }
    
}

async function success(){
    const success = document.querySelector('.success');

    success.classList.remove('hidden');
    success.focus();
    success.scrollIntoView({ 
        behavior: 'smooth', 
        block: 'center' 
    });

    await esperar(3000);

    success.classList.add('hidden')
}


async function cargarHabilidades() {
    try {
        const respuesta = await fetch('assets/data/data.json');
        const datos = await respuesta.json();

         renderizarCategoria(datos.habilidades.frontend, '.habilidades__frontend');
         renderizarCategoria(datos.habilidades.backend, '.habilidades__backend');
         renderizarCategoria(datos.habilidades.database, '.habilidades__database');

    } catch (error) {
        console.error('Error al cargar las habilidades:', error);
    }
}

function renderizarCategoria(lista, selectorContenedor) {
    const contenedor = document.querySelector(selectorContenedor);
    
    lista.forEach(hab => {

        const divHabilidad = document.createElement('DIV');
        divHabilidad.classList.add('habilidades__habilidad');

        divHabilidad.innerHTML = `
            <div class="habilidades__icon">
                <img src="${hab.icon}" alt="" aria-hidden="true">
            </div>
            <p>${hab.title}</p>
        `;

        contenedor.appendChild(divHabilidad);
    });
}

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

    const proyectosFiltrados = lista.filter(proyecto => proyecto.Order !== null && proyecto.Order !== undefined);
    proyectosFiltrados.sort((a, b) => a.Order - b.Order);

    const contenedor = document.querySelector(".proyectos__content");
    const botonCargarMas = document.getElementById("cargar-mas-proyectos");

    proyectosFiltrados.forEach(proyecto => {

        switch(proyecto.Order){
            case 1:
            case 2:

                var divProyecto = document.createElement('DIV');
                divProyecto.classList.add('proyectos__proyecto');

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

                break;
            case 3:
            case 4:

                var divProyecto = document.createElement('DIV');
                divProyecto.classList.add('proyectos__proyecto');
                divProyecto.classList.add('proyectos__proyecto--compressed');

                var tools = proyecto.Tools.map(tool => {
                    return `<img src="${tool.icon}" alt="${tool.title}">`;
                }).join('');

                divProyecto.innerHTML = `
                    <div class="proyectos__title">
                        <a href="${proyecto.LiveDemo}"
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label="Ver Live Demo del ${proyecto.title} (abre en una nueva pestaña)">
                            <h3>${proyecto.title}</h3></a>
                        
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
                `;

                contenedor.insertBefore(divProyecto, botonCargarMas);

                break;
        }
        
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