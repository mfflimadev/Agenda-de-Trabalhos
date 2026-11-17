<script setup>
import { useRouter } from 'vue-router';
import { adicionarEntrega } from '../entregas.js';
import FormularioEntrega from '../components/FormularioEntrega.vue';

const router = useRouter();

// Guarda a entrega e volta para a agenda.
function adicionarEVoltar(entrega) {
    adicionarEntrega(entrega);
    router.push('/');
}
</script>

<template>
    <main class="painel painel-estreito">
        <section class="cartao nova-entrega">
            <FormularioEntrega @adicionar="adicionarEVoltar" />
        </section>
    </main>
</template>
