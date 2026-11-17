// ===========================================================
// Agenda de entregas — Etapas 3 e 4
// ===========================================================

const CHAVE = 'agenda-de-entregas';

const NOMES_DOS_TIPOS = {
    prova: 'Prova',
    trabalho: 'Trabalho',
    apresentacao: 'Apresentação'
};

// As entregas de exemplo: a lista NÃO está em ordem de data,
// quem ordena é a tela.
const ENTREGAS_DE_EXEMPLO = [
    { materia: 'Matemática', tipo: 'prova', data: '2026-10-28', feita: false },
    { materia: 'História', tipo: 'trabalho', data: '2026-11-04', feita: false },
    { materia: 'Português', tipo: 'trabalho', data: '2026-10-20', feita: true },
    { materia: 'Inglês', tipo: 'apresentacao', data: '2026-10-30', feita: false }
];

const formulario = document.querySelector('.formulario');
const campoMateria = document.querySelector('.campo-materia');
const campoTipo = document.querySelector('.campo-tipo');
const campoData = document.querySelector('.campo-data');
const campoFiltro = document.querySelector('.campo-filtro');
const lista = document.querySelector('.lista');
const textoPendentes = document.querySelector('.pendentes');
const textoProxima = document.querySelector('.proxima');

let entregas = carregarEntregas();

// Primeira vez (nada salvo): começa com os exemplos.
function carregarEntregas() {
    const salvo = localStorage.getItem(CHAVE);
    if (salvo === null) {
        return ENTREGAS_DE_EXEMPLO.map((entrega) => ({ ...entrega }));
    }
    try {
        const lido = JSON.parse(salvo);
        if (Array.isArray(lido)) {
            return lido;
        }
    } catch (erro) {
        // dado corrompido: cai nos exemplos
    }
    return ENTREGAS_DE_EXEMPLO.map((entrega) => ({ ...entrega }));
}

function salvar() {
    localStorage.setItem(CHAVE, JSON.stringify(entregas));
}

// formatarData('2026-10-28') → '28/10'
// (sem usar Date, para o fuso horário não mudar o dia)
function formatarData(texto) {
    const partes = texto.split('-');
    return partes[2] + '/' + partes[1];
}

// Uma cópia em ordem de data; a lista original não muda.
function emOrdemDeData(lista) {
    return lista.toSorted((a, b) => a.data.localeCompare(b.data));
}

function criarEntrega(entrega) {
    const item = document.createElement('li');
    item.classList.add('entrega');
    if (entrega.feita) {
        item.classList.add('feita');
    }
    item.dataset.tipo = entrega.tipo;

    const data = document.createElement('span');
    data.classList.add('data');
    data.textContent = formatarData(entrega.data);

    const info = document.createElement('div');
    info.classList.add('info');

    const materia = document.createElement('strong');
    materia.classList.add('materia');
    materia.textContent = entrega.materia;

    const etiqueta = document.createElement('span');
    etiqueta.classList.add('etiqueta');
    etiqueta.textContent = NOMES_DOS_TIPOS[entrega.tipo];

    info.appendChild(materia);
    info.appendChild(etiqueta);

    const acoes = document.createElement('div');
    acoes.classList.add('acoes');

    const botaoFeita = document.createElement('button');
    botaoFeita.type = 'button';
    botaoFeita.classList.add('botao-feita');
    botaoFeita.textContent = entrega.feita ? 'Reabrir' : 'Feita';
    botaoFeita.addEventListener('click', () => {
        entrega.feita = !entrega.feita;
        salvar();
        renderizar();
    });

    // Apaga pelo próprio objeto, não pela posição na tela:
    // a tela está em ordem de data e a lista não.
    const botaoApagar = document.createElement('button');
    botaoApagar.type = 'button';
    botaoApagar.classList.add('botao-apagar');
    botaoApagar.textContent = 'Apagar';
    botaoApagar.addEventListener('click', () => {
        entregas = entregas.filter((outra) => outra !== entrega);
        salvar();
        renderizar();
    });

    acoes.appendChild(botaoFeita);
    acoes.appendChild(botaoApagar);

    item.appendChild(data);
    item.appendChild(info);
    item.appendChild(acoes);
    return item;
}

// O resumo conta TODAS as entregas, o filtro não interfere.
function atualizarResumo() {
    const pendentes = emOrdemDeData(entregas.filter((entrega) => !entrega.feita));
    textoPendentes.textContent = pendentes.length;

    if (pendentes.length === 0) {
        textoProxima.textContent = 'Nada pendente';
    } else {
        const proxima = pendentes[0];
        textoProxima.textContent = proxima.materia + ' — ' + formatarData(proxima.data);
    }
}

function renderizar() {
    const filtro = campoFiltro.value;
    const visiveis = entregas.filter((entrega) => {
        return filtro === 'todos' || entrega.tipo === filtro;
    });

    lista.innerHTML = '';
    emOrdemDeData(visiveis).forEach((entrega) => {
        lista.appendChild(criarEntrega(entrega));
    });

    atualizarResumo();
}

formulario.addEventListener('submit', (evento) => {
    evento.preventDefault();

    const materia = campoMateria.value.trim();
    if (materia === '') {
        campoMateria.value = '';
        campoMateria.focus();
        return;
    }

    entregas.push({
        materia: materia,
        tipo: campoTipo.value,
        data: campoData.value,
        feita: false
    });
    salvar();
    formulario.reset();
    renderizar();
});

campoFiltro.addEventListener('change', renderizar);

renderizar();
