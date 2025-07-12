// Clase para manejar las animaciones
class AnimationManager {
    constructor() {
        this.animationsEnabled = true;
        this.animationDuration = '0.3s';
        this.transitionDuration = '0.3s';
        this.init();
    }
    
    init() {
        this.loadSettings();
        this.applyAnimations();
        this.setupCSSVariables();
    }
    
    setupCSSVariables() {
        const root = document.documentElement;
        
        // Configurar variables CSS para animaciones
        root.style.setProperty('--animation-duration', this.animationDuration);
        root.style.setProperty('--transition-duration', this.transitionDuration);
        root.style.setProperty('--animation-enabled', '1');
        
        // Agregar estilos CSS dinámicamente para controlar animaciones
        if (!document.getElementById('animation-styles')) {
            const style = document.createElement('style');
            style.id = 'animation-styles';
            style.textContent = `
                .animations-disabled *,
                .animations-disabled *::before,
                .animations-disabled *::after {
                    transition: none !important;
                    animation: none !important;
                    animation-duration: 0s !important;
                    animation-delay: 0s !important;
                    animation-fill-mode: none !important;
                    animation-iteration-count: 1 !important;
                    animation-play-state: paused !important;
                    animation-timing-function: linear !important;
                    transform: none !important;
                }
                
                .animations-disabled .clock-card:hover {
                    transform: none !important;
                    box-shadow: var(--shadow-medium) !important;
                }
                
                .animations-disabled .menu-item:hover {
                    transform: none !important;
                }
                
                .animations-disabled .menu-item::before {
                    animation: none !important;
                }
                
                .animations-disabled .settings-btn:hover {
                    transform: none !important;
                }
                
                .animations-disabled .settings-btn::before {
                    animation: none !important;
                }
                
                .animations-disabled .config-card:hover {
                    transform: none !important;
                }
                
                .animations-disabled .config-group:hover {
                    transform: none !important;
                }
                
                .animations-disabled .config-btn:hover {
                    transform: none !important;
                }
                
                .animations-disabled .toggle-switch::before {
                    transition: none !important;
                }
                
                .animations-disabled .toggle-switch.active::before {
                    transform: translateX(28px) !important;
                }
                
                .animations-disabled .hand {
                    transition: none !important;
                }
                
                .animations-disabled .clock-card::before {
                    animation: none !important;
                }
                
                .animations-disabled body::before {
                    animation: none !important;
                }
                
                .animations-enabled * {
                    transition: all var(--transition-duration) ease !important;
                }
                
                .animations-enabled .clock-card:hover {
                    transform: translateY(-6px) !important;
                }
                
                .animations-enabled .menu-item:hover {
                    transform: translateX(6px) !important;
                }
                
                .animations-enabled .settings-btn:hover {
                    transform: translateY(-3px) !important;
                }
                
                .animations-enabled .config-card:hover {
                    transform: translateY(-2px) !important;
                }
                
                .animations-enabled .config-group:hover {
                    transform: translateY(-2px) !important;
                }
                
                .animations-enabled .config-btn:hover {
                    transform: translateY(-2px) !important;
                }
            `;
            document.head.appendChild(style);
        }
    }
    
    loadSettings() {
        const savedSettings = localStorage.getItem('relojSettings');
        if (savedSettings) {
            try {
                const settings = JSON.parse(savedSettings);
                this.animationsEnabled = settings.animations !== false; // Por defecto true
            } catch (error) {
                console.error('Error al cargar configuración de animaciones:', error);
            }
        }
    }
    
    applyAnimations() {
        const root = document.documentElement;
        
        if (this.animationsEnabled) {
            this.enableAnimations();
        } else {
            this.disableAnimations();
        }
        
        console.log('Animaciones:', this.animationsEnabled ? 'habilitadas' : 'deshabilitadas');
    }
    
    enableAnimations() {
        this.animationsEnabled = true;
        const root = document.documentElement;
        const body = document.body;
        
        // Habilitar animaciones CSS
        root.style.setProperty('--animation-duration', this.animationDuration);
        root.style.setProperty('--transition-duration', this.transitionDuration);
        root.style.setProperty('--animation-enabled', '1');
        
        // Agregar clase al body para habilitar animaciones
        body.classList.remove('animations-disabled');
        body.classList.add('animations-enabled');
        
        // Habilitar transiciones en elementos específicos
        this.enableElementAnimations();
    }
    
    disableAnimations() {
        this.animationsEnabled = false;
        const root = document.documentElement;
        const body = document.body;
        
        // Deshabilitar animaciones CSS
        root.style.setProperty('--animation-duration', '0s');
        root.style.setProperty('--transition-duration', '0s');
        root.style.setProperty('--animation-enabled', '0');
        
        // Agregar clase al body para deshabilitar animaciones
        body.classList.remove('animations-enabled');
        body.classList.add('animations-disabled');
        
        // Deshabilitar transiciones en elementos específicos
        this.disableElementAnimations();
        
        // Deshabilitar animaciones del fondo y otros elementos
        this.disableBackgroundAnimations();
    }
    
