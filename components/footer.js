// components/footer.js - Con color sólido #99c528
class CustomFooter extends HTMLElement {
    connectedCallback() {
        this.innerHTML = `
            <footer class="bg-gray-800 text-white py-8">
                <div class="container mx-auto px-4">
                    <div class="grid md:grid-cols-3 gap-8">
                        <div>
                            <h3 class="text-xl font-bold mb-4 text-[#99c528]">Revolución Box</h3>
                            <p class="text-gray-300">Transforma tu cuerpo y mente en nuestras instalaciones de primer nivel.</p>
                        </div>
                        
                        <div>
                            <h4 class="font-semibold mb-4">Enlaces Rápidos</h4>
                            <ul class="space-y-2">
                                <li><a href="#inicio" class="text-gray-300 hover:text-white transition">Inicio</a></li>
                                <li><a href="#contacto" class="text-gray-300 hover:text-white transition">Contacto</a></li>
                            </ul>
                        </div>
                        
                        <div>
                            <h4 class="font-semibold mb-4">Síguenos</h4>
                            <div class="flex space-x-4">
                                <a href="#" class="text-gray-300 hover:text-white transition">
                                    <i data-feather="facebook"></i>
                                </a>
                                <a href="#" class="text-gray-300 hover:text-white transition">
                                    <i data-feather="instagram"></i>
                                </a>
                                <a href="#" class="text-gray-300 hover:text-white transition">
                                    <i data-feather="twitter"></i>
                                </a>
                            </div>
                        </div>
                    </div>
                    
                    <div class="border-t border-gray-700 mt-8 pt-6 text-center text-gray-300">
                        <p>&copy; 2024 Revolución Box. Todos los derechos reservados.</p>
                    </div>
                </div>
            </footer>
        `;
    }
}

customElements.define('custom-footer', CustomFooter);