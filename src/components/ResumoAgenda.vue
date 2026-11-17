<script setup>
// Quem calcula os valores é a página; aqui só aparecem.
// destino: o endereço da próxima entrega (vazio = sem link).
defineProps({
    pendentes: Number,
    proxima: String,
    destino: String
});
</script>

<template>
    <section class="cartao resumo">
        <h2>Resumo</h2>

        <div class="indicadores">
            <p class="indicador">
                <span class="rotulo">Pendentes</span>
                <strong class="pendentes">{{ pendentes }}</strong>
            </p>

            <p class="indicador">
                <span class="rotulo">Próxima entrega</span>
                <RouterLink v-if="destino" :to="destino" class="proxima">{{ proxima }}</RouterLink>
                <strong v-else class="proxima">{{ proxima }}</strong>
            </p>
        </div>
    </section>
</template>
