import { createRouter, createWebHashHistory } from 'vue-router';
import PaginaAgenda from './pages/PaginaAgenda.vue';
import PaginaNovaEntrega from './pages/PaginaNovaEntrega.vue';
import PaginaEntrega from './pages/PaginaEntrega.vue';

// Endereços com # (#/, #/nova, #/entrega/2): funcionam em qualquer servidor.
const router = createRouter({
    history: createWebHashHistory(),
    routes: [
        { path: '/', component: PaginaAgenda },
        { path: '/nova', component: PaginaNovaEntrega },
        { path: '/entrega/:id', component: PaginaEntrega }
    ]
});

export default router;
