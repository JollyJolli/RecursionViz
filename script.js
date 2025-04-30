document.addEventListener('DOMContentLoaded', () => {
    const numberInput = document.getElementById('number');
    const visualizeButton = document.getElementById('visualize');
    const stackContainer = document.getElementById('stack');
    const resultContainer = document.getElementById('result');
    let animationSpeed = 500; // Velocidad de animación predeterminada

    // Crear control de velocidad
    const speedControl = document.createElement('div');
    speedControl.className = 'speed-control';
    speedControl.innerHTML = `
        <label for="speed">Velocidad de Animación:</label>
        <input type="range" id="speed" min="100" max="1000" step="100" value="500">
        <span class="speed-value">Normal</span>
    `;
    document.querySelector('.input-section').appendChild(speedControl);

    // Actualizar velocidad de animación
    const speedInput = document.getElementById('speed');
    const speedValue = speedControl.querySelector('.speed-value');
    speedInput.addEventListener('input', () => {
        animationSpeed = parseInt(speedInput.value);
        const speed = animationSpeed === 500 ? 'Normal' : 
                     animationSpeed < 500 ? 'Rápida' : 'Lenta';
        speedValue.textContent = speed;
    });

    // Limitar el input a números entre 1 y 10
    numberInput.addEventListener('input', () => {
        const value = parseInt(numberInput.value);
        if (value < 1) numberInput.value = 1;
        if (value > 10) numberInput.value = 10;
    });

    visualizeButton.addEventListener('click', async () => {
        // Limpiar visualizaciones anteriores
        stackContainer.innerHTML = '';
        resultContainer.innerHTML = '';
        resultContainer.classList.remove('show');

        const number = parseInt(numberInput.value);
        await visualizeFactorial(number);
    });

    async function visualizeFactorial(n) {
        // Deshabilitar el botón durante la animación
        visualizeButton.disabled = true;

        // Array para almacenar los elementos de la pila
        const stackItems = [];

        // Función recursiva que construye la pila
        async function factorial(n) {
            // Crear elemento de la pila
            const stackItem = document.createElement('div');
            stackItem.className = 'stack-item';
            stackItem.textContent = `factorial(${n})`;
            stackContainer.appendChild(stackItem);
            stackItems.push(stackItem);

            // Esperar un momento antes de mostrar el elemento
            await new Promise(resolve => setTimeout(resolve, animationSpeed));
            stackItem.classList.add('active');
            stackItem.style.backgroundColor = `rgba(30, 30, 46, ${0.9 - (n * 0.1)})`; // Efecto de profundidad

            // Caso base
            if (n <= 1) {
                await new Promise(resolve => setTimeout(resolve, animationSpeed));
                stackItem.classList.add('resolving');
                stackItem.style.transform = 'scale(1.05)';
                await new Promise(resolve => setTimeout(resolve, 100));
                stackItem.style.transform = 'scale(1)';
                return 1;
            }

            // Llamada recursiva
            const result = n * await factorial(n - 1);

            // Marcar como resuelto
            await new Promise(resolve => setTimeout(resolve, animationSpeed));
            stackItem.classList.add('resolving');
            stackItem.style.transform = 'scale(1.05)';
            await new Promise(resolve => setTimeout(resolve, 100));
            stackItem.style.transform = 'scale(1)';
            stackItem.innerHTML = `
                <span class="factorial-expression">factorial(${n})</span>
                <span class="factorial-equals">=</span>
                <span class="factorial-result">${result}</span>
            `;

            return result;
        }

        // Ejecutar el factorial y mostrar el resultado
        const result = await factorial(n);
        
        // Mostrar el resultado final
        resultContainer.textContent = `El factorial de ${n} es ${result}`;
        resultContainer.classList.add('show');

        // Habilitar el botón nuevamente
        visualizeButton.disabled = false;

        // Animar la eliminación de los elementos de la pila
        for (const item of stackItems.reverse()) {
            await new Promise(resolve => setTimeout(resolve, 300));
            item.style.opacity = '0';
            item.style.transform = 'translateX(20px)';
            await new Promise(resolve => setTimeout(resolve, 300));
            item.remove();
        }
    }
});