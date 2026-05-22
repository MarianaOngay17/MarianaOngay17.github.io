document.addEventListener('DOMContentLoaded', async function(){
    keyMovility();
});

function keyMovility(){
    document.addEventListener('keydown', (e) => {
        const keys = ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'];
        if (!keys.includes(e.key)) return;

        // elementos que pueden recibir foco
        const focusableSelector = 'button, [href], input, select, textarea, [tabindex="0"]';
        const focusables = Array.from(document.querySelectorAll(focusableSelector))
            .filter(el => !el.disabled && el.offsetParent !== null); 

        const currentIndex = focusables.indexOf(document.activeElement);

        if (currentIndex > -1) {
            e.preventDefault(); // Evitamos el scroll de la página
            let nextIndex;

            if (e.key === 'ArrowDown' || e.key === 'ArrowRight') {
                // Mover hacia adelante (con retorno al inicio)
                nextIndex = (currentIndex + 1) % focusables.length;
            } else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') {
                // Mover hacia atrás (con retorno al final)
                nextIndex = (currentIndex - 1 + focusables.length) % focusables.length;
            }

            // 3. Mover el foco al siguiente elemento
            focusables[nextIndex].focus();
        }
    });
}