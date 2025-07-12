// Clase para manejar el idioma
class LanguageManager {
    constructor() {
        this.currentLanguage = 'es';
        this.availableLanguages = ['es', 'en', 'fr', 'de'];
        this.translations = {
            es: {
                // Reloj
                'clock': 'Reloj',
                'alarm': 'Alarma',
                'timer': 'Temporizador',
                'stopwatch': 'Cronómetro',
                'settings': 'Configuración',
                
                // Estados
                'ready': 'Listo',
                'running': 'Ejecutándose',
                'paused': 'Pausado',
                'stopped': 'Detenido',
                
                // Alarma
                'setAlarm': 'Establecer Alarma',
                'clearAll': 'Limpiar Todo',
                'alarms': 'Alarmas',
                'noAlarms': 'No hay alarmas configuradas',
                'alarmSet': 'Alarma configurada',
                'alarmCleared': 'Alarma eliminada',
                
                // Temporizador
                'start': 'Iniciar',
                'pause': 'Pausar',
                'reset': 'Reiniciar',
                'stop': 'Detener',
                'hours': 'Horas',
                'minutes': 'Minutos',
                'seconds': 'Segundos',
                'timerComplete': '¡Temporizador completado!',
                
                // Cronómetro
                'laps': 'Vueltas',
                'lap': 'Vuelta',
                'noLaps': 'No hay vueltas registradas',
                'bestLap': 'Mejor Vuelta',
                'average': 'Promedio',
                'totalTime': 'Tiempo Total',
                'lapCount': 'Vueltas',
                
                // Configuración
                'timeFormat': 'Formato de Hora',
                'timezone': 'Zona Horaria',
                'theme': 'Tema',
                'sounds': 'Sonidos',
                'language': 'Idioma',
                'animations': 'Animaciones',
                'fontSize': 'Tamaño de Fuente',
                'save': 'Guardar',
                'reset': 'Restablecer',
                'cancel': 'Cancelar',
                'settingsSaved': 'Configuración guardada exitosamente',
                'settingsReset': 'Configuración restablecida',
                
                // Formatos de hora
                '24hour': '24 horas (13:45)',
                '12hour': '12 horas (1:45 PM)',
                
                // Temas
                'auto': 'Automático (Sistema)',
                'light': 'Claro',
                'dark': 'Oscuro',
                
                // Tamaños de fuente
                'small': 'Pequeña',
                'medium': 'Mediana',
                'large': 'Grande',
                'xlarge': 'Extra Grande',
                
                // Zonas horarias
                'local': 'Local (Automático)',
                'utc': 'UTC',
                'mexico': 'México (GMT-6)',
                'newYork': 'Nueva York (GMT-5)',
                'madrid': 'Madrid (GMT+1)',
                'tokyo': 'Tokio (GMT+9)',
                
                // Días de la semana
                'monday': 'Lunes',
                'tuesday': 'Martes',
                'wednesday': 'Miércoles',
                'thursday': 'Jueves',
                'friday': 'Viernes',
                'saturday': 'Sábado',
                'sunday': 'Domingo',
                
                // Meses
                'january': 'Enero',
                'february': 'Febrero',
                'march': 'Marzo',
                'april': 'Abril',
                'may': 'Mayo',
                'june': 'Junio',
                'july': 'Julio',
                'august': 'Agosto',
                'september': 'Septiembre',
                'october': 'Octubre',
                'november': 'Noviembre',
                'december': 'Diciembre'
            },
            en: {
                // Clock
                'clock': 'Clock',
                'alarm': 'Alarm',
                'timer': 'Timer',
                'stopwatch': 'Stopwatch',
                'settings': 'Settings',
                
                // States
                'ready': 'Ready',
                'running': 'Running',
                'paused': 'Paused',
                'stopped': 'Stopped',
                
                // Alarm
                'setAlarm': 'Set Alarm',
                'clearAll': 'Clear All',
                'alarms': 'Alarms',
                'noAlarms': 'No alarms configured',
                'alarmSet': 'Alarm set',
                'alarmCleared': 'Alarm cleared',
                
                // Timer
                'start': 'Start',
                'pause': 'Pause',
                'reset': 'Reset',
                'stop': 'Stop',
                'hours': 'Hours',
                'minutes': 'Minutes',
                'seconds': 'Seconds',
                'timerComplete': 'Timer completed!',
                
                // Stopwatch
                'laps': 'Laps',
                'lap': 'Lap',
                'noLaps': 'No laps recorded',
                'bestLap': 'Best Lap',
                'average': 'Average',
                'totalTime': 'Total Time',
                'lapCount': 'Laps',
                
                // Settings
                'timeFormat': 'Time Format',
                'timezone': 'Timezone',
                'theme': 'Theme',
                'sounds': 'Sounds',
                'language': 'Language',
                'animations': 'Animations',
                'fontSize': 'Font Size',
                'save': 'Save',
                'reset': 'Reset',
                'cancel': 'Cancel',
                'settingsSaved': 'Settings saved successfully',
                'settingsReset': 'Settings reset',
                
                // Time formats
                '24hour': '24 hours (13:45)',
                '12hour': '12 hours (1:45 PM)',
                
                // Themes
                'auto': 'Auto (System)',
                'light': 'Light',
                'dark': 'Dark',
                
                // Font sizes
                'small': 'Small',
                'medium': 'Medium',
                'large': 'Large',
                'xlarge': 'Extra Large',
                
                // Timezones
                'local': 'Local (Auto)',
                'utc': 'UTC',
                'mexico': 'Mexico (GMT-6)',
                'newYork': 'New York (GMT-5)',
                'madrid': 'Madrid (GMT+1)',
                'tokyo': 'Tokyo (GMT+9)',
                
                // Days of week
                'monday': 'Monday',
                'tuesday': 'Tuesday',
                'wednesday': 'Wednesday',
                'thursday': 'Thursday',
                'friday': 'Friday',
                'saturday': 'Saturday',
                'sunday': 'Sunday',
                
                // Months
                'january': 'January',
                'february': 'February',
                'march': 'March',
                'april': 'April',
                'may': 'May',
                'june': 'June',
                'july': 'July',
                'august': 'August',
                'september': 'September',
                'october': 'October',
                'november': 'November',
                'december': 'December'
            },
            fr: {
                // Horloge
                'clock': 'Horloge',
                'alarm': 'Alarme',
                'timer': 'Minuteur',
                'stopwatch': 'Chronomètre',
                'settings': 'Paramètres',
                
                // États
                'ready': 'Prêt',
                'running': 'En cours',
                'paused': 'En pause',
                'stopped': 'Arrêté',
                
                // Alarme
                'setAlarm': 'Régler l\'alarme',
                'clearAll': 'Tout effacer',
                'alarms': 'Alarmes',
                'noAlarms': 'Aucune alarme configurée',
                'alarmSet': 'Alarme réglée',
                'alarmCleared': 'Alarme supprimée',
                
                // Minuteur
                'start': 'Démarrer',
                'pause': 'Pause',
                'reset': 'Réinitialiser',
                'stop': 'Arrêter',
                'hours': 'Heures',
                'minutes': 'Minutes',
                'seconds': 'Secondes',
                'timerComplete': 'Minuteur terminé !',
                
                // Chronomètre
                'laps': 'Tours',
                'lap': 'Tour',
                'noLaps': 'Aucun tour enregistré',
                'bestLap': 'Meilleur tour',
                'average': 'Moyenne',
                'totalTime': 'Temps total',
                'lapCount': 'Tours',
                
                // Paramètres
                'timeFormat': 'Format d\'heure',
                'timezone': 'Fuseau horaire',
                'theme': 'Thème',
                'sounds': 'Sons',
                'language': 'Langue',
                'animations': 'Animations',
                'fontSize': 'Taille de police',
                'save': 'Enregistrer',
                'reset': 'Réinitialiser',
                'cancel': 'Annuler',
                'settingsSaved': 'Paramètres enregistrés avec succès',
                'settingsReset': 'Paramètres réinitialisés',
                
                // Formats d'heure
                '24hour': '24 heures (13:45)',
                '12hour': '12 heures (1:45 PM)',
                
                // Thèmes
                'auto': 'Auto (Système)',
                'light': 'Clair',
                'dark': 'Sombre',
                
                // Tailles de police
                'small': 'Petite',
                'medium': 'Moyenne',
                'large': 'Grande',
                'xlarge': 'Très grande',
                
                // Fuseaux horaires
                'local': 'Local (Auto)',
                'utc': 'UTC',
                'mexico': 'Mexique (GMT-6)',
                'newYork': 'New York (GMT-5)',
                'madrid': 'Madrid (GMT+1)',
                'tokyo': 'Tokyo (GMT+9)',
                
                // Jours de la semaine
                'monday': 'Lundi',
                'tuesday': 'Mardi',
                'wednesday': 'Mercredi',
                'thursday': 'Jeudi',
                'friday': 'Vendredi',
                'saturday': 'Samedi',
                'sunday': 'Dimanche',
                
                // Mois
                'january': 'Janvier',
                'february': 'Février',
                'march': 'Mars',
                'april': 'Avril',
                'may': 'Mai',
                'june': 'Juin',
                'july': 'Juillet',
                'august': 'Août',
                'september': 'Septembre',
                'october': 'Octobre',
                'november': 'Novembre',
                'december': 'Décembre'
            },
            de: {
                // Uhr
                'clock': 'Uhr',
                'alarm': 'Wecker',
                'timer': 'Timer',
                'stopwatch': 'Stoppuhr',
                'settings': 'Einstellungen',
                
                // Zustände
                'ready': 'Bereit',
                'running': 'Läuft',
                'paused': 'Pausiert',
                'stopped': 'Gestoppt',
                
                // Wecker
                'setAlarm': 'Wecker stellen',
                'clearAll': 'Alles löschen',
                'alarms': 'Wecker',
                'noAlarms': 'Keine Wecker konfiguriert',
                'alarmSet': 'Wecker gestellt',
                'alarmCleared': 'Wecker gelöscht',
                
                // Timer
                'start': 'Start',
                'pause': 'Pause',
                'reset': 'Zurücksetzen',
                'stop': 'Stopp',
                'hours': 'Stunden',
                'minutes': 'Minuten',
                'seconds': 'Sekunden',
                'timerComplete': 'Timer abgeschlossen!',
                
                // Stoppuhr
                'laps': 'Runden',
                'lap': 'Runde',
                'noLaps': 'Keine Runden aufgezeichnet',
                'bestLap': 'Beste Runde',
                'average': 'Durchschnitt',
                'totalTime': 'Gesamtzeit',
                'lapCount': 'Runden',
                
                // Einstellungen
                'timeFormat': 'Zeitformat',
                'timezone': 'Zeitzone',
                'theme': 'Design',
                'sounds': 'Töne',
                'language': 'Sprache',
                'animations': 'Animationen',
                'fontSize': 'Schriftgröße',
                'save': 'Speichern',
                'reset': 'Zurücksetzen',
                'cancel': 'Abbrechen',
                'settingsSaved': 'Einstellungen erfolgreich gespeichert',
                'settingsReset': 'Einstellungen zurückgesetzt',
                
                // Zeitformate
                '24hour': '24 Stunden (13:45)',
                '12hour': '12 Stunden (1:45 PM)',
                
                // Designs
                'auto': 'Auto (System)',
                'light': 'Hell',
                'dark': 'Dunkel',
                
                // Schriftgrößen
                'small': 'Klein',
                'medium': 'Mittel',
                'large': 'Groß',
                'xlarge': 'Sehr groß',
                
                // Zeitzonen
                'local': 'Lokal (Auto)',
                'utc': 'UTC',
                'mexico': 'Mexiko (GMT-6)',
                'newYork': 'New York (GMT-5)',
                'madrid': 'Madrid (GMT+1)',
                'tokyo': 'Tokyo (GMT+9)',
                
                // Wochentage
                'monday': 'Montag',
                'tuesday': 'Dienstag',
                'wednesday': 'Mittwoch',
                'thursday': 'Donnerstag',
                'friday': 'Freitag',
                'saturday': 'Samstag',
                'sunday': 'Sonntag',
                
                // Monate
                'january': 'Januar',
                'february': 'Februar',
                'march': 'März',
                'april': 'April',
                'may': 'Mai',
                'june': 'Juni',
                'july': 'Juli',
                'august': 'August',
                'september': 'September',
                'october': 'Oktober',
                'november': 'November',
                'december': 'Dezember'
            }
        };
        
        this.init();
    }
    
