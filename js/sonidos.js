// Clase para manejar los sonidos
class SoundManager {
    constructor() {
        this.soundsEnabled = true;
        this.audioContext = null;
        this.sounds = {};
        this.init();
    }
    
    init() {
        this.loadSettings();
        this.initAudioContext();
        this.createSounds();
    }
    
    loadSettings() {
        const savedSettings = localStorage.getItem('relojSettings');
        if (savedSettings) {
            try {
                const settings = JSON.parse(savedSettings);
                this.soundsEnabled = settings.sounds !== false; // Por defecto true
            } catch (error) {
                console.error('Error al cargar configuración de sonidos:', error);
            }
        }
    }
    
    initAudioContext() {
        try {
            // Crear contexto de audio solo cuando sea necesario
            if (typeof AudioContext !== 'undefined' || typeof webkitAudioContext !== 'undefined') {
                this.audioContext = new (AudioContext || webkitAudioContext)();
            }
        } catch (error) {
            console.warn('AudioContext no disponible:', error);
        }
    }
    
    createSounds() {
        // Crear sonidos básicos usando Web Audio API
        this.createBeepSound();
        this.createNotificationSound();
        this.createAlarmSound();
    }
    
    createBeepSound() {
        if (!this.audioContext) return;
        
        try {
            const oscillator = this.audioContext.createOscillator();
            const gainNode = this.audioContext.createGain();
            
            oscillator.connect(gainNode);
            gainNode.connect(this.audioContext.destination);
            
            oscillator.frequency.setValueAtTime(800, this.audioContext.currentTime);
            oscillator.type = 'sine';
            
            gainNode.gain.setValueAtTime(0.1, this.audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.1);
            
            this.sounds.beep = { oscillator, gainNode };
        } catch (error) {
            console.warn('Error al crear sonido beep:', error);
        }
    }
    
    createNotificationSound() {
        if (!this.audioContext) return;
        
        try {
            const oscillator = this.audioContext.createOscillator();
            const gainNode = this.audioContext.createGain();
            
            oscillator.connect(gainNode);
            gainNode.connect(this.audioContext.destination);
            
            oscillator.frequency.setValueAtTime(1000, this.audioContext.currentTime);
            oscillator.frequency.exponentialRampToValueAtTime(800, this.audioContext.currentTime + 0.1);
            oscillator.type = 'sine';
            
            gainNode.gain.setValueAtTime(0.1, this.audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.2);
            
            this.sounds.notification = { oscillator, gainNode };
        } catch (error) {
            console.warn('Error al crear sonido de notificación:', error);
        }
    }
    
    createAlarmSound() {
        if (!this.audioContext) return;
        
        try {
            const oscillator = this.audioContext.createOscillator();
            const gainNode = this.audioContext.createGain();
            
            oscillator.connect(gainNode);
            gainNode.connect(this.audioContext.destination);
            
            oscillator.frequency.setValueAtTime(600, this.audioContext.currentTime);
            oscillator.frequency.setValueAtTime(800, this.audioContext.currentTime + 0.1);
            oscillator.frequency.setValueAtTime(600, this.audioContext.currentTime + 0.2);
            oscillator.type = 'square';
            
            gainNode.gain.setValueAtTime(0.1, this.audioContext.currentTime);
            gainNode.gain.setValueAtTime(0.1, this.audioContext.currentTime + 0.3);
            
            this.sounds.alarm = { oscillator, gainNode };
        } catch (error) {
            console.warn('Error al crear sonido de alarma:', error);
        }
    }
    
    playSound(soundName) {
        if (!this.soundsEnabled || !this.audioContext) return;
        
        try {
            // Reanudar contexto si está suspendido
            if (this.audioContext.state === 'suspended') {
                this.audioContext.resume();
            }
            
            const sound = this.sounds[soundName];
            if (sound) {
                // Crear una nueva instancia del sonido
                const oscillator = this.audioContext.createOscillator();
                const gainNode = this.audioContext.createGain();
                
                oscillator.connect(gainNode);
                gainNode.connect(this.audioContext.destination);
                
                // Configurar el sonido según el tipo
                switch (soundName) {
                    case 'beep':
                        oscillator.frequency.setValueAtTime(800, this.audioContext.currentTime);
                        oscillator.type = 'sine';
                        gainNode.gain.setValueAtTime(0.1, this.audioContext.currentTime);
                        gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.1);
                        oscillator.start();
                        oscillator.stop(this.audioContext.currentTime + 0.1);
                        break;
                        
                    case 'notification':
                        oscillator.frequency.setValueAtTime(1000, this.audioContext.currentTime);
                        oscillator.frequency.exponentialRampToValueAtTime(800, this.audioContext.currentTime + 0.1);
                        oscillator.type = 'sine';
                        gainNode.gain.setValueAtTime(0.1, this.audioContext.currentTime);
                        gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.2);
                        oscillator.start();
                        oscillator.stop(this.audioContext.currentTime + 0.2);
                        break;
                        
                    case 'alarm':
                        oscillator.frequency.setValueAtTime(600, this.audioContext.currentTime);
                        oscillator.frequency.setValueAtTime(800, this.audioContext.currentTime + 0.1);
                        oscillator.frequency.setValueAtTime(600, this.audioContext.currentTime + 0.2);
                        oscillator.type = 'square';
                        gainNode.gain.setValueAtTime(0.1, this.audioContext.currentTime);
                        gainNode.gain.setValueAtTime(0.1, this.audioContext.currentTime + 0.3);
                        oscillator.start();
                        oscillator.stop(this.audioContext.currentTime + 0.3);
                        break;
                }
            }
        } catch (error) {
            console.warn('Error al reproducir sonido:', error);
        }
    }
    
    playBeep() {
        this.playSound('beep');
    }
    
    playNotification() {
        this.playSound('notification');
    }
    
    playAlarm() {
        this.playSound('alarm');
    }
    
    enableSounds() {
        this.soundsEnabled = true;
        console.log('Sonidos habilitados');
    }
    
    disableSounds() {
        this.soundsEnabled = false;
        console.log('Sonidos deshabilitados');
    }
    
    toggleSounds() {
        this.soundsEnabled = !this.soundsEnabled;
        console.log('Sonidos:', this.soundsEnabled ? 'habilitados' : 'deshabilitados');
        return this.soundsEnabled;
    }
    
    isEnabled() {
        return this.soundsEnabled;
    }
    
    // Método para notificaciones del navegador
    showNotification(title, options = {}) {
        if (!this.soundsEnabled) return;
        
        if ('Notification' in window && Notification.permission === 'granted') {
            const notification = new Notification(title, {
                icon: '/favicon.ico',
                badge: '/favicon.ico',
                ...options
            });
            
            // Reproducir sonido con la notificación
            this.playNotification();
            
            return notification;
        }
    }
    
    // Solicitar permisos de notificación
    requestNotificationPermission() {
        if ('Notification' in window && Notification.permission === 'default') {
            Notification.requestPermission().then(permission => {
                console.log('Permiso de notificación:', permission);
            });
        }
    }
}

// Función para inicializar los sonidos
function initSounds() {
    window.soundManager = new SoundManager();
    console.log('Gestor de sonidos inicializado');
}

// Inicializar cuando el DOM esté listo
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initSounds);
} else {
    initSounds();
} 