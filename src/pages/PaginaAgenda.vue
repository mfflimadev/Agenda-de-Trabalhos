<script setup>
import { ref, computed } from 'vue';
import {
    ordenarPorData,
    filtrarPendentes,
    montarTextoDaProxima,
    encontrarProxima,
    passaNoFiltro
} from '../agenda.js';
import { entregas, alternarFeita, apagarEntrega } from '../entregas.js';
import ResumoAgenda from '../components/ResumoAgenda.vue';
import ItemEntrega from '../components/ItemEntrega.vue';

const tipoEscolhido = ref('todos');

const pendentes = computed(() => filtrarPendentes(entregas.value).length);
const proxima = computed(() => montarTextoDaProxima(entregas.value));
const mostradas = computed(() => ordenarPorData(entregas.value.filter((entrega) => passaNoFiltro(entrega, tipoEscolhido.value))));

// Para onde o link da próxima entrega aponta (vazio se não houver).
const destino = computed(() => {
    const entrega = encontrarProxima(entregas.value);
    if (entrega === undefined) {
        return '';
    }
    return `/entrega/${entrega.id}`;
});
</script>

<template>
    <main class="painel">

        <ResumoAgenda :pendentes="pendentes" :proxima="proxima" :destino="destino" />

        <section class="cartao entregas">
            <h2>Próximas entregas</h2>

            <p class="filtro">
                <label for="filtro">Mostrar</label>
                <select id="filtro" class="campo-filtro" v-model="tipoEscolhido">
                    <option value="todos">Tudo</option>
                    <option value="prova">Só provas</option>
                    <option value="trabalho">Só trabalhos</option>
                    <option value="apresentacao">Só apresentações</option>
                </select>
            </p>

            <ul class="lista">
                <ItemEntrega
                    v-for="entrega in mostradas"
                    :key="entrega.id"
                    :entrega="entrega"
                    @alternar="alternarFeita"
                    @apagar="apagarEntrega"
                />
            </ul>
        </section>

    </main>
</template>
