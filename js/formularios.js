// Manejo del formulario de reservas con Turnstile y Toast
const API_URL = 'https://apiesmaralda.up.railway.app/api'; // CAMBIAR EN PRODUCCIÓN por URL real de Railway

let turnstileWidgetId = null;
let isSubmitting = false;

function showToast(message, type = 'success', duration = 4000) {
    const toast = document.getElementById('toast');
    const toastMessage = document.getElementById('toast-message');
    const toastIcon = document.getElementById('toast-icon');
    
    if (!toast) {
        console.error('Toast no encontrado');
        alert(message);
        return;
    }
    
    toast.classList.remove('success', 'error', 'show');
    
    if (type === 'success') {
        toast.classList.add('success');
        toastIcon.className = 'fas fa-check-circle';
    } else {
        toast.classList.add('error');
        toastIcon.className = 'fas fa-exclamation-circle';
    }
    
    toastMessage.textContent = message;
    toast.classList.add('show');
    
    setTimeout(() => toast.classList.remove('show'), duration);
}

function initFormulario() {
    const form = document.getElementById('form-contacto');
    if (!form) {
        console.error('Formulario no encontrado');
        return;
    }

    // Renderizar Turnstile manualmente
    const captchaContainer = document.querySelector('.cf-turnstile');
    if (window.turnstile && captchaContainer) {
        turnstileWidgetId = turnstile.render(captchaContainer, {
            sitekey: '1x00000000000000000000AA', // Reemplazar con la clave real del cliente
            theme: 'dark'
        });
    }

    form.addEventListener('submit', async function (e) {
        e.preventDefault();

        if (isSubmitting) {
            showToast('⏳ Ya se está enviando...', 'error');
            return;
        }

        const turnstileToken = document.querySelector('[name="cf-turnstile-response"]')?.value;
        if (!turnstileToken) {
            showToast('Por favor, completa el captcha', 'error');
            return;
        }

        isSubmitting = true;
        const formData = new FormData(form);
        const data = Object.fromEntries(formData.entries());
        delete data['cf-turnstile-response'];
        data['cf_turnstile_response'] = turnstileToken;

        // Asegurar que cliente_id esté presente
        data.cliente_id = 'bunker69';

        try {
            const response = await fetch(`${API_URL}/reserva`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });

            const result = await response.json();

            if (response.ok) {
                showToast('¡Reserva enviada con éxito! Te contactaremos pronto.', 'success');
                form.reset();
                if (window.turnstile && turnstileWidgetId !== null) {
                    turnstile.reset(turnstileWidgetId);
                }
            } else {
                showToast('Error: ' + (result.error || 'No se pudo enviar'), 'error');
            }
        } catch (error) {
            showToast('Error de conexión. Intenta más tarde.', 'error');
        } finally {
            isSubmitting = false;
        }
    });
}

document.addEventListener('componentesCargados', initFormulario);