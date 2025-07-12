// Clase para manejar el formato de hora
class TimeFormatManager {
    constructor() {
        this.currentFormat = '24h';
        this.timeElement = document.getElementById('time');
        this.periodElement = document.getElementById('period');
        this.init();
    }
    
    init() {
        this.loadSettings();
        this.applyFormat();
    }
    
    loadSettings() {
        const savedSettings = localStorage.getItem('relojSettings');
        if (savedSettings) {
            try {
                const settings = JSON.parse(savedSettings);
                this.currentFormat = settings.timeFormat || '24h';
            } catch (error) {
                console.error('Error al cargar formato de hora:', error);
            }
        }
    }
    
    applyFormat() {
        // Aplicar el formato actual
        if (this.currentFormat === '12h') {
            this.enable12HourFormat();
        } else {
            this.enable24HourFormat();
        }
    }
    
    enable12HourFormat() {
        this.currentFormat = '12h';
        if (this.periodElement) {
            this.periodElement.style.display = 'block';
        }
        console.log('Formato de 12 horas activado');
    }
    
    enable24HourFormat() {
        this.currentFormat = '24h';
        if (this.periodElement) {
            this.periodElement.style.display = 'none';
        }
        console.log('Formato de 24 horas activado');
    }
    
    formatTime(hours, minutes, seconds) {
        if (this.currentFormat === '12h') {
            return this.format12Hour(hours, minutes, seconds);
        } else {
            return this.format24Hour(hours, minutes, seconds);
        }
    }
    
    format12Hour(hours, minutes, seconds) {
        const period = hours >= 12 ? 'PM' : 'AM';
        const displayHours = hours === 0 ? 12 : hours > 12 ? hours - 12 : hours;
        
        const formattedTime = `${this.padZero(displayHours)}:${this.padZero(minutes)}:${this.padZero(seconds)}`;
        
        // Actualizar el indicador AM/PM
        if (this.periodElement) {
            this.periodElement.textContent = period;
        }
        
        return formattedTime;
    }
    
    format24Hour(hours, minutes, seconds) {
        return `${this.padZero(hours)}:${this.padZero(minutes)}:${this.padZero(seconds)}`;
    }
    
    padZero(num) {
        return num.toString().padStart(2, '0');
    }
    
    updateTimeDisplay(hours, minutes, seconds) {
        if (this.timeElement) {
            this.timeElement.textContent = this.formatTime(hours, minutes, seconds);
        }
    }
    
    getCurrentFormat() {
        return this.currentFormat;
    }
    
    setFormat(format) {
        if (format === '12h' || format === '24h') {
            this.currentFormat = format;
            this.applyFormat();
            this.saveSettings();
            console.log(`Formato cambiado a: ${format}`);
        }
    }
    
    saveSettings() {
        const savedSettings = localStorage.getItem('relojSettings');
        let settings = {};
        
        if (savedSettings) {
            try {
                settings = JSON.parse(savedSettings);
            } catch (error) {
                console.error('Error al cargar configuración existente:', error);
            }
        }
        
        settings.timeFormat = this.currentFormat;
        localStorage.setItem('relojSettings', JSON.stringify(settings));
    }
}

// Función para inicializar el formato de hora
function initTimeFormat() {
    window.timeFormatManager = new TimeFormatManager();
    console.log('Gestor de formato de hora inicializado');
}

// Inicializar cuando el DOM esté listo
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initTimeFormat);
} else {
    initTimeFormat();
} 