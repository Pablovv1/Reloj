// Clase para manejar la funcionalidad de Configuración
class Configuration {
    constructor() {
        this.settings = {
            timeFormat: '24h',
            timezone: 'local',
            theme: 'auto',
            sounds: true,
            language: 'es',
            animations: true,
            fontSize: 'medium'
        };
        
        this.initElements();
        this.initEventListeners();
        this.loadSettings();
        this.updateUI();
        
        // Inicializar secciones específicas
        this.initTimezoneSection();
        this.initThemeSection();
        this.initAnimationsSection();
        this.initSoundsSection();
        this.initLanguageSection();
    }
    
    initElements() {
        // Elementos del modal
        this.configModal = document.getElementById('configModal');
        this.configOverlay = document.getElementById('configOverlay');
        this.configContent = document.getElementById('configContent');
        
        // Botón de configuración
        this.configBtn = document.getElementById('settingsBtn');
        
        // Opciones de configuración
        this.timeFormatSelect = document.getElementById('timeFormat');
        this.timezoneSelect = document.getElementById('timezone');
        this.themeSelect = document.getElementById('theme');
        this.soundsToggle = document.getElementById('sounds');
        this.languageSelect = document.getElementById('language');
        this.animationsToggle = document.getElementById('animations');
        this.fontSizeRange = document.getElementById('fontSize');
        this.fontSizeValue = document.getElementById('fontSizeValue');
        
        // Botones de acción
        this.saveBtn = document.getElementById('saveConfig');
        this.resetBtn = document.getElementById('resetConfig');
        this.cancelBtn = document.getElementById('cancelConfig');
        
        // Mensaje de confirmación
        this.configMessage = document.getElementById('configMessage');
    }
    
    initEventListeners() {
        // Abrir modal
        this.configBtn.addEventListener('click', () => {
            this.openModal();
        });
        
        // Cerrar modal
        this.configOverlay.addEventListener('click', (e) => {
            if (e.target === this.configOverlay) {
                this.closeModal();
            }
        });
        
        // Botones de acción
        this.saveBtn.addEventListener('click', () => {
            this.saveSettings();
        });
        
        this.resetBtn.addEventListener('click', () => {
            this.resetSettings();
        });
        
        this.cancelBtn.addEventListener('click', () => {
            this.closeModal();
        });
        
        // Actualizar valor del rango de tamaño de fuente
        this.fontSizeRange.addEventListener('input', (e) => {
            this.updateFontSizeValue(e.target.value);
            // Aplicar cambio en tiempo real
            const newFontSize = this.getFontSizeFromRange(e.target.value);
            this.settings.fontSize = newFontSize;
            this.applyFontSize();
        });
        
        // Teclas de acceso rápido
        document.addEventListener('keydown', (e) => {
            if (e.code === 'Escape' && this.isModalOpen()) {
                this.closeModal();
            }
        });
    }
    
    openModal() {
        this.configModal.style.display = 'flex';
        this.configContent.style.transform = 'scale(0.9)';
        this.configContent.style.opacity = '0';
        
        setTimeout(() => {
            this.configContent.style.transform = 'scale(1)';
            this.configContent.style.opacity = '1';
        }, 10);
        
        document.body.style.overflow = 'hidden';
    }
    
    closeModal() {
        this.configContent.style.transform = 'scale(0.9)';
        this.configContent.style.opacity = '0';
        
        setTimeout(() => {
            this.configModal.style.display = 'none';
            document.body.style.overflow = '';
        }, 200);
    }
    
    isModalOpen() {
        return this.configModal.style.display === 'flex';
    }
    
    loadSettings() {
        const savedSettings = localStorage.getItem('relojSettings');
        if (savedSettings) {
            try {
                this.settings = { ...this.settings, ...JSON.parse(savedSettings) };
            } catch (error) {
                console.error('Error al cargar configuración:', error);
            }
        }
    }
    
