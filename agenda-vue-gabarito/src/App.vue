<script setup>
import { ref, computed, watch } from 'vue';
import {
    ordenarPorData,
    filtrarPendentes,
    passaNoFiltro,
    montarTextoDaProxima
} from './agenda.js';
import ResumoAgenda from './components/ResumoAgenda.vue';
import ItemEntrega from './components/ItemEntrega.vue';
import FormularioEntrega from './components/FormularioEntrega.vue';

const CHAVE = 'agenda-de-entregas';

const ENTREGAS_DE_EXEMPLO = [
    { id: 1, materia: 'Matemática', tipo: 'prova', data: '2026-11-18', feita: false },
    { id: 2, materia: 'História', tipo: 'trabalho', data: '2026-11-25', feita: false },
    { id: 3, materia: 'Português', tipo: 'trabalho', data: '2026-11-10', feita: true },
    { id: 4, materia: 'Inglês', tipo: 'apresentacao', data: '2026-11-20', feita: false }
];

// Começa com o que estiver salvo, ou com os exemplos.
function carregarEntregas() {
    const salvo = localStorage.getItem(CHAVE);
    if (salvo !== null) {
        try {
            const lido = JSON.parse(salvo);
            if (Array.isArray(lido)) {
                return lido;
            }
        } catch (erro) {
            // dado corrompido: cai nos exemplos
        }
    }
    return ENTREGAS_DE_EXEMPLO.map((entrega) => ({ ...entrega }));
}

const entregas = ref(carregarEntregas());

// O tipo escolhido no select "Mostrar"
const tipoEscolhido = ref('todos');

// Filtradas E ordenadas (só para a tela)
const entregasVisiveis = computed(() => {
    const filtradas = entregas.value.filter((entrega) => {
        return passaNoFiltro(entrega, tipoEscolhido.value);
    });
    return ordenarPorData(filtradas);
});

// O resumo conta todas as entregas, o filtro não interfere.
const quantidadeDePendentes = computed(() => filtrarPendentes(entregas.value).length);
const textoDaProxima = computed(() => montarTextoDaProxima(entregas.value));

// Chega pronta do FormularioEntrega: só entra na lista.
function adicionarEntrega(entrega) {
    entregas.value.push(entrega);
}

function alternarFeita(entrega) {
    entrega.feita = !entrega.feita;
}

// A lista da tela está ordenada, então a posição dela não serve:
// procura a entrega na lista de verdade.
function apagarEntrega(entrega) {
    const posicao = entregas.value.indexOf(entrega);
    if (posicao !== -1) {
        entregas.value.splice(posicao, 1);
    }
}

// Toda mudança na lista é salva (o deep percebe o Feita).
watch(entregas, () => {
    localStorage.setItem(CHAVE, JSON.stringify(entregas.value));
}, { deep: true });
</script>

<template>
    <header class="topo">
        <h1>Agenda de entregas</h1>
        <p>Provas, trabalhos e apresentações em um só lugar.</p>
    </header>

    <main class="painel">

        <ResumoAgenda :pendentes="quantidadeDePendentes" :proxima="textoDaProxima" />

        <section class="cartao nova-entrega">
            <FormularioEntrega @adicionar="adicionarEntrega" />
        </section>

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
                <ItemEntrega v-for="entrega in entregasVisiveis" :key="entrega.id" :entrega="entrega"
                    @alternar="alternarFeita" @apagar="apagarEntrega" />
            </ul>
        </section>

    </main>

    <footer class="rodape">
        <p>Feito por Gui</p>
    </footer>
</template>
