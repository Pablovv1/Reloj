// Clase para manejar el tema de la aplicación
class ThemeManager {
    constructor() {
        this.currentTheme = 'auto';
        this.themes = ['auto', 'light', 'dark'];
        this.init();
    }
    
    init() {
        this.loadSettings();
        this.applyTheme();
        this.detectSystemPreference();
        this.listenForSystemChanges();
    }
    
    loadSettings() {
        const savedSettings = localStorage.getItem('relojSettings');
        if (savedSettings) {
            try {
                const settings = JSON.parse(savedSettings);
                this.currentTheme = settings.theme || 'auto';
            } catch (error) {
                console.error('Error al cargar tema:', error);
            }
        }
    }
    
    setTheme(theme) {
        if (this.themes.includes(theme)) {
            this.currentTheme = theme;
            this.applyTheme();
            this.saveSettings();
            console.log('Tema cambiado a:', theme);
            
            // Disparar evento personalizado
            window.dispatchEvent(new CustomEvent('themeChanged', {
                detail: { theme: this.currentTheme }
            }));
        }
    }
    
    applyTheme() {
        const root = document.documentElement;
        
        // Remover todos los atributos de tema anteriores
        root.removeAttribute('data-theme');
        
        if (this.currentTheme === 'auto') {
            // Aplicar tema automático basado en preferencias del sistema
            this.applySystemTheme();
        } else {
            // Aplicar tema específico
            root.setAttribute('data-theme', this.currentTheme);
        }
        
        console.log('Tema aplicado:', this.currentTheme);
    }
    
    applySystemTheme() {
        const root = document.documentElement;
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        
        if (prefersDark) {
            root.setAttribute('data-theme', 'dark');
        } else {
            root.setAttribute('data-theme', 'light');
        }
    }
    
    detectSystemPreference() {
        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
        
        // Aplicar tema inicial basado en preferencia del sistema
        if (this.currentTheme === 'auto') {
            this.applySystemTheme();
        }
    }
    
    listenForSystemChanges() {
        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
        
        mediaQuery.addEventListener('change', (e) => {
            if (this.currentTheme === 'auto') {
                this.applySystemTheme();
                console.log('Tema del sistema cambiado, aplicando automáticamente');
            }
        });
    }
    
    getCurrentTheme() {
        return this.currentTheme;
    }
    
    getAvailableThemes() {
        return this.themes.map(theme => ({
            value: theme,
            label: this.getThemeLabel(theme)
        }));
    }
    
    getThemeLabel(theme) {
        const labels = {
            'auto': 'Automático (Sistema)',
            'light': 'Claro',
            'dark': 'Oscuro'
        };
        return labels[theme] || theme;
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
        
        settings.theme = this.currentTheme;
        localStorage.setItem('relojSettings', JSON.stringify(settings));
    }
    
    // Método para obtener el tema actual aplicado (útil para componentes)
    getAppliedTheme() {
        if (this.currentTheme === 'auto') {
            return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
        }
        return this.currentTheme;
    }
    
    // Método para verificar si el tema actual es oscuro
    isDarkTheme() {
        return this.getAppliedTheme() === 'dark';
    }
    
    // Método para verificar si el tema actual es claro
    isLightTheme() {
        return this.getAppliedTheme() === 'light';
    }
    
    // Método para alternar entre temas claro y oscuro
    toggleTheme() {
        const appliedTheme = this.getAppliedTheme();
        const newTheme = appliedTheme === 'dark' ? 'light' : 'dark';
        this.setTheme(newTheme);
    }
}

// Función para inicializar el gestor de tema
function initTheme() {
    window.themeManager = new ThemeManager();
    console.log('Gestor de tema inicializado');
}

// Inicializar cuando el DOM esté listo
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initTheme);
} else {
    initTheme();
} 