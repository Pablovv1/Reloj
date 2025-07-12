// Clase para manejar la funcionalidad de Cronómetro
class Stopwatch {
    constructor() {
        this.isRunning = false;
        this.isPaused = false;
        this.startTime = 0;
        this.pauseTime = 0;
        this.totalPausedTime = 0;
        this.laps = [];
        this.interval = null;
        
        this.initElements();
        this.initEventListeners();
        this.updateDisplay();
        this.updateButtons();
    }
    
    initElements() {
        // Display del cronómetro
        this.stopwatchDisplay = document.getElementById('stopwatchDisplay');
        this.stopwatchStatus = document.getElementById('stopwatchStatus');
        
        // Botones de control
        this.startBtn = document.getElementById('stopwatchStart');
        this.stopBtn = document.getElementById('stopwatchStop');
        this.resetBtn = document.getElementById('stopwatchReset');
        this.lapBtn = document.getElementById('stopwatchLap');
        
        // Lista de vueltas
        this.lapsList = document.getElementById('lapsList');
        this.lapsTitle = document.getElementById('lapsTitle');
        this.lapsCount = document.getElementById('lapsCount');
        
        // Estadísticas
        this.statsContainer = document.getElementById('statsContainer');
        this.statsGrid = document.getElementById('statsGrid');
        this.bestLapElement = document.getElementById('bestLap');
        this.avgLapElement = document.getElementById('avgLap');
        this.totalTimeElement = document.getElementById('totalTime');
        this.lapCountElement = document.getElementById('lapCount');
    }
    
    initEventListeners() {
        // Botones de control
        this.startBtn.addEventListener('click', () => {
            this.startStopwatch();
        });
        
        this.stopBtn.addEventListener('click', () => {
            this.stopStopwatch();
        });
        
        this.lapBtn.addEventListener('click', () => {
            this.recordLap();
        });
        
        this.resetBtn.addEventListener('click', () => {
            this.resetStopwatch();
        });
        
        // Teclas de acceso rápido
        document.addEventListener('keydown', (e) => {
            if (e.code === 'Space') {
                e.preventDefault();
                if (this.isRunning) {
                    this.stopStopwatch();
                } else {
                    this.startStopwatch();
                }
            } else if (e.code === 'KeyL' && this.isRunning) {
                this.recordLap();
            } else if (e.code === 'KeyR') {
                this.resetStopwatch();
            }
        });
    }
    
    startStopwatch() {
        if (!this.isRunning) {
            if (this.isPaused) {
                // Reanudar desde pausa
                this.totalPausedTime += Date.now() - this.pauseTime;
            } else {
                // Iniciar nuevo cronómetro
                this.startTime = Date.now();
                this.totalPausedTime = 0;
                this.laps = [];
            }
            
            this.isRunning = true;
            this.isPaused = false;
            this.interval = setInterval(() => this.updateDisplay(), 10);
            this.updateButtons();
            this.updateStatus('Ejecutándose');
        }
    }
    
    stopStopwatch() {
        if (this.isRunning) {
            this.isRunning = false;
            this.isPaused = true;
            this.pauseTime = Date.now();
            clearInterval(this.interval);
            this.updateButtons();
            this.updateStatus('Pausado');
        }
    }
    
    resetStopwatch() {
        this.isRunning = false;
        this.isPaused = false;
        this.startTime = 0;
        this.pauseTime = 0;
        this.totalPausedTime = 0;
        this.laps = [];
        clearInterval(this.interval);
        this.updateDisplay();
        this.updateButtons();
        this.updateStatus('Listo');
        this.updateLapsList();
        this.updateStats();
    }
    
    recordLap() {
        if (this.isRunning) {
            const currentTime = this.getCurrentTime();
            const lapTime = currentTime - (this.laps.length > 0 ? this.laps[this.laps.length - 1].totalTime : 0);
            
            this.laps.push({
                number: this.laps.length + 1,
                lapTime: lapTime,
                totalTime: currentTime
            });
            
            this.updateLapsList();
            this.updateStats();
            
            // Efecto visual de vuelta registrada
            this.showLapEffect();
        }
    }
    
    getCurrentTime() {
        if (!this.isRunning && !this.isPaused) return 0;
        
        const currentTime = this.isRunning ? Date.now() : this.pauseTime;
        return currentTime - this.startTime - this.totalPausedTime;
    }
    