    init() {
        this.loadSettings();
        this.applyLanguage();
        this.saveSettings();
    }
    
    loadSettings() {
        const savedSettings = localStorage.getItem('relojSettings');
        if (savedSettings) {
            try {
                const settings = JSON.parse(savedSettings);
                this.currentLanguage = settings.language || 'es';
            } catch (error) {
                console.error('Error al cargar idioma:', error);
            }
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
        
        settings.language = this.currentLanguage;
        localStorage.setItem('relojSettings', JSON.stringify(settings));
    }
    
    applyLanguage() {
        this.translatePage();
        console.log('Idioma aplicado:', this.currentLanguage);
        
        // Disparar evento personalizado
        window.dispatchEvent(new CustomEvent('languageChanged', {
            detail: { language: this.currentLanguage }
        }));
    }
    
    translatePage() {
        // Traducir elementos con atributo data-translate
        const elements = document.querySelectorAll('[data-translate]');
        elements.forEach(element => {
            const key = element.getAttribute('data-translate');
            const translation = this.getTranslation(key);
            if (translation) {
                element.textContent = translation;
            }
        });
        
        // Traducir elementos con atributo data-translate-placeholder
        const placeholders = document.querySelectorAll('[data-translate-placeholder]');
        placeholders.forEach(element => {
            const key = element.getAttribute('data-translate-placeholder');
            const translation = this.getTranslation(key);
            if (translation) {
                element.placeholder = translation;
            }
        });
        
        // Traducir elementos con atributo data-translate-title
        const titles = document.querySelectorAll('[data-translate-title]');
        titles.forEach(element => {
            const key = element.getAttribute('data-translate-title');
            const translation = this.getTranslation(key);
            if (translation) {
                element.title = translation;
            }
        });
    }
    
    getTranslation(key) {
        const lang = this.translations[this.currentLanguage];
        if (lang && lang[key]) {
            return lang[key];
        }
        
        // Fallback al español si no existe la traducción
        const fallback = this.translations['es'];
        return fallback[key] || key;
    }
    
    translate(key) {
        return this.getTranslation(key);
    }
    
    getCurrentLanguage() {
        return this.currentLanguage;
    }
    
    getAvailableLanguages() {
        return this.availableLanguages.map(lang => ({
            value: lang,
            label: this.getLanguageLabel(lang)
        }));
    }
    
    getLanguageLabel(language) {
        const labels = {
            'es': 'Español',
            'en': 'English',
            'fr': 'Français',
            'de': 'Deutsch'
        };
        return labels[language] || language;
    }
    
    setLanguage(language) {
        if (this.availableLanguages.includes(language)) {
            this.currentLanguage = language;
            this.applyLanguage();
            this.saveSettings();
            console.log('Idioma cambiado a:', language);
        } else {
            console.error('Idioma no soportado:', language);
        }
    }
    
    // Método para formatear fechas según el idioma
    formatDate(date) {
        const options = {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        };
        
        try {
            return date.toLocaleDateString(this.currentLanguage, options);
        } catch (error) {
            // Fallback al formato en español
            const days = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
            const months = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
            
            const dayName = days[date.getDay()];
            const monthName = months[date.getMonth()];
            const day = date.getDate();
            const year = date.getFullYear();
            
            return `${dayName}, ${day} de ${monthName}`;
        }
    }
    
    // Método para formatear números según el idioma
    formatNumber(number) {
        try {
            return number.toLocaleString(this.currentLanguage);
        } catch (error) {
            return number.toString();
        }
    }
}

// Función para inicializar el idioma
function initLanguage() {
    window.languageManager = new LanguageManager();
    console.log('Gestor de idioma inicializado');
}

// Inicializar cuando el DOM esté listo
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initLanguage);
} else {
    initLanguage();
} 