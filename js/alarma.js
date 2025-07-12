// Clase para manejar la funcionalidad de Alarma
class AlarmManager {
    constructor() {
        this.alarms = [];
        this.currentAlarm = null;
        this.audioContext = null;
        this.audioElement = null;
        
        this.initElements();
        this.initEventListeners();
        this.loadAlarms();
        this.startAlarmCheck();
    }
    
    initElements() {
        // Elementos del formulario
        this.hourInput = document.getElementById('alarmHour');
        this.minuteInput = document.getElementById('alarmMinute');
        this.periodBtns = document.querySelectorAll('.period-btn');
        this.dayBtns = document.querySelectorAll('.day-btn');
        this.setAlarmBtn = document.getElementById('setAlarmBtn');
        this.clearAlarmBtn = document.getElementById('clearAlarmBtn');
        
        // Elementos de la lista
        this.alarmsList = document.getElementById('alarmsList');
        this.alarmsTitle = document.getElementById('alarmsTitle');
        
        // Estado actual
        this.currentPeriod = 'AM';
        this.selectedDays = [];
    }
    
    initEventListeners() {
        // Botones de período
        this.periodBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.setPeriod(e.target.textContent);
            });
        });
        
        // Botones de días
        this.dayBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.toggleDay(e.target.dataset.day);
            });
        });
        
        // Botones de acción
        this.setAlarmBtn.addEventListener('click', () => {
            this.setAlarm();
        });
        
        this.clearAlarmBtn.addEventListener('click', () => {
            this.clearAlarms();
        });
        
        // Validación de inputs
        this.hourInput.addEventListener('input', (e) => {
            this.validateHourInput(e.target);
        });
        
        this.minuteInput.addEventListener('input', (e) => {
            this.validateMinuteInput(e.target);
        });
    }
    
    setPeriod(period) {
        this.currentPeriod = period;
        
        // Actualizar botones
        this.periodBtns.forEach(btn => {
            btn.classList.remove('active');
            if (btn.textContent === period) {
                btn.classList.add('active');
            }
        });
    }
    
    toggleDay(day) {
        const dayIndex = this.selectedDays.indexOf(day);
        const dayBtn = document.querySelector(`[data-day="${day}"]`);
        
        if (dayIndex === -1) {
            this.selectedDays.push(day);
            dayBtn.classList.add('active');
        } else {
            this.selectedDays.splice(dayIndex, 1);
            dayBtn.classList.remove('active');
        }
    }
    
    validateHourInput(input) {
        let value = parseInt(input.value);
        if (isNaN(value) || value < 1) {
            input.value = '1';
        } else if (value > 12) {
            input.value = '12';
        }
    }
    
    validateMinuteInput(input) {
        let value = parseInt(input.value);
        if (isNaN(value) || value < 0) {
            input.value = '00';
        } else if (value > 59) {
            input.value = '59';
        } else {
            input.value = value.toString().padStart(2, '0');
        }
    }
    
    setAlarm() {
        const hour = parseInt(this.hourInput.value);
        const minute = parseInt(this.minuteInput.value);
        
        if (!hour || !minute) {
            this.showNotification('Por favor, ingresa una hora válida', 'error');
            return;
        }
        
        if (this.selectedDays.length === 0) {
            this.showNotification('Selecciona al menos un día', 'error');
            return;
        }
        
        // Convertir a formato 24 horas
        let hour24 = hour;
        if (this.currentPeriod === 'PM' && hour !== 12) {
            hour24 = hour + 12;
        } else if (this.currentPeriod === 'AM' && hour === 12) {
            hour24 = 0;
        }
        
        const alarm = {
            id: Date.now(),
            hour: hour24,
            minute: minute,
            period: this.currentPeriod,
            days: [...this.selectedDays],
            active: true,
            created: new Date()
        };
        
        this.alarms.push(alarm);
        this.saveAlarms();
        this.renderAlarms();
        this.resetForm();
        
        this.showNotification('Alarma configurada correctamente', 'success');
    }
    
    resetForm() {
        this.hourInput.value = '';
        this.minuteInput.value = '';
        this.selectedDays = [];
        
        // Resetear botones
        this.dayBtns.forEach(btn => {
            btn.classList.remove('active');
        });
        
        this.periodBtns.forEach(btn => {
            btn.classList.remove('active');
        });
        this.periodBtns[0].classList.add('active'); // AM por defecto
        this.currentPeriod = 'AM';
    }
    
    renderAlarms() {
        if (this.alarms.length === 0) {
            this.alarmsList.innerHTML = '<p style="text-align: center; color: rgba(255,255,255,0.6);">No hay alarmas configuradas</p>';
            this.alarmsTitle.textContent = 'Alarmas (0)';
            return;
        }
        
        this.alarmsTitle.textContent = `Alarmas (${this.alarms.length})`;
        
        this.alarmsList.innerHTML = this.alarms
            .sort((a, b) => a.hour * 60 + a.minute - b.hour * 60 - b.minute)
            .map(alarm => this.createAlarmHTML(alarm))
            .join('');
        
        // Agregar event listeners a los nuevos elementos
        this.addAlarmEventListeners();
    }
    
    createAlarmHTML(alarm) {
        const timeStr = this.formatTime(alarm.hour, alarm.minute);
        const daysStr = this.formatDays(alarm.days);
        const statusClass = alarm.active ? 'active' : '';
        
        return `
            <div class="alarm-item" data-id="${alarm.id}">
                <div class="alarm-info">
                    <div class="alarm-time">${timeStr}</div>
                    <div class="alarm-days">${daysStr}</div>
                </div>
                <div class="alarm-controls">
                    <div class="alarm-toggle ${statusClass}" data-id="${alarm.id}"></div>
                    <button class="delete-alarm" data-id="${alarm.id}">Eliminar</button>
                </div>
            </div>
        `;
    }
    
    formatTime(hour, minute) {
        let period = 'AM';
        let displayHour = hour;
        
        if (hour >= 12) {
            period = 'PM';
            if (hour > 12) {
                displayHour = hour - 12;
            }
        }
        if (hour === 0) {
            displayHour = 12;
        }
        
        return `${displayHour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')} ${period}`;
    }
    
    formatDays(days) {
        const dayNames = {
            'mon': 'Lun',
            'tue': 'Mar',
            'wed': 'Mié',
            'thu': 'Jue',
            'fri': 'Vie',
            'sat': 'Sáb',
            'sun': 'Dom'
        };
        
        return days.map(day => dayNames[day]).join(', ');
    }
    
    addAlarmEventListeners() {
        // Toggles de alarmas
        document.querySelectorAll('.alarm-toggle').forEach(toggle => {
            toggle.addEventListener('click', (e) => {
                const alarmId = parseInt(e.target.dataset.id);
                this.toggleAlarm(alarmId);
            });
        });
        
        // Botones de eliminar
        document.querySelectorAll('.delete-alarm').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const alarmId = parseInt(e.target.dataset.id);
                this.deleteAlarm(alarmId);
            });
        });
    }
    
    toggleAlarm(alarmId) {
        const alarm = this.alarms.find(a => a.id === alarmId);
        if (alarm) {
            alarm.active = !alarm.active;
            this.saveAlarms();
            this.renderAlarms();
            
            const status = alarm.active ? 'activada' : 'desactivada';
            this.showNotification(`Alarma ${status}`, 'info');
        }
    }
    
    deleteAlarm(alarmId) {
        const index = this.alarms.findIndex(a => a.id === alarmId);
        if (index !== -1) {
            this.alarms.splice(index, 1);
            this.saveAlarms();
            this.renderAlarms();
            this.showNotification('Alarma eliminada', 'success');
        }
    }
    
    clearAlarms() {
        if (this.alarms.length === 0) {
            this.showNotification('No hay alarmas para eliminar', 'info');
            return;
        }
        
        if (confirm('¿Estás seguro de que quieres eliminar todas las alarmas?')) {
            this.alarms = [];
            this.saveAlarms();
            this.renderAlarms();
            this.showNotification('Todas las alarmas han sido eliminadas', 'success');
        }
    }
    
    startAlarmCheck() {
        setInterval(() => {
            this.checkAlarms();
        }, 1000);
    }
    
    checkAlarms() {
        const now = new Date();
        const currentDay = this.getDayOfWeek(now.getDay());
        const currentHour = now.getHours();
        const currentMinute = now.getMinutes();
        
        this.alarms.forEach(alarm => {
            if (!alarm.active) return;
            
            if (alarm.days.includes(currentDay) && 
                alarm.hour === currentHour && 
                alarm.minute === currentMinute) {
                
                // Evitar que se active múltiples veces en el mismo minuto
                if (!alarm.lastTriggered || 
                    now.getTime() - alarm.lastTriggered > 60000) {
                    
                    this.triggerAlarm(alarm);
                    alarm.lastTriggered = now.getTime();
                }
            }
        });
    }
    
    getDayOfWeek(dayIndex) {
        const days = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'];
        return days[dayIndex];
    }
    
    triggerAlarm(alarm) {
        this.currentAlarm = alarm;
        this.showAlarmNotification(alarm);
        this.playAlarmSound();
        
        // Detener automáticamente después de 1 minuto
        setTimeout(() => {
            this.stopAlarm();
        }, 60000);
    }
    
    showAlarmNotification(alarm) {
        const timeStr = this.formatTime(alarm.hour, alarm.minute);
        
        // Crear notificación
        const notification = document.createElement('div');
        notification.className = 'alarm-notification';
        notification.innerHTML = `
            <div class="alarm-notification-content">
                <div class="alarm-notification-header">
                    <h3>⏰ ¡Alarma!</h3>
                    <button class="alarm-notification-close" onclick="this.parentElement.parentElement.parentElement.remove()">✕</button>
                </div>
                <div class="alarm-notification-body">
                    <p>Es hora de tu alarma: <strong>${timeStr}</strong></p>
                    <button class="alarm-notification-stop" onclick="alarmManager.stopAlarm()">Detener Alarma</button>
                </div>
            </div>
        `;
        
        // Agregar estilos
        const style = document.createElement('style');
        style.textContent = `
            .alarm-notification {
                position: fixed;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                background: rgba(255, 255, 255, 0.95);
                backdrop-filter: blur(20px);
                border: 1px solid rgba(255, 255, 255, 0.2);
                border-radius: 20px;
                padding: 32px;
                text-align: center;
                box-shadow: 0 20px 40px rgba(0, 0, 0, 0.2);
                z-index: 2000;
                animation: alarmPulse 1s ease-in-out infinite;
            }
            
            @keyframes alarmPulse {
                0%, 100% { transform: translate(-50%, -50%) scale(1); }
                50% { transform: translate(-50%, -50%) scale(1.05); }
            }
            
            .alarm-notification-content {
                min-width: 300px;
            }
            
            .alarm-notification-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 20px;
                padding-bottom: 16px;
                border-bottom: 1px solid rgba(0, 0, 0, 0.1);
            }
            
            .alarm-notification-header h3 {
                color: #333;
                font-size: 1.5rem;
                font-weight: 600;
                margin: 0;
            }
            
            .alarm-notification-close {
                background: none;
                border: none;
                color: #666;
                font-size: 1.2rem;
                cursor: pointer;
                padding: 4px;
                border-radius: 4px;
                transition: all 0.2s ease;
            }
            
            .alarm-notification-close:hover {
                background: rgba(0, 0, 0, 0.1);
                color: #333;
            }
            
            .alarm-notification-body p {
                color: #666;
                font-size: 1.1rem;
                margin-bottom: 20px;
            }
            
            .alarm-notification-stop {
                background: linear-gradient(135deg, #f44336, #ef5350);
                border: none;
                border-radius: 16px;
                padding: 12px 24px;
                color: white;
                cursor: pointer;
                font-size: 1rem;
                font-weight: 500;
                transition: all 0.3s ease;
            }
            
            .alarm-notification-stop:hover {
                background: linear-gradient(135deg, #d32f2f, #e53935);
                transform: translateY(-2px);
            }
        `;
        
        document.head.appendChild(style);
        document.body.appendChild(notification);
    }
    
    playAlarmSound() {
        // Crear audio context para generar tono
        this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
        
        // Generar tono de alarma
        const oscillator = this.audioContext.createOscillator();
        const gainNode = this.audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(this.audioContext.destination);
        
        oscillator.frequency.setValueAtTime(800, this.audioContext.currentTime);
        oscillator.frequency.setValueAtTime(600, this.audioContext.currentTime + 0.5);
        
        gainNode.gain.setValueAtTime(0.3, this.audioContext.currentTime);
        
        oscillator.start();
        oscillator.stop(this.audioContext.currentTime + 1);
        
        // Repetir cada segundo
        this.alarmInterval = setInterval(() => {
            const oscillator = this.audioContext.createOscillator();
            const gainNode = this.audioContext.createGain();
            
            oscillator.connect(gainNode);
            gainNode.connect(this.audioContext.destination);
            
            oscillator.frequency.setValueAtTime(800, this.audioContext.currentTime);
            oscillator.frequency.setValueAtTime(600, this.audioContext.currentTime + 0.5);
            
            gainNode.gain.setValueAtTime(0.3, this.audioContext.currentTime);
            
            oscillator.start();
            oscillator.stop(this.audioContext.currentTime + 1);
        }, 1000);
    }
    
    stopAlarm() {
        if (this.alarmInterval) {
            clearInterval(this.alarmInterval);
            this.alarmInterval = null;
        }
        
        if (this.audioContext) {
            this.audioContext.close();
            this.audioContext = null;
        }
        
        // Remover notificación
        const notification = document.querySelector('.alarm-notification');
        if (notification) {
            notification.remove();
        }
        
        this.currentAlarm = null;
    }
    
    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.textContent = message;
        
        // Agregar estilos
        const style = document.createElement('style');
        style.textContent = `
            .notification {
                position: fixed;
                top: 20px;
                right: 20px;
                background: rgba(255, 255, 255, 0.95);
                backdrop-filter: blur(20px);
                border: 1px solid rgba(255, 255, 255, 0.2);
                border-radius: 12px;
                padding: 12px 20px;
                color: #333;
                font-size: 0.9rem;
                font-weight: 500;
                box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
                z-index: 1000;
                animation: slideInRight 0.3s ease-out;
            }
            
            .notification-success {
                border-left: 4px solid #4caf50;
            }
            
            .notification-error {
                border-left: 4px solid #f44336;
            }
            
            .notification-info {
                border-left: 4px solid #2196f3;
            }
            
            @keyframes slideInRight {
                from { transform: translateX(100%); opacity: 0; }
                to { transform: translateX(0); opacity: 1; }
            }
        `;
        
        document.head.appendChild(style);
        document.body.appendChild(notification);
        
        // Remover después de 3 segundos
        setTimeout(() => {
            notification.remove();
        }, 3000);
    }
    
    saveAlarms() {
        localStorage.setItem('alarms', JSON.stringify(this.alarms));
    }
    
    loadAlarms() {
        const saved = localStorage.getItem('alarms');
        if (saved) {
            this.alarms = JSON.parse(saved);
            this.renderAlarms();
        }
    }
}

// Inicializar cuando se active la sección
function initAlarmSection() {
    if (!window.alarmManager) {
        window.alarmManager = new AlarmManager();
    }
} 