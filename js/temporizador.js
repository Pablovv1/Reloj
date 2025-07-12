// Clase para manejar la funcionalidad de Temporizador
class TimerManager {
    constructor() {
        this.timeLeft = 0;
        this.totalTime = 0;
        this.isRunning = false;
        this.isPaused = false;
        this.timerInterval = null;
        this.audioContext = null;
        
        this.initElements();
        this.initEventListeners();
        this.loadPresets();
    }
    
    initElements() {
        // Display del temporizador
        this.timerDisplay = document.getElementById('timerDisplay');
        this.timerStatus = document.getElementById('timerStatus');
        this.timerStatusText = document.getElementById('timerStatusText');
        
        // Presets
        this.presetBtns = document.querySelectorAll('.preset-btn');
        
        // Inputs personalizados
        this.hourInput = document.getElementById('timerHour');
        this.minuteInput = document.getElementById('timerMinute');
        this.secondInput = document.getElementById('timerSecond');
        
        // Botones de control
        this.startBtn = document.getElementById('timerStart');
        this.pauseBtn = document.getElementById('timerPause');
        this.resetBtn = document.getElementById('timerReset');
        
        // Barra de progreso
        this.progressBar = document.getElementById('progressBar');
        this.progressFill = document.getElementById('progressFill');
    }
    
