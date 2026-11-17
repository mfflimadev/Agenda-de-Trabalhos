// Funções que só recebem dados e devolvem um resultado.
// Nada aqui mexe na tela nem guarda estado: isso é com o Vue.

const NOMES_DOS_TIPOS = {
    prova: 'Prova',
    trabalho: 'Trabalho',
    apresentacao: 'Apresentação'
};

// formatarData('2026-11-18') → '18/11'
// (sem usar Date, para o fuso horário não mudar o dia)
export function formatarData(texto) {
    const partes = texto.split('-');
    return partes[2] + '/' + partes[1];
}

// nomearTipo('apresentacao') → 'Apresentação'
export function nomearTipo(tipo) {
    return NOMES_DOS_TIPOS[tipo];
}

// Uma cópia em ordem de data; a lista original não muda.
export function ordenarPorData(lista) {
    return lista.toSorted((a, b) => a.data.localeCompare(b.data));
}

// Só as entregas que ainda não foram feitas.
export function filtrarPendentes(lista) {
    return lista.filter((entrega) => !entrega.feita);
}

// passaNoFiltro(entrega, 'todos') → true; ('prova') → só se for prova
export function passaNoFiltro(entrega, tipoEscolhido) {
    return tipoEscolhido === 'todos' || entrega.tipo === tipoEscolhido;
}

// 'Matemática — 18/11', ou 'Nada pendente' se não sobrar nenhuma.
export function montarTextoDaProxima(lista) {
    const pendentes = ordenarPorData(filtrarPendentes(lista));
    if (pendentes.length === 0) {
        return 'Nada pendente';
    }
    const proxima = pendentes[0];
    return proxima.materia + ' — ' + formatarData(proxima.data);
}
