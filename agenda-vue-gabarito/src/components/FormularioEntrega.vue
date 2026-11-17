<script setup>
import { ref } from 'vue';

// O formulário monta a entrega e avisa; quem guarda é o App.
const emit = defineEmits(['adicionar']);

const materia = ref('');
const tipo = ref('');
const data = ref('');

function limparFormulario() {
    materia.value = '';
    tipo.value = '';
    data.value = '';
}

function enviarEntrega() {
    const nome = materia.value.trim();
    if (nome === '') {
        materia.value = '';
        return;
    }

    emit('adicionar', {
        id: Date.now(),
        materia: nome,
        tipo: tipo.value,
        data: data.value,
        feita: false
    });

    limparFormulario();
}
</script>

<template>
    <form class="formulario" @submit.prevent="enviarEntrega">
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
</template>