    updateDisplay() {
        const time = this.getCurrentTime();
        this.stopwatchDisplay.textContent = this.formatTime(time);
    }
    
    updateStatus(status) {
        this.stopwatchStatus.textContent = status;
    }
    
    updateButtons() {
        if (this.isRunning) {
            this.startBtn.disabled = true;
            this.stopBtn.disabled = false;
            this.lapBtn.disabled = false;
            this.resetBtn.disabled = false;
        } else if (this.isPaused) {
            this.startBtn.disabled = false;
            this.stopBtn.disabled = true;
            this.lapBtn.disabled = true;
            this.resetBtn.disabled = false;
        } else {
            this.startBtn.disabled = false;
            this.stopBtn.disabled = true;
            this.lapBtn.disabled = true;
            this.resetBtn.disabled = true;
        }
    }
    
    updateLapsList() {
        if (this.laps.length === 0) {
            this.lapsList.innerHTML = '<div class="no-laps">No hay vueltas registradas</div>';
            this.lapsCount.textContent = '0';
            this.lapsTitle.textContent = 'Vueltas';
            return;
        }
        
        this.lapsCount.textContent = this.laps.length;
        this.lapsTitle.textContent = this.laps.length === 1 ? 'Vuelta' : 'Vueltas';
        
        this.lapsList.innerHTML = '';
        
        this.laps.forEach((lap, index) => {
            const lapElement = document.createElement('div');
            lapElement.className = 'lap-item';
            
            const isBestLap = this.laps.length > 1 && lap.lapTime === Math.min(...this.laps.map(l => l.lapTime));
            const isWorstLap = this.laps.length > 1 && lap.lapTime === Math.max(...this.laps.map(l => l.lapTime));
            
            if (isBestLap) lapElement.classList.add('best-lap');
            if (isWorstLap) lapElement.classList.add('worst-lap');
            
            const lapInfo = document.createElement('div');
            lapInfo.className = 'lap-info';
            
            const lapNumber = document.createElement('span');
            lapNumber.className = 'lap-number';
            lapNumber.textContent = `Vuelta ${lap.number}`;
            
            const lapTime = document.createElement('span');
            lapTime.className = 'lap-time';
            lapTime.textContent = this.formatTime(lap.lapTime);
            
            const totalTime = document.createElement('span');
            totalTime.className = 'total-time';
            totalTime.textContent = this.formatTime(lap.totalTime);
            
            lapInfo.appendChild(lapNumber);
            lapInfo.appendChild(lapTime);
            lapInfo.appendChild(totalTime);
            
            lapElement.appendChild(lapInfo);
            this.lapsList.appendChild(lapElement);
        });
    }
    
    updateStats() {
        if (this.laps.length === 0) {
            this.statsContainer.style.display = 'none';
            return;
        }
        
        this.statsContainer.style.display = 'block';
        
        const lapTimes = this.laps.map(lap => lap.lapTime);
        const bestLap = Math.min(...lapTimes);
        const avgLap = lapTimes.reduce((sum, time) => sum + time, 0) / lapTimes.length;
        const totalTime = this.laps[this.laps.length - 1].totalTime;
        
        this.bestLapElement.textContent = this.formatTime(bestLap);
        this.avgLapElement.textContent = this.formatTime(avgLap);
        this.totalTimeElement.textContent = this.formatTime(totalTime);
        this.lapCountElement.textContent = this.laps.length;
    }
    
    showLapEffect() {
        // Efecto visual cuando se registra una vuelta
        const lapBtn = this.lapBtn;
        lapBtn.style.transform = 'scale(0.95)';
        setTimeout(() => {
            lapBtn.style.transform = '';
        }, 150);
    }
    
    formatTime(milliseconds) {
        const totalSeconds = Math.floor(milliseconds / 1000);
        const minutes = Math.floor(totalSeconds / 60);
        const seconds = totalSeconds % 60;
        const centiseconds = Math.floor((milliseconds % 1000) / 10);
        
        return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}.${centiseconds.toString().padStart(2, '0')}`;
    }
}

// Inicializar la sección de cronómetro
function initStopwatchSection() {
    if (typeof window.stopwatchManager === 'undefined') {
        window.stopwatchManager = new Stopwatch();
    }
}

// Inicializar cuando el DOM esté listo
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initStopwatchSection);
} else {
    initStopwatchSection();
} 