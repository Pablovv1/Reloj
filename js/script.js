// Clase principal del reloj moderno
class ModernClock {
    constructor() {
        this.timeElement = document.getElementById('time');
        this.dateElement = document.getElementById('date');
        this.periodElement = document.getElementById('period');
        this.timezoneElement = document.getElementById('timezone');
        this.hourHand = document.getElementById('hour-hand');
        this.minuteHand = document.getElementById('minute-hand');
        this.secondHand = document.getElementById('second-hand');
        
        this.days = [
            'Domingo', 'Lunes', 'Martes', 'Miércoles', 
            'Jueves', 'Viernes', 'Sábado'
        ];
        
        this.months = [
            'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
            'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
        ];
        
        this.init();
    }
    
    init() {
        this.updateClock();
        this.updateTimezone();
        
        // Actualizar cada segundo
        setInterval(() => {
            this.updateClock();
        }, 1000);
        
        // Actualizar zona horaria cada minuto
        setInterval(() => {
            this.updateTimezone();
        }, 60000);
    }
    
    updateClock() {
        const now = new Date();
        
        // Actualizar tiempo digital
        this.updateDigitalTime(now);
        
        // Actualizar fecha
        this.updateDate(now);
        
        // Actualizar reloj analógico
        this.updateAnalogClock(now);
        
        // Actualizar período (AM/PM)
        this.updatePeriod(now);
    }
    
    updateDigitalTime(date) {
        const hours = date.getHours();
        const minutes = date.getMinutes();
        const seconds = date.getSeconds();
        
        // Usar el gestor de formato de hora si está disponible
        if (window.timeFormatManager) {
            window.timeFormatManager.updateTimeDisplay(hours, minutes, seconds);
        } else {
            // Fallback al formato original
            const formattedHours = this.padZero(hours);
            const formattedMinutes = this.padZero(minutes);
            const formattedSeconds = this.padZero(seconds);
            this.timeElement.textContent = `${formattedHours}:${formattedMinutes}:${formattedSeconds}`;
        }
    }
    
    updateDate(date) {
        const dayName = this.days[date.getDay()];
        const day = date.getDate();
        const month = this.months[date.getMonth()];
        const year = date.getFullYear();
        
        this.dateElement.textContent = `${dayName}, ${day} de ${month} de ${year}`;
    }
    
    updateAnalogClock(date) {
        const hours = date.getHours() % 12;
        const minutes = date.getMinutes();
        const seconds = date.getSeconds();
        const milliseconds = date.getMilliseconds();
        
        // Calcular ángulos con movimiento suave
        const secondAngle = (seconds * 6) + (milliseconds * 0.006);
        const minuteAngle = (minutes * 6) + (seconds * 0.1);
        const hourAngle = (hours * 30) + (minutes * 0.5);
        
        // Aplicar transformaciones con transiciones suaves
        this.secondHand.style.transform = `rotate(${secondAngle}deg)`;
        this.minuteHand.style.transform = `rotate(${minuteAngle}deg)`;
        this.hourHand.style.transform = `rotate(${hourAngle}deg)`;
    }
    
    updatePeriod(date) {
        const period = date.getHours() >= 12 ? 'PM' : 'AM';
        this.periodElement.textContent = period;
        
        // Cambiar color del período según AM/PM con transición suave
        if (period === 'AM') {
            this.periodElement.style.background = 'rgba(255, 255, 255, 0.15)';
        } else {
            this.periodElement.style.background = 'rgba(255, 107, 107, 0.2)';
        }
    }
    
    updateTimezone() {
        try {
            const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
            const timezoneName = this.formatTimezoneName(timezone);
            this.timezoneElement.textContent = timezoneName;
        } catch (error) {
            this.timezoneElement.textContent = 'Zona Horaria Local';
        }
    }
    
    formatTimezoneName(timezone) {
        // Mapear nombres de zonas horarias comunes a español
        const timezoneMap = {
            'America/Mexico_City': 'Ciudad de México',
            'America/New_York': 'Nueva York',
            'America/Los_Angeles': 'Los Ángeles',
            'America/Chicago': 'Chicago',
            'America/Denver': 'Denver',
            'Europe/Madrid': 'Madrid',
            'Europe/London': 'Londres',
            'Europe/Paris': 'París',
            'Europe/Berlin': 'Berlín',
            'Asia/Tokyo': 'Tokio',
            'Asia/Shanghai': 'Shanghái',
            'Australia/Sydney': 'Sídney',
            'Pacific/Auckland': 'Auckland'
        };
        
        return timezoneMap[timezone] || timezone.replace('_', ' ');
    }
    
    padZero(num) {
        return num.toString().padStart(2, '0');
    }
}

// Clase para manejar la navegación del menú
class MenuNavigation {
    constructor() {
        this.menuItems = document.querySelectorAll('.menu-item');
        this.sections = document.querySelectorAll('.section-content');
        this.currentSection = 'reloj';
        this.init();
    }
    
    init() {
        this.addEventListeners();
        this.showSection('reloj'); // Mostrar reloj por defecto
    }
    
    addEventListeners() {
        this.menuItems.forEach(item => {
            item.addEventListener('click', (e) => {
                const section = e.currentTarget.dataset.section;
                this.switchSection(section);
            });
        });
    }
    
    switchSection(section) {
        // Remover clase active de todos los elementos
        this.menuItems.forEach(item => {
            item.classList.remove('active');
        });
        
        // Agregar clase active al elemento seleccionado
        const activeItem = document.querySelector(`[data-section="${section}"]`);
        if (activeItem) {
            activeItem.classList.add('active');
        }
        
        this.currentSection = section;
        this.showSection(section);
        this.handleSectionChange(section);
    }
    
