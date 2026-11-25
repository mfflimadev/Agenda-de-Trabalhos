/* ===========================================================
   useAbreFecha: um estado de aberto/fechado e o botão que alterna.
   Cada chamada cria um estado novo e independente.
   =========================================================== */
import { ref } from 'vue';

export function useAbreFecha(abertoNoInicio = false) {
    const aberto = ref(abertoNoInicio);

    function alternar() {
        aberto.value = !aberto.value;
    }

    return { aberto, alternar };
}