    saveSettings() {
        // Recopilar valores actuales
        this.settings.timeFormat = this.timeFormatSelect.value;
        this.settings.timezone = this.timezoneSelect.value;
        this.settings.theme = this.themeSelect.value;
        this.settings.sounds = this.soundsToggle.classList.contains('active');
        this.settings.language = this.languageSelect.value;
        this.settings.animations = this.animationsToggle.classList.contains('active');
        this.settings.fontSize = this.getFontSizeFromRange(this.fontSizeRange.value);
        
        // Guardar en localStorage
        try {
            localStorage.setItem('relojSettings', JSON.stringify(this.settings));
            this.showMessage('Configuración guardada exitosamente', 'success');
            this.applySettings();
        } catch (error) {
            console.error('Error al guardar configuración:', error);
            this.showMessage('Error al guardar la configuración', 'error');
        }
    }
    
    resetSettings() {
        if (confirm('¿Estás seguro de que quieres restablecer todas las configuraciones?')) {
            this.settings = {
                timeFormat: '24h',
                timezone: 'local',
                theme: 'auto',
                sounds: true,
                language: 'es',
                animations: true,
                fontSize: 'medium'
            };
            
            localStorage.removeItem('relojSettings');
            this.updateUI();
            this.applySettings();
            this.showMessage('Configuración restablecida', 'success');
        }
    }
    
    updateUI() {
        // Actualizar selects
        this.timeFormatSelect.value = this.settings.timeFormat;
        this.timezoneSelect.value = this.settings.timezone;
        this.themeSelect.value = this.settings.theme;
        this.languageSelect.value = this.settings.language;
        
        // Actualizar toggles
        this.updateToggle(this.soundsToggle, this.settings.sounds);
        this.updateToggle(this.animationsToggle, this.settings.animations);
        
        // Actualizar rango de tamaño de fuente
        this.fontSizeRange.value = this.getRangeFromFontSize(this.settings.fontSize);
        this.updateFontSizeValue(this.fontSizeRange.value);
    }
    
    updateToggle(toggleElement, isActive) {
        if (isActive) {
            toggleElement.classList.add('active');
        } else {
            toggleElement.classList.remove('active');
        }
    }
    
    updateFontSizeValue(value) {
        const fontSize = this.getFontSizeFromRange(value);
        this.fontSizeValue.textContent = this.getFontSizeLabel(fontSize);
    }
    
    getFontSizeFromRange(rangeValue) {
        const sizes = ['small', 'medium', 'large', 'xlarge'];
        const index = Math.floor((rangeValue - 1) / 33.33);
        return sizes[Math.min(index, sizes.length - 1)];
    }
    
    getRangeFromFontSize(fontSize) {
        const sizes = ['small', 'medium', 'large', 'xlarge'];
        const index = sizes.indexOf(fontSize);
        return Math.max(1, (index + 1) * 33.33);
    }
    
    getFontSizeLabel(fontSize) {
        const labels = {
            'small': 'Pequeña',
            'medium': 'Mediana',
            'large': 'Grande',
            'xlarge': 'Extra Grande'
        };
        return labels[fontSize] || 'Mediana';
    }
    
    applySettings() {
        // Aplicar formato de hora
        this.applyTimeFormat();
        
        // Aplicar zona horaria
        this.applyTimezone();
        
        // Aplicar tema
        this.applyTheme();
        
        // Aplicar sonidos
        this.applySounds();
        
        // Aplicar idioma
        this.applyLanguage();
        
        // Aplicar animaciones
        this.applyAnimations();
        
        // Aplicar tamaño de fuente
        this.applyFontSize();
        
        // Disparar evento personalizado para notificar cambios
        window.dispatchEvent(new CustomEvent('settingsChanged', {
            detail: this.settings
        }));
    }
    
    applyTimeFormat() {
        if (window.timeFormatManager && typeof window.timeFormatManager.setFormat === 'function') {
            window.timeFormatManager.setFormat(this.settings.timeFormat);
        } else {
            // Si no está disponible, intentar de nuevo en 100ms
            setTimeout(() => {
                this.applyTimeFormat();
            }, 100);
        }
        console.log('Aplicando formato de hora:', this.settings.timeFormat);
    }
    
