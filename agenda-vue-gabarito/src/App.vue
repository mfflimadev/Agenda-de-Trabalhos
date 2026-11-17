<script setup>
import { ref, computed, watch } from 'vue';
import {
    formatarData,
    nomearTipo,
    ordenarPorData,
    filtrarPendentes,
    passaNoFiltro,
    montarTextoDaProxima
} from './agenda.js';

const CHAVE = 'agenda-de-entregas';

const ENTREGAS_DE_EXEMPLO = [
    { id: 1, materia: 'Matemática', tipo: 'prova', data: '2026-11-18', feita: false },
    { id: 2, materia: 'História', tipo: 'trabalho', data: '2026-11-25', feita: false },
    { id: 3, materia: 'Português', tipo: 'trabalho', data: '2026-11-10', feita: true },
    { id: 4, materia: 'Inglês', tipo: 'apresentacao', data: '2026-11-20', feita: false }
];

// Passo 6: começa com o que estiver salvo, ou com os exemplos.
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

// Passo 3: um ref para cada campo do formulário
const materia = ref('');
const tipo = ref('');
const data = ref('');

// Passo 5: o tipo escolhido no select "Mostrar"
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

function adicionarEntrega() {
    const nome = materia.value.trim();
    if (nome === '') {
        materia.value = '';
        return;
    }

    entregas.value.push({
        id: Date.now(),
        materia: nome,
        tipo: tipo.value,
        data: data.value,
        feita: false
    });

    materia.value = '';
    tipo.value = '';
    data.value = '';
}

// Passo 4: Feita e Reabrir fazem a mesma coisa
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

// Passo 6: toda mudança na lista é salva. O deep é o que faz o
// watch perceber uma entrega que muda por dentro (Feita).
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

        <section class="cartao resumo">
            <h2>Resumo</h2>

            <div class="indicadores">
                <p class="indicador">
                    <span class="rotulo">Pendentes</span>
                    <strong class="pendentes">{{ quantidadeDePendentes }}</strong>
                </p>

                <p class="indicador">
                    <span class="rotulo">Próxima entrega</span>
                    <strong class="proxima">{{ textoDaProxima }}</strong>
                </p>
            </div>
        </section>

        <section class="cartao nova-entrega">
            <form class="formulario" @submit.prevent="adicionarEntrega">
                <fieldset>
                    <legend>Nova entrega</legend>

                    <p>
                        <label for="materia">Matéria</label>
                        <input type="text" id="materia" class="campo-materia" placeholder="Ex.: Matemática" required
                            v-model="materia">
                    </p>

                    <p>
                        <label for="tipo">Tipo</label>
                        <select id="tipo" class="campo-tipo" required v-model="tipo">
                            <option value="">Escolha o tipo</option>
                            <option value="prova">Prova</option>
                            <option value="trabalho">Trabalho</option>
                            <option value="apresentacao">Apresentação</option>
                        </select>
                    </p>

                    <p>
                        <label for="data">Data</label>
                        <input type="date" id="data" class="campo-data" required v-model="data">
                    </p>

                    <button type="submit" class="botao-adicionar">Adicionar</button>
                </fieldset>
            </form>
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
                <li v-for="entrega in entregasVisiveis" :key="entrega.id" class="entrega"
                    :class="{ feita: entrega.feita }" :data-tipo="entrega.tipo">
                    <span class="data">{{ formatarData(entrega.data) }}</span>
                    <div class="info">
                        <strong class="materia">{{ entrega.materia }}</strong>
                        <span class="etiqueta">{{ nomearTipo(entrega.tipo) }}</span>
                    </div>
                    <div class="acoes">
                        <button v-if="entrega.feita" type="button" class="botao-feita"
                            @click="alternarFeita(entrega)">Reabrir</button>
                        <button v-else type="button" class="botao-feita"
                            @click="alternarFeita(entrega)">Feita</button>
                        <button type="button" class="botao-apagar" @click="apagarEntrega(entrega)">Apagar</button>
                    </div>
                </li>
            </ul>
        </section>

    </main>

    <footer class="rodape">
        <p>Feito por Gui</p>
    </footer>
</template>
