// Clase para manejar el tamaño de fuente
class FontSizeManager {
    constructor() {
        this.currentSize = 'medium';
        this.sizes = {
            'small': 'var(--font-size-small)',
            'medium': 'var(--font-size-medium)',
            'large': 'var(--font-size-large)',
            'xlarge': 'var(--font-size-xlarge)'
        };
        this.init();
    }
    
    init() {
        this.loadSettings();
        this.applyFontSize();
    }
    
    loadSettings() {
        const savedSettings = localStorage.getItem('relojSettings');
        if (savedSettings) {
            try {
                const settings = JSON.parse(savedSettings);
                this.currentSize = settings.fontSize || 'medium';
            } catch (error) {
                console.error('Error al cargar tamaño de fuente:', error);
            }
        }
    }
    
    applyFontSize() {
        const root = document.documentElement;
        const fontSize = this.sizes[this.currentSize] || this.sizes.medium;
        // Aplicar tamaño global
        root.style.setProperty('--font-size-global', `var(--font-size-${this.currentSize})`);
        console.log('Tamaño de fuente global aplicado:', this.currentSize);
    }
    
    setFontSize(size) {
        if (this.sizes[size]) {
            this.currentSize = size;
            this.applyFontSize();
        } else {
            console.warn('Tamaño de fuente no válido:', size);
        }
    }
    
    getCurrentSize() {
        return this.currentSize;
    }
    
    getCurrentSizeValue() {
        return this.sizes[this.currentSize];
    }
    
    getSizeLabel(size) {
        const labels = {
            'small': 'Pequeña',
            'medium': 'Mediana',
            'large': 'Grande',
            'xlarge': 'Extra Grande'
        };
        return labels[size] || 'Mediana';
    }
    
    // Métodos para cambiar tamaño
    increaseSize() {
        const sizes = ['small', 'medium', 'large', 'xlarge'];
        const currentIndex = sizes.indexOf(this.currentSize);
        const nextIndex = Math.min(currentIndex + 1, sizes.length - 1);
        this.setFontSize(sizes[nextIndex]);
    }
    
    decreaseSize() {
        const sizes = ['small', 'medium', 'large', 'xlarge'];
        const currentIndex = sizes.indexOf(this.currentSize);
        const prevIndex = Math.max(currentIndex - 1, 0);
        this.setFontSize(sizes[prevIndex]);
    }
    
    // Método para obtener el rango del slider
    getRangeFromSize(size) {
        const sizes = ['small', 'medium', 'large', 'xlarge'];
        const index = sizes.indexOf(size);
        return Math.max(1, (index + 1) * 33.33);
    }
    
    // Método para obtener el tamaño desde el rango
    getSizeFromRange(rangeValue) {
        const sizes = ['small', 'medium', 'large', 'xlarge'];
        const index = Math.floor((rangeValue - 1) / 33.33);
        return sizes[Math.min(index, sizes.length - 1)];
    }
    
    // Método para aplicar zoom específico
    applyZoom(zoomLevel) {
        const root = document.documentElement;
        const baseSize = this.sizes[this.currentSize];
        const zoomedSize = `calc(${baseSize} * ${zoomLevel})`;
        
        root.style.setProperty('--base-font-size', zoomedSize);
        this.applyFontSize();
    }
    
    // Método para resetear zoom
    resetZoom() {
        this.applyFontSize();
    }
    
    // Método para verificar si el tamaño es accesible
    isAccessibleSize() {
        return this.currentSize === 'large' || this.currentSize === 'xlarge';
    }
    
    // Método para obtener recomendación de tamaño
    getRecommendedSize() {
        // Detectar preferencias del sistema
        if (window.matchMedia) {
            const prefersLarge = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
            if (prefersLarge) {
                return 'large';
            }
        }
        return 'medium';
    }
}

// Función para inicializar el tamaño de fuente
function initFontSize() {
    window.fontSizeManager = new FontSizeManager();
    console.log('Gestor de tamaño de fuente inicializado');
}

// Inicializar cuando el DOM esté listo
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initFontSize);
} else {
    initFontSize();
} 