    applyTimezone() {
        if (window.timezoneManager && typeof window.timezoneManager.setTimezone === 'function') {
            window.timezoneManager.setTimezone(this.settings.timezone);
        } else {
            setTimeout(() => {
                this.applyTimezone();
            }, 100);
        }
        console.log('Aplicando zona horaria:', this.settings.timezone);
    }
    
    applyTheme() {
        if (window.themeManager && typeof window.themeManager.setTheme === 'function') {
            window.themeManager.setTheme(this.settings.theme);
        } else {
            setTimeout(() => {
                this.applyTheme();
            }, 100);
        }
    }
    
    applySounds() {
        if (window.soundManager) {
            if (this.settings.sounds && typeof window.soundManager.enableSounds === 'function') {
                window.soundManager.enableSounds();
            } else if (!this.settings.sounds && typeof window.soundManager.disableSounds === 'function') {
                window.soundManager.disableSounds();
            } else {
                setTimeout(() => {
                    this.applySounds();
                }, 100);
            }
        }
        console.log('Aplicando configuración de sonidos:', this.settings.sounds);
    }
    
    applyLanguage() {
        if (window.languageManager && typeof window.languageManager.setLanguage === 'function') {
            window.languageManager.setLanguage(this.settings.language);
        } else {
            setTimeout(() => {
                this.applyLanguage();
            }, 100);
        }
        console.log('Aplicando idioma:', this.settings.language);
    }
    
    applyAnimations() {
        if (window.animationManager) {
            if (this.settings.animations && typeof window.animationManager.enableAnimations === 'function') {
                window.animationManager.enableAnimations();
            } else if (!this.settings.animations && typeof window.animationManager.disableAnimations === 'function') {
                window.animationManager.disableAnimations();
            } else {
                setTimeout(() => {
                    this.applyAnimations();
                }, 100);
            }
        }
    }
    
    applyFontSize() {
        if (window.fontSizeManager && typeof window.fontSizeManager.setFontSize === 'function') {
            window.fontSizeManager.setFontSize(this.settings.fontSize);
            // Guardar configuración automáticamente sin llamar a applySettings para evitar recursión
            try {
                localStorage.setItem('relojSettings', JSON.stringify(this.settings));
            } catch (error) {
                console.error('Error al guardar configuración de tamaño de fuente:', error);
            }
        } else {
            setTimeout(() => {
                this.applyFontSize();
            }, 100);
        }
    }
    
    showMessage(message, type = 'success') {
        this.configMessage.textContent = message;
        this.configMessage.className = `config-message ${type}`;
        this.configMessage.classList.add('show');
        
        setTimeout(() => {
            this.configMessage.classList.remove('show');
        }, 3000);
    }
    
    getSettings() {
        return { ...this.settings };
    }
    
    initTimezoneSection() {
        // Cargar zonas horarias disponibles
        this.loadTimezoneOptions();
        
        // Event listener para cambio de zona horaria
        this.timezoneSelect.addEventListener('change', (e) => {
            this.settings.timezone = e.target.value;
            this.saveSettings();
            this.applyTimezone();
        });
    }
    
    async loadTimezoneOptions() {
        // Esperar a que el gestor de zona horaria esté disponible
        if (window.timezoneManager && typeof window.timezoneManager.getAvailableTimezones === 'function') {
            const timezones = window.timezoneManager.getAvailableTimezones();
            this.populateTimezoneSelect(timezones);
        } else {
            // Si no está disponible, intentar de nuevo en 500ms
            setTimeout(() => {
                this.loadTimezoneOptions();
            }, 500);
        }
    }
    
    populateTimezoneSelect(timezones) {
        this.timezoneSelect.innerHTML = '';
        
        timezones.forEach(tz => {
            const option = document.createElement('option');
            option.value = tz.value;
            option.textContent = tz.label;
            this.timezoneSelect.appendChild(option);
        });
        
        // Establecer el valor actual
        this.timezoneSelect.value = this.settings.timezone;
    }
    
