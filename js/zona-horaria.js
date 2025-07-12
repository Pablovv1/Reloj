// Clase para manejar zonas horarias globales usando API
class TimezoneManager {
    constructor() {
        this.currentTimezone = 'local';
        this.timeElement = document.getElementById('time');
        this.dateElement = document.getElementById('date');
        this.timezoneElement = document.getElementById('timezone');
        this.availableTimezones = [];
        this.timezoneData = null;
        this.apiBaseUrl = 'https://timezoneapi.io/api/timezone';
        this.apiKey = ''; // No necesitamos API key para la versión gratuita
        this.apiEnabled = false; // Deshabilitar API por defecto
        this.init();
    }
    
    init() {
        this.loadSettings();
        this.loadDefaultTimezones(); // Usar zonas por defecto inmediatamente
        this.applyTimezone();
    }
    
    loadSettings() {
        const savedSettings = localStorage.getItem('relojSettings');
        if (savedSettings) {
            try {
                const settings = JSON.parse(savedSettings);
                this.currentTimezone = settings.timezone || 'local';
            } catch (error) {
                console.error('Error al cargar zona horaria:', error);
            }
        }
    }
    
    async loadAvailableTimezones() {
        // Por ahora, usar solo zonas horarias por defecto para evitar problemas de CORS
        this.loadDefaultTimezones();
        
        // Comentado temporalmente hasta encontrar una API más confiable
        /*
        try {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 3000);
            
            const response = await fetch(`${this.apiBaseUrl}/list`, {
                signal: controller.signal,
                mode: 'cors',
                headers: {
                    'Accept': 'application/json'
                }
            });
            
            clearTimeout(timeoutId);
            
            if (response.ok) {
                const data = await response.json();
                this.availableTimezones = data.timezones || [];
                this.apiEnabled = true;
                console.log('Zonas horarias cargadas desde API:', this.availableTimezones.length);
            } else {
                console.warn('API respondió con error, usando zonas horarias por defecto');
                this.loadDefaultTimezones();
            }
        } catch (error) {
            console.warn('No se pudo conectar con la API de zonas horarias, usando configuración local:', error.message);
            this.loadDefaultTimezones();
        }
        */
    }
    
    loadDefaultTimezones() {
        // Zonas horarias por defecto si la API falla
        this.availableTimezones = [
            'local',
            'America/New_York',
            'America/Los_Angeles', 
            'America/Mexico_City',
            'America/Buenos_Aires',
            'America/Sao_Paulo',
            'Europe/Madrid',
            'Europe/London',
            'Europe/Paris',
            'Europe/Berlin',
            'Europe/Rome',
            'Asia/Tokyo',
            'Asia/Shanghai',
            'Asia/Seoul',
            'Asia/Dubai',
            'Australia/Sydney',
            'Pacific/Auckland'
        ];
        console.log('Usando zonas horarias por defecto:', this.availableTimezones.length);
    }
    
    async getTimezoneData(timezone) {
        if (timezone === 'local') {
            return this.getLocalTimezoneData();
        }
        
        // Usar simulación local para todas las zonas horarias
        return this.getSimulatedTimezoneData(timezone);
        
        // Comentado temporalmente hasta encontrar una API más confiable
        /*
        try {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 3000);
            
            const response = await fetch(`${this.apiBaseUrl}/${timezone}`, {
                signal: controller.signal,
                mode: 'cors',
                headers: {
                    'Accept': 'application/json'
                }
            });
            
            clearTimeout(timeoutId);
            
            if (response.ok) {
                const data = await response.json();
                return {
                    datetime: data.datetime,
                    timezone: data.timezone,
                    utc_offset: data.utc_offset,
                    day_of_week: data.day_of_week,
                    day_of_year: data.day_of_year,
                    week_number: data.week_number
                };
            } else {
                console.warn(`Error al obtener datos de zona horaria: ${timezone}, usando simulación local`);
                return this.getSimulatedTimezoneData(timezone);
            }
        } catch (error) {
            console.warn(`Error de red al obtener zona horaria ${timezone}, usando simulación local:`, error.message);
            return this.getSimulatedTimezoneData(timezone);
        }
        */
    }
    
    getLocalTimezoneData() {
        const now = new Date();
        const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
        const utcOffset = -now.getTimezoneOffset() / 60;
        
        return {
            datetime: now.toISOString(),
            timezone: timezone,
            utc_offset: `${utcOffset >= 0 ? '+' : ''}${utcOffset.toString().padStart(2, '0')}:00`,
            day_of_week: now.getDay(),
            day_of_year: Math.floor((now - new Date(now.getFullYear(), 0, 0)) / (1000 * 60 * 60 * 24)),
            week_number: this.getWeekNumber(now)
        };
    }
    
