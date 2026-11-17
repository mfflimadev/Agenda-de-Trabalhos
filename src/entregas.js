import { ref, watch } from 'vue';

// Escondido: só este módulo usa.
const CHAVE = 'agenda-de-entregas-vue';

// As entregas de exemplo, para a primeira vez que a página abre.
const ENTREGAS_INICIAIS = [
    { id: 1, materia: 'Matemática', tipo: 'prova', data: '2026-11-18', feita: false },
    { id: 2, materia: 'História', tipo: 'trabalho', data: '2026-11-25', feita: false },
    { id: 3, materia: 'Português', tipo: 'trabalho', data: '2026-11-10', feita: true },
    { id: 4, materia: 'Inglês', tipo: 'apresentacao', data: '2026-11-20', feita: false }
];

function carregarEntregas() {
    const salvas = localStorage.getItem(CHAVE);
    if (salvas === null) {
        return ENTREGAS_INICIAIS;
    }
    return JSON.parse(salvas);
}

function salvarEntregas(lista) {
    localStorage.setItem(CHAVE, JSON.stringify(lista));
}

// Escondido: só este módulo usa.
// Exportado: todas as páginas enxergam a mesma lista.
export const entregas = ref(carregarEntregas());

// Toda mudança na lista é salva.
watch(entregas, salvarEntregas, { deep: true });

// A entrega chega pronta do FormularioEntrega.
export function adicionarEntrega(entrega) {
    entregas.value.push(entrega);
}

// O ! inverte: true vira false, e false vira true.
export function alternarFeita(entrega) {
    entrega.feita = !entrega.feita;
}

// A lista da tela está ordenada: procura a entrega na lista de verdade.
export function apagarEntrega(entrega) {
    const posicao = entregas.value.indexOf(entrega);
    if (posicao !== -1) {
        entregas.value.splice(posicao, 1);
    }
}