    disableBackgroundAnimations() {
        // Deshabilitar animaciones del fondo
        const body = document.body;
        
        if (body) {
            body.style.setProperty('--background-animation', 'none');
        }
        
        // Deshabilitar animaciones en elementos con keyframes
        const keyframeElements = document.querySelectorAll('*');
        keyframeElements.forEach(element => {
            const computedStyle = window.getComputedStyle(element);
            if (computedStyle.animationName !== 'none') {
                element.style.animation = 'none';
            }
        });
        
        // Detener todas las animaciones Web Animations API
        document.querySelectorAll('*').forEach(element => {
            if (element.getAnimations) {
                const animations = element.getAnimations();
                animations.forEach(animation => {
                    animation.cancel();
                });
            }
        });
    }
    
    enableElementAnimations() {
        // Remover estilos temporales de desactivación
        const tempStyle = document.getElementById('disable-animations-temp');
        if (tempStyle) {
            tempStyle.remove();
        }
        
        // Habilitar animaciones en elementos específicos
        const animatedElements = document.querySelectorAll('.clock-card, .menu-item, .settings-btn, .config-card, .config-group, .config-btn, .toggle-switch, .hand, .config-select, .config-range, .period, .time, .date, .timezone, .clock-circle, .center-dot, .marker');
        
        animatedElements.forEach(element => {
            element.style.transition = `all ${this.transitionDuration} ease`;
            element.style.animation = '';
            element.style.animationDuration = this.animationDuration;
            element.style.animationDelay = '';
            element.style.animationFillMode = '';
            element.style.animationIterationCount = '';
            element.style.animationPlayState = '';
            element.style.animationTimingFunction = '';
        });
    }
    
    disableElementAnimations() {
        // Deshabilitar animaciones en elementos específicos
        const animatedElements = document.querySelectorAll('.clock-card, .menu-item, .settings-btn, .config-card, .config-group, .config-btn, .toggle-switch, .hand, .config-select, .config-range, .period, .time, .date, .timezone, .clock-circle, .center-dot, .marker');
        
        animatedElements.forEach(element => {
            element.style.transition = 'none';
            element.style.animation = 'none';
            element.style.animationDuration = '0s';
            element.style.animationDelay = '0s';
            element.style.animationFillMode = 'none';
            element.style.animationIterationCount = '1';
            element.style.animationPlayState = 'paused';
            element.style.animationTimingFunction = 'linear';
        });
        
        // Deshabilitar animaciones en pseudo-elementos
        const style = document.createElement('style');
        style.id = 'disable-animations-temp';
        style.textContent = `
            .clock-card::before,
            .menu-item::before,
            .settings-btn::before,
            .config-card::before,
            .config-group::before,
            .config-btn::before,
            .toggle-switch::before,
            .period::before,
            .time::before,
            .date::before,
            .timezone::before,
            .clock-circle::before,
            .center-dot::before,
            .marker::before {
                animation: none !important;
                transition: none !important;
            }
        `;
        document.head.appendChild(style);
    }
    
    // Animaciones específicas
    animateElement(element, animationType, duration = null) {
        if (!this.animationsEnabled) return;
        
        const animDuration = duration || this.animationDuration;
        
        switch (animationType) {
            case 'fadeIn':
                this.fadeIn(element, animDuration);
                break;
            case 'fadeOut':
                this.fadeOut(element, animDuration);
                break;
            case 'slideIn':
                this.slideIn(element, animDuration);
                break;
            case 'slideOut':
                this.slideOut(element, animDuration);
                break;
            case 'scaleIn':
                this.scaleIn(element, animDuration);
                break;
            case 'scaleOut':
                this.scaleOut(element, animDuration);
                break;
            case 'pulse':
                this.pulse(element, animDuration);
                break;
            case 'shake':
                this.shake(element, animDuration);
                break;
        }
    }
    
    fadeIn(element, duration) {
        element.style.opacity = '0';
        element.style.transition = `opacity ${duration} ease`;
        
        setTimeout(() => {
            element.style.opacity = '1';
        }, 10);
    }
    
    fadeOut(element, duration) {
        element.style.transition = `opacity ${duration} ease`;
        element.style.opacity = '0';
    }
    
    slideIn(element, duration) {
        element.style.transform = 'translateX(-20px)';
        element.style.opacity = '0';
        element.style.transition = `all ${duration} ease`;
        
        setTimeout(() => {
            element.style.transform = 'translateX(0)';
            element.style.opacity = '1';
        }, 10);
    }
    
    slideOut(element, duration) {
        element.style.transition = `all ${duration} ease`;
        element.style.transform = 'translateX(20px)';
        element.style.opacity = '0';
    }
    
    scaleIn(element, duration) {
        element.style.transform = 'scale(0.9)';
        element.style.opacity = '0';
        element.style.transition = `all ${duration} ease`;
        
        setTimeout(() => {
            element.style.transform = 'scale(1)';
            element.style.opacity = '1';
        }, 10);
    }
    