    initThemeSection() {
        // Cargar temas disponibles
        this.loadThemeOptions();
        
        // Event listener para cambio de tema
        this.themeSelect.addEventListener('change', (e) => {
            this.settings.theme = e.target.value;
            this.saveSettings();
            this.applyTheme();
        });
    }
    
    loadThemeOptions() {
        // Esperar a que el gestor de tema esté disponible
        if (window.themeManager && typeof window.themeManager.getAvailableThemes === 'function') {
            const themes = window.themeManager.getAvailableThemes();
            this.populateThemeSelect(themes);
        } else {
            // Si no está disponible, intentar de nuevo en 500ms
            setTimeout(() => {
                this.loadThemeOptions();
            }, 500);
        }
    }
    
    populateThemeSelect(themes) {
        this.themeSelect.innerHTML = '';
        
        themes.forEach(theme => {
            const option = document.createElement('option');
            option.value = theme.value;
            option.textContent = theme.label;
            this.themeSelect.appendChild(option);
        });
        
        // Establecer el valor actual
        this.themeSelect.value = this.settings.theme;
    }
    
    initAnimationsSection() {
        // Event listener para el toggle de animaciones
        this.animationsToggle.addEventListener('click', () => {
            this.settings.animations = !this.settings.animations;
            this.updateToggle(this.animationsToggle, this.settings.animations);
            this.saveSettings();
            this.applyAnimations();
            
            // Mostrar mensaje de confirmación
            const status = this.settings.animations ? 'habilitadas' : 'deshabilitadas';
            this.showMessage(`Animaciones ${status}`, 'success');
        });
    }
    
    initSoundsSection() {
        // Event listener para el toggle de sonidos
        this.soundsToggle.addEventListener('click', () => {
            this.settings.sounds = !this.settings.sounds;
            this.updateToggle(this.soundsToggle, this.settings.sounds);
            this.saveSettings();
            this.applySounds();
            
            // Mostrar mensaje de confirmación
            const status = this.settings.sounds ? 'habilitados' : 'deshabilitados';
            this.showMessage(`Sonidos ${status}`, 'success');
        });
    }
    
    initLanguageSection() {
        // Cargar idiomas disponibles
        this.loadLanguageOptions();
        
        // Event listener para cambio de idioma
        this.languageSelect.addEventListener('change', (e) => {
            this.settings.language = e.target.value;
            this.saveSettings();
            if (window.languageManager) {
                window.languageManager.setLanguage(this.settings.language);
            }
            // Mostrar mensaje de confirmación
            const languageLabel = this.getLanguageLabel(this.settings.language);
            this.showMessage(`Idioma cambiado a ${languageLabel}`, 'success');
        });
    }
    
    loadLanguageOptions() {
        // Esperar a que el gestor de idioma esté disponible
        if (window.languageManager && typeof window.languageManager.getAvailableLanguages === 'function') {
            const languages = window.languageManager.getAvailableLanguages();
            this.populateLanguageSelect(languages);
        } else {
            // Si no está disponible, intentar de nuevo en 500ms
            setTimeout(() => {
                this.loadLanguageOptions();
            }, 500);
        }
    }
    
    populateLanguageSelect(languages) {
        this.languageSelect.innerHTML = '';
        
        languages.forEach(lang => {
            const option = document.createElement('option');
            option.value = lang.value;
            option.textContent = lang.label;
            this.languageSelect.appendChild(option);
        });
        
        // Establecer el valor actual
        this.languageSelect.value = this.settings.language;
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
}

// Función para inicializar la sección de configuración
function initConfigSection() {
    // Crear instancia de configuración
    window.configManager = new Configuration();
    
    // Aplicar configuración inicial
    window.configManager.applySettings();
    
    console.log('Sección de Configuración inicializada');
}

// Inicializar cuando el DOM esté listo
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initConfigSection);
} else {
    initConfigSection();
} 