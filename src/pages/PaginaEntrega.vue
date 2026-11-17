<script setup>
import { computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { formatarData, nomearTipo } from '../agenda.js';
import { entregas, alternarFeita, apagarEntrega } from '../entregas.js';

const route = useRoute();
const router = useRouter();

// O id vem do endereço como texto: vira número para comparar.
// Se não existir nenhuma, o find devolve undefined.
const entrega = computed(() => {
    return entregas.value.find((item) => item.id === Number(route.params.id));
});

function voltar() {
    router.back();
}

// replace troca a página atual: a entrega apagada não fica no voltar.
function apagarEIr() {
    apagarEntrega(entrega.value);
    router.replace('/');
}
</script>

<template>
    <main class="painel painel-estreito">

        <section v-if="entrega" class="cartao detalhe" :data-tipo="entrega.tipo">
            <h2>{{ entrega.materia }}</h2>
            <p><span class="etiqueta">{{ nomearTipo(entrega.tipo) }}</span></p>

            <p class="detalhe-linha">
                <span class="rotulo">Data</span>
                <strong>{{ formatarData(entrega.data) }}</strong>
            </p>
            <p class="detalhe-linha">
                <span class="rotulo">Situação</span>
                <strong>{{ entrega.feita ? 'Já foi feita' : 'Ainda pendente' }}</strong>
            </p>

            <div class="acoes">
                <button type="button" @click="voltar">Voltar</button>
                <button type="button" @click="alternarFeita(entrega)">
                    {{ entrega.feita ? 'Reabrir' : 'Marcar como feita' }}
                </button>
                <button type="button" class="botao-apagar" @click="apagarEIr">Apagar</button>
            </div>
        </section>

        <section v-else class="cartao">
            <h2>Entrega não encontrada</h2>
            <RouterLink to="/">Voltar para a agenda</RouterLink>
        </section>

    </main>
</template>