    scaleOut(element, duration) {
        element.style.transition = `all ${duration} ease`;
        element.style.transform = 'scale(0.9)';
        element.style.opacity = '0';
    }
    
    pulse(element, duration) {
        const originalTransform = element.style.transform;
        element.style.transition = `transform ${duration} ease`;
        element.style.transform = 'scale(1.05)';
        
        setTimeout(() => {
            element.style.transform = originalTransform;
        }, parseInt(duration) * 1000);
    }
    
    shake(element, duration) {
        const originalTransform = element.style.transform;
        element.style.transition = `transform ${duration} ease`;
        
        const shakeKeyframes = [
            { transform: 'translateX(0)' },
            { transform: 'translateX(-5px)' },
            { transform: 'translateX(5px)' },
            { transform: 'translateX(-5px)' },
            { transform: 'translateX(5px)' },
            { transform: 'translateX(0)' }
        ];
        
        element.animate(shakeKeyframes, {
            duration: parseInt(duration) * 1000,
            easing: 'ease-in-out'
        });
        
        setTimeout(() => {
            element.style.transform = originalTransform;
        }, parseInt(duration) * 1000);
    }
    
    // Animaciones para el reloj
    animateClockHands() {
        if (!this.animationsEnabled) return;
        
        const hands = document.querySelectorAll('.hand');
        hands.forEach(hand => {
            hand.style.transition = `transform ${this.transitionDuration} ease`;
        });
    }
    
    // Animaciones para el menú
    animateMenuItems() {
        if (!this.animationsEnabled) return;
        
        const menuItems = document.querySelectorAll('.menu-item');
        menuItems.forEach((item, index) => {
            item.style.animationDelay = `${index * 0.1}s`;
            item.style.animationDuration = this.animationDuration;
        });
    }
    
    // Animaciones para botones
    animateButton(button, type = 'click') {
        if (!this.animationsEnabled) return;
        
        switch (type) {
            case 'click':
                this.pulse(button, '0.1s');
                break;
            case 'hover':
                button.style.transition = `all ${this.transitionDuration} ease`;
                break;
        }
    }
    
    // Animaciones para notificaciones
    animateNotification(element) {
        if (!this.animationsEnabled) return;
        
        this.slideIn(element, '0.3s');
    }
    
    // Animaciones para el modal
    animateModal(modal, type = 'open') {
        if (!this.animationsEnabled) return;
        
        switch (type) {
            case 'open':
                this.scaleIn(modal, '0.3s');
                break;
            case 'close':
                this.scaleOut(modal, '0.3s');
                break;
        }
    }
    
    // Métodos de control
    enableAnimations() {
        this.animationsEnabled = true;
        const root = document.documentElement;
        const body = document.body;
        
        // Habilitar animaciones CSS
        root.style.setProperty('--animation-duration', this.animationDuration);
        root.style.setProperty('--transition-duration', this.transitionDuration);
        root.style.setProperty('--animation-enabled', '1');
        
        // Agregar clase al body para habilitar animaciones
        body.classList.remove('animations-disabled');
        body.classList.add('animations-enabled');
        
        // Habilitar transiciones en elementos específicos
        this.enableElementAnimations();
    }
    
    disableAnimations() {
        this.animationsEnabled = false;
        const root = document.documentElement;
        const body = document.body;
        
        // Deshabilitar animaciones CSS
        root.style.setProperty('--animation-duration', '0s');
        root.style.setProperty('--transition-duration', '0s');
        root.style.setProperty('--animation-enabled', '0');
        
        // Agregar clase al body para deshabilitar animaciones
        body.classList.remove('animations-enabled');
        body.classList.add('animations-disabled');
        
        // Deshabilitar transiciones en elementos específicos
        this.disableElementAnimations();
        
        // Deshabilitar animaciones del fondo y otros elementos
        this.disableBackgroundAnimations();
    }
    
    toggleAnimations() {
        this.animationsEnabled = !this.animationsEnabled;
        if (this.animationsEnabled) {
            this.enableAnimations();
        } else {
            this.disableAnimations();
        }
        return this.animationsEnabled;
    }
    
    isEnabled() {
        return this.animationsEnabled;
    }
    
    setAnimationDuration(duration) {
        this.animationDuration = duration;
        this.transitionDuration = duration;
        
        // Aplicar directamente sin llamar a applyAnimations
        if (this.animationsEnabled) {
            const root = document.documentElement;
            root.style.setProperty('--animation-duration', this.animationDuration);
            root.style.setProperty('--transition-duration', this.transitionDuration);
        }
    }
}

// Función para inicializar las animaciones
function initAnimations() {
    window.animationManager = new AnimationManager();
    console.log('Gestor de animaciones inicializado');
}

// Inicializar cuando el DOM esté listo
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAnimations);
} else {
    initAnimations();
} 