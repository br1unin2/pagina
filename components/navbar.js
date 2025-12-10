// components/navbar.js - Con color sólido #99c528
class CustomNavbar extends HTMLElement {
    connectedCallback() {
        this.innerHTML = `
            <nav class="bg-white shadow-lg sticky top-0 z-50">
                <div class="container mx-auto px-4">
                    <div class="flex justify-between items-center py-4">
                        <div class="flex items-center">
                            <img src="icons/icono.png" alt="Revolución Box" class="w-8 h-8 mr-2">
                            <span class="text-xl font-bold text-gray-800">Revolución Box</span>
                        </div>
                        
                        <div class="hidden md:flex space-x-8">
                            <a href="#inicio" class="text-gray-600 hover:text-[#99c528] transition nav-link font-medium">Inicio</a>
                            <a href="#contacto" class="text-gray-600 hover:text-[#99c528] transition nav-link font-medium">Contacto</a>
                        </div>
                        
                        <button class="bg-[#99c528] text-white px-6 py-2 rounded-lg hover:bg-[#8ab324] transition font-semibold shadow-lg">
                            Únete Ahora
                        </button>
                    </div>
                </div>
            </nav>
        `;
    }
}

customElements.define('custom-navbar', CustomNavbar);