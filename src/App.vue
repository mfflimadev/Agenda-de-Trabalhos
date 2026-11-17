<script setup>
import { useRouter } from 'vue-router';

const router = useRouter();

function voltar() {
    router.back();
}

function avancar() {
    router.forward();
}
</script>

<template>
    <header class="topo">
        <h1>Agenda de entregas</h1>
        <p>Provas, trabalhos e apresentações em um só lugar.</p>
    </header>

    <nav class="menu">
        <button type="button" class="seta" aria-label="Voltar" @click="voltar">←</button>
        <RouterLink to="/">Agenda</RouterLink>
        <RouterLink to="/nova">Nova entrega</RouterLink>
        <button type="button" class="seta" aria-label="Avançar" @click="avancar">→</button>
    </nav>

    <RouterView />

    <footer class="rodape">
        <p>Feito por Manuel</p>
    </footer>
</template>