    // Método para simular zonas horarias cuando la API no está disponible
    getSimulatedTimezoneData(timezone) {
        const now = new Date();
        const timezoneOffsets = {
            'America/New_York': -5,
            'America/Los_Angeles': -8,
            'America/Mexico_City': -6,
            'America/Buenos_Aires': -3,
            'America/Sao_Paulo': -3,
            'Europe/Madrid': 1,
            'Europe/London': 0,
            'Europe/Paris': 1,
            'Europe/Berlin': 1,
            'Europe/Rome': 1,
            'Asia/Tokyo': 9,
            'Asia/Shanghai': 8,
            'Asia/Seoul': 9,
            'Asia/Dubai': 4,
            'Australia/Sydney': 10,
            'Pacific/Auckland': 12
        };
        
        const offset = timezoneOffsets[timezone] || 0;
        
        // Crear fecha con el offset de zona horaria
        const utcTime = now.getTime() + (offset * 60 * 60 * 1000);
        const timezoneDate = new Date(utcTime);
        
        // Calcular offset UTC formateado
        const utcOffsetFormatted = `${offset >= 0 ? '+' : ''}${offset.toString().padStart(2, '0')}:00`;
        
        return {
            datetime: timezoneDate.toISOString(),
            timezone: timezone,
            utc_offset: utcOffsetFormatted,
            day_of_week: timezoneDate.getDay(),
            day_of_year: Math.floor((timezoneDate - new Date(timezoneDate.getFullYear(), 0, 0)) / (1000 * 60 * 60 * 24)),
            week_number: this.getWeekNumber(timezoneDate)
        };
    }
    
    getWeekNumber(date) {
        const firstDayOfYear = new Date(date.getFullYear(), 0, 1);
        const pastDaysOfYear = (date - firstDayOfYear) / 86400000;
        return Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7);
    }
    
    async setTimezone(timezone) {
        if (timezone === this.currentTimezone) {
            return;
        }
        
        this.currentTimezone = timezone;
        this.timezoneData = await this.getTimezoneData(timezone);
        this.applyTimezone();
        this.saveSettings();
        
        console.log(`Zona horaria cambiada a: ${timezone}`);
        
        // Disparar evento personalizado
        window.dispatchEvent(new CustomEvent('timezoneChanged', {
            detail: { timezone, data: this.timezoneData }
        }));
    }
    
    applyTimezone() {
        if (this.currentTimezone === 'local') {
            this.timezoneData = this.getLocalTimezoneData();
        }
        
        this.updateDisplay();
    }
    
    updateDisplay() {
        if (!this.timezoneData) {
            return;
        }
        
        const date = new Date(this.timezoneData.datetime);
        
        // Actualizar hora
        if (this.timeElement) {
            const hours = date.getHours();
            const minutes = date.getMinutes();
            const seconds = date.getSeconds();
            
            // Usar el gestor de formato de hora si está disponible
            if (window.timeFormatManager && typeof window.timeFormatManager.updateTimeDisplay === 'function') {
                window.timeFormatManager.updateTimeDisplay(hours, minutes, seconds);
            } else {
                const timeString = `${this.padZero(hours)}:${this.padZero(minutes)}:${this.padZero(seconds)}`;
                this.timeElement.textContent = timeString;
            }
        }
        
        // Actualizar fecha
        if (this.dateElement) {
            const options = { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
            };
            const dateString = date.toLocaleDateString('es-ES', options);
            this.dateElement.textContent = dateString;
        }
        
        // Actualizar indicador de zona horaria
        if (this.timezoneElement) {
            const timezoneName = this.getTimezoneDisplayName(this.timezoneData.timezone);
            const offset = this.timezoneData.utc_offset;
            this.timezoneElement.textContent = `${timezoneName} (UTC${offset})`;
        }
    }
    
    getTimezoneDisplayName(timezone) {
        if (timezone === 'local') {
            return 'Hora Local';
        }
        
        const names = {
            'America/New_York': 'Nueva York',
            'America/Los_Angeles': 'Los Ángeles',
            'America/Mexico_City': 'Ciudad de México',
            'Europe/Madrid': 'Madrid',
            'Europe/London': 'Londres',
            'Europe/Paris': 'París',
            'Asia/Tokyo': 'Tokio',
            'Asia/Shanghai': 'Shanghái',
            'Australia/Sydney': 'Sídney',
            'Pacific/Auckland': 'Auckland'
        };
        
        return names[timezone] || timezone.split('/').pop().replace('_', ' ');
    }
    
    padZero(num) {
        return num.toString().padStart(2, '0');
    }
    
    getAvailableTimezones() {
        return this.availableTimezones.map(tz => ({
            value: tz,
            label: this.getTimezoneDisplayName(tz)
        }));
    }
    
    getCurrentTimezone() {
        return this.currentTimezone;
    }
    
    getCurrentTimezoneData() {
        return this.timezoneData;
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
        
        settings.timezone = this.currentTimezone;
        localStorage.setItem('relojSettings', JSON.stringify(settings));
    }
    
    // Método para actualizar la hora cada segundo
    startClock() {
        setInterval(() => {
            // Actualizar datos de zona horaria cada segundo
            if (this.currentTimezone === 'local') {
                this.timezoneData = this.getLocalTimezoneData();
            } else {
                this.timezoneData = this.getSimulatedTimezoneData(this.currentTimezone);
            }
            
            this.updateDisplay();
        }, 1000);
    }
    
    async updateTimezoneData() {
        if (this.currentTimezone !== 'local') {
            this.timezoneData = await this.getTimezoneData(this.currentTimezone);
        }
    }
}

// Función para inicializar el gestor de zona horaria
function initTimezone() {
    window.timezoneManager = new TimezoneManager();
    
    // Iniciar el reloj
    window.timezoneManager.startClock();
    
    console.log('Gestor de zona horaria inicializado');
}

// Inicializar cuando el DOM esté listo
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initTimezone);
} else {
    initTimezone();
} 