    initEventListeners() {
        // Presets
        this.presetBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const minutes = parseInt(e.target.dataset.minutes);
                this.setPreset(minutes);
            });
        });
        
        // Botones de control
        this.startBtn.addEventListener('click', () => {
            this.startTimer();
        });
        
        this.pauseBtn.addEventListener('click', () => {
            this.pauseTimer();
        });
        
        this.resetBtn.addEventListener('click', () => {
            this.resetTimer();
        });
        
        // Validación de inputs
        this.hourInput.addEventListener('input', (e) => {
            this.validateInput(e.target, 23);
            this.setCustomTime();
        });
        
        this.minuteInput.addEventListener('input', (e) => {
            this.validateInput(e.target, 59);
            this.setCustomTime();
        });
        
        this.secondInput.addEventListener('input', (e) => {
            this.validateInput(e.target, 59);
            this.setCustomTime();
        });
    }
    
    validateInput(input, max) {
        let value = parseInt(input.value);
        if (isNaN(value) || value < 0) {
            input.value = '0';
        } else if (value > max) {
            input.value = max.toString();
        }
    }
    
    setPreset(minutes) {
        // Remover clase active de todos los presets
        this.presetBtns.forEach(btn => {
            btn.classList.remove('active');
        });
        
        // Agregar clase active al preset seleccionado
        const selectedBtn = document.querySelector(`[data-minutes="${minutes}"]`);
        if (selectedBtn) {
            selectedBtn.classList.add('active');
        }
        
        // Establecer tiempo
        this.totalTime = minutes * 60;
        this.timeLeft = this.totalTime;
        this.updateDisplay();
        this.updateProgress();
        
        // Resetear estado
        this.isRunning = false;
        this.isPaused = false;
        this.updateButtons();
        this.updateStatus('Listo');
    }
    
    setCustomTime() {
        const hours = parseInt(this.hourInput.value) || 0;
        const minutes = parseInt(this.minuteInput.value) || 0;
        const seconds = parseInt(this.secondInput.value) || 0;
        
        this.totalTime = hours * 3600 + minutes * 60 + seconds;
        this.timeLeft = this.totalTime;
        
        if (this.totalTime > 0) {
            this.updateDisplay();
            this.updateProgress();
            this.updateStatus('Listo');
        }
    }
    
    startTimer() {
        if (this.timeLeft <= 0) {
            this.setCustomTime();
            if (this.totalTime <= 0) {
                this.showNotification('Por favor, establece un tiempo válido', 'error');
                return;
            }
        }
        
        if (!this.isRunning) {
            this.isRunning = true;
            this.isPaused = false;
            
            this.timerInterval = setInterval(() => {
                this.timeLeft--;
                this.updateDisplay();
                this.updateProgress();
                
                if (this.timeLeft <= 0) {
                    this.timerFinished();
                }
            }, 1000);
            
            this.updateButtons();
            this.updateStatus('Ejecutando');
        }
    }
    
    pauseTimer() {
        if (this.isRunning) {
            clearInterval(this.timerInterval);
            this.isRunning = false;
            this.isPaused = true;
            this.updateButtons();
            this.updateStatus('Pausado');
        }
    }
    
    resetTimer() {
        clearInterval(this.timerInterval);
        this.timeLeft = this.totalTime;
        this.isRunning = false;
        this.isPaused = false;
        this.updateDisplay();
        this.updateProgress();
        this.updateButtons();
        this.updateStatus('Listo');
    }
    
    timerFinished() {
        clearInterval(this.timerInterval);
        this.isRunning = false;
        this.isPaused = false;
        this.timeLeft = 0;
        this.updateDisplay();
        this.updateProgress();
        this.updateButtons();
        this.updateStatus('Completado');
        
        this.playFinishSound();
        this.showFinishNotification();
    }
    
    updateDisplay() {
        const hours = Math.floor(this.timeLeft / 3600);
        const minutes = Math.floor((this.timeLeft % 3600) / 60);
        const seconds = this.timeLeft % 60;
        
        const timeString = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        
        this.timerDisplay.textContent = timeString;
    }
    
    updateProgress() {
        if (this.totalTime > 0) {
            const progress = ((this.totalTime - this.timeLeft) / this.totalTime) * 100;
            this.progressFill.style.width = `${progress}%`;
        } else {
            this.progressFill.style.width = '0%';
        }
    }
    
    updateButtons() {
        if (this.isRunning) {
            this.startBtn.disabled = true;
            this.pauseBtn.disabled = false;
            this.resetBtn.disabled = false;
        } else if (this.isPaused) {
            this.startBtn.disabled = false;
            this.pauseBtn.disabled = true;
            this.resetBtn.disabled = false;
        } else {
            this.startBtn.disabled = false;
            this.pauseBtn.disabled = true;
            this.resetBtn.disabled = true;
        }
    }
    
    updateStatus(status) {
        if (this.timerStatus) {
            this.timerStatus.textContent = status;
        }
        if (this.timerStatusText) {
            this.timerStatusText.textContent = status;
            
            // Actualizar clases CSS para el estado
            this.timerStatusText.className = 'status-text';
            if (status === 'Ejecutando') {
                this.timerStatusText.classList.add('running');
            } else if (status === 'Pausado') {
                this.timerStatusText.classList.add('paused');
            } else if (status === 'Completado') {
                this.timerStatusText.classList.add('finished');
            }
        }
    }
    
    playFinishSound() {
        try {
            // Crear contexto de audio
            this.audioContext = this.audioContext || new (window.AudioContext || window.webkitAudioContext)();
            
            const playNote = () => {
                const oscillator = this.audioContext.createOscillator();
                const gainNode = this.audioContext.createGain();
                
                oscillator.connect(gainNode);
                gainNode.connect(this.audioContext.destination);
                
                oscillator.frequency.setValueAtTime(800, this.audioContext.currentTime);
                oscillator.frequency.setValueAtTime(600, this.audioContext.currentTime + 0.1);
                oscillator.frequency.setValueAtTime(400, this.audioContext.currentTime + 0.2);
                
                gainNode.gain.setValueAtTime(0.3, this.audioContext.currentTime);
                gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.3);
                
                oscillator.start(this.audioContext.currentTime);
                oscillator.stop(this.audioContext.currentTime + 0.3);
            };
            
            // Reproducir secuencia de notas
            playNote();
            setTimeout(() => playNote(), 300);
            setTimeout(() => playNote(), 600);
            
        } catch (error) {
            console.log('Audio no disponible:', error);
        }
    }
    
    showFinishNotification() {
        // Crear notificación
        const notification = document.createElement('div');
        notification.className = 'timer-notification';
        notification.innerHTML = `
            <div class="notification-title">¡Tiempo Completado!</div>
            <div class="notification-message">El temporizador ha terminado</div>
            <button class="notification-btn" onclick="this.parentElement.remove()">Aceptar</button>
        `;
        
        // Aplicar estilos
        notification.style.cssText = `
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
            animation: notificationIn 0.5s ease-out;
        `;
        
        // Agregar estilos para elementos internos
        const title = notification.querySelector('.notification-title');
        title.style.cssText = `
            font-size: 1.5rem;
            color: #333;
            margin-bottom: 12px;
            font-weight: 600;
        `;
        
        const message = notification.querySelector('.notification-message');
        message.style.cssText = `
            font-size: 1rem;
            color: #666;
            margin-bottom: 20px;
        `;
        
        const btn = notification.querySelector('.notification-btn');
        btn.style.cssText = `
            background: linear-gradient(135deg, #4facfe, #00f2fe);
            border: none;
            border-radius: 16px;
            padding: 12px 24px;
            color: white;
            cursor: pointer;
            font-size: 1rem;
            font-weight: 500;
            transition: all 0.3s ease;
        `;
        
        btn.addEventListener('mouseenter', () => {
            btn.style.background = 'linear-gradient(135deg, #3a9bfe, #00e6fe)';
            btn.style.transform = 'translateY(-2px)';
        });
        
        btn.addEventListener('mouseleave', () => {
            btn.style.background = 'linear-gradient(135deg, #4facfe, #00f2fe)';
            btn.style.transform = 'translateY(0)';
        });
        
        // Agregar animación CSS
        const style = document.createElement('style');
        style.textContent = `
            @keyframes notificationIn {
                from {
                    opacity: 0;
                    transform: translate(-50%, -50%) scale(0.8);
                }
                to {
                    opacity: 1;
                    transform: translate(-50%, -50%) scale(1);
                }
            }
        `;
        document.head.appendChild(style);
        
        // Agregar al DOM
        document.body.appendChild(notification);
        
        // Remover automáticamente después de 5 segundos
        setTimeout(() => {
            if (notification.parentElement) {
                notification.remove();
            }
        }, 5000);
        
        // Solicitar notificación del navegador si está disponible
        if ('Notification' in window && Notification.permission === 'granted') {
            new Notification('Temporizador Completado', {
                body: 'El tiempo ha terminado',
                icon: '/favicon.ico',
                badge: '/favicon.ico'
            });
        } else if ('Notification' in window && Notification.permission !== 'denied') {
            Notification.requestPermission().then(permission => {
                if (permission === 'granted') {
                    new Notification('Temporizador Completado', {
                        body: 'El tiempo ha terminado',
                        icon: '/favicon.ico',
                        badge: '/favicon.ico'
                    });
                }
            });
        }
    }
    
    showNotification(message, type = 'info') {
        // Crear notificación
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.textContent = message;
        
        // Aplicar estilos
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${type === 'error' ? 'rgba(255, 107, 107, 0.9)' : 'rgba(79, 172, 254, 0.9)'};
            color: white;
            padding: 12px 20px;
            border-radius: 12px;
            font-size: 0.9rem;
            font-weight: 500;
            z-index: 2000;
            animation: slideInRight 0.3s ease-out;
            backdrop-filter: blur(10px);
            border: 1px solid rgba(255, 255, 255, 0.2);
        `;
        
        // Agregar animación CSS
        const style = document.createElement('style');
        style.textContent = `
            @keyframes slideInRight {
                from {
                    opacity: 0;
                    transform: translateX(100%);
                }
                to {
                    opacity: 1;
                    transform: translateX(0);
                }
            }
        `;
        document.head.appendChild(style);
        
        // Agregar al DOM
        document.body.appendChild(notification);
        
        // Remover automáticamente después de 3 segundos
        setTimeout(() => {
            if (notification.parentElement) {
                notification.style.animation = 'slideOutRight 0.3s ease-in';
                setTimeout(() => {
                    if (notification.parentElement) {
                        notification.remove();
                    }
                }, 300);
            }
        }, 3000);
    }
    
    loadPresets() {
        // Cargar presets guardados si existen
        const savedPresets = localStorage.getItem('timerPresets');
        if (savedPresets) {
            try {
                const presets = JSON.parse(savedPresets);
                // Aquí se podrían cargar presets personalizados
            } catch (error) {
                console.log('Error al cargar presets:', error);
            }
        }
    }
    
    savePresets() {
        // Guardar presets personalizados
        const presets = {
            // Aquí se podrían guardar presets personalizados
        };
        localStorage.setItem('timerPresets', JSON.stringify(presets));
    }
    
    // Métodos públicos para acceso externo
    getTimeLeft() {
        return this.timeLeft;
    }
    
    getTotalTime() {
        return this.totalTime;
    }
    
    isTimerRunning() {
        return this.isRunning;
    }
    
    isTimerPaused() {
        return this.isPaused;
    }
}

// Inicializar la sección de temporizador
function initTimerSection() {
    if (typeof window.timerManager === 'undefined') {
        window.timerManager = new TimerManager();
    }
}

// Inicializar cuando el DOM esté listo
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initTimerSection);
} else {
    initTimerSection();
} 