    showSection(section) {
        // Ocultar todas las secciones
        this.sections.forEach(sectionEl => {
            sectionEl.style.display = 'none';
        });
        
        // Mostrar la sección seleccionada
        const targetSection = document.getElementById(`${section}-section`);
        if (targetSection) {
            targetSection.style.display = 'block';
        }
    }
    
    handleSectionChange(section) {
        // Aquí puedes agregar la lógica para cambiar el contenido
        console.log(`Cambiando a sección: ${section}`);
        
        // Ejemplo de cómo manejar diferentes secciones
        switch(section) {
            case 'alarma':
                this.showAlarmSection();
                break;
            case 'temporizador':
                this.showTimerSection();
                break;
            case 'cronometro':
                this.showStopwatchSection();
                break;
            case 'reloj':
                this.showClockSection();
                break;
        }
    }
    
    showAlarmSection() {
        console.log('Sección de Alarma - Inicializando...');
        if (typeof initAlarmSection === 'function') {
            initAlarmSection();
        }
    }
    
    showTimerSection() {
        console.log('Sección de Temporizador - Inicializando...');
        if (typeof initTimerSection === 'function') {
            initTimerSection();
        }
    }
    
    showStopwatchSection() {
        console.log('Sección de Cronómetro - Inicializando...');
        if (typeof initStopwatchSection === 'function') {
            initStopwatchSection();
        }
    }
    
    showClockSection() {
        console.log('Sección de Reloj - Activa');
    }
}

// Clase para manejar la configuración
class SettingsManager {
    constructor() {
        this.settingsBtn = document.getElementById('settingsBtn');
        this.init();
    }
    
    init() {
        this.addEventListeners();
    }
    
    addEventListeners() {
        this.settingsBtn.addEventListener('click', (e) => {
            console.log('Botón de configuración clickeado');
            this.openSettings();
        });
        
        // Efecto de pulsación
        this.settingsBtn.addEventListener('mousedown', (e) => {
            this.settingsBtn.style.transform = 'translateY(0) scale(0.95)';
        });
        
        this.settingsBtn.addEventListener('mouseup', (e) => {
            this.settingsBtn.style.transform = 'translateY(-2px) scale(1)';
        });
        
        this.settingsBtn.addEventListener('mouseleave', (e) => {
            this.settingsBtn.style.transform = 'translateY(0) scale(1)';
        });
    }
    
    openSettings() {
        // Efecto visual de clic
        this.settingsBtn.style.transform = 'translateY(0) scale(0.9)';
        setTimeout(() => {
            this.settingsBtn.style.transform = 'translateY(-2px) scale(1)';
        }, 150);
        
        // Mostrar opciones de configuración
        this.showSettingsOptions();
    }
    
    showSettingsOptions() {
        console.log('Función showSettingsOptions ejecutada');
        
        // Abrir el modal de configuración directamente
        const configModal = document.getElementById('configModal');
        console.log('configModal encontrado:', configModal);
        
        if (configModal) {
            configModal.style.display = 'flex';
            document.body.style.overflow = 'hidden';
            console.log('Modal de configuración abierto exitosamente');
        } else {
            console.log('Modal de configuración no encontrado');
        }
    }
    

}

// Efectos visuales minimalistas
class ClockEffects {
    constructor() {
        this.clockCard = document.querySelector('.clock-card');
        this.centerDot = document.querySelector('.center-dot');
        this.initEffects();
    }
    
    initEffects() {
        // Efecto de pulso sutil en el punto central
        this.addPulseEffect();
        
        // Efecto de brillo en hover
        this.addHoverEffects();
    }
    
    addPulseEffect() {
        // Pulso sutil cada 2 segundos
        setInterval(() => {
            this.centerDot.style.transform = 'scale(1.1)';
            setTimeout(() => {
                this.centerDot.style.transform = 'scale(1)';
            }, 300);
        }, 2000);
    }
    
    addHoverEffects() {
        this.clockCard.addEventListener('mouseenter', () => {
            this.clockCard.style.transform = 'translateY(-4px) scale(1.01)';
        });
        
        this.clockCard.addEventListener('mouseleave', () => {
            this.clockCard.style.transform = 'translateY(0) scale(1)';
        });
    }
}

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    const clock = new ModernClock();
    const menuNavigation = new MenuNavigation();
    const settingsManager = new SettingsManager();
    const effects = new ClockEffects();
    
    // Efecto de carga inicial suave
    document.body.style.opacity = '0';
    document.body.style.transition = 'opacity 0.6s ease-in-out';
    
    setTimeout(() => {
        document.body.style.opacity = '1';
    }, 100);
});

// Detectar cambios en el tema del sistema
const darkModeMediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

darkModeMediaQuery.addEventListener('change', (e) => {
    console.log('Tema del sistema cambiado:', e.matches ? 'oscuro' : 'claro');
});

// Optimización de rendimiento
let animationFrameId;

function smoothUpdate() {
    // Usar requestAnimationFrame para animaciones suaves
    animationFrameId = requestAnimationFrame(smoothUpdate);
}

// Pausar animaciones cuando la pestaña no está visible
document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        cancelAnimationFrame(animationFrameId);
    } else {
        smoothUpdate();
    }
});

// Iniciar animaciones suaves
smoothUpdate(); 