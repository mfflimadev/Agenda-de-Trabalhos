/* ===========================================================
   useLocalStorage: um ref que se lembra do valor no navegador.
   Lê da chave ao começar (ou usa o valor inicial) e salva
   a cada mudança.
   =========================================================== */
import { ref, watch } from 'vue';

export function useLocalStorage(chave, valorInicial) {
    const salvo = localStorage.getItem(chave);
    const valor = ref(salvo === null ? valorInicial : JSON.parse(salvo));

    watch(valor, (novo) => {
        localStorage.setItem(chave, JSON.stringify(novo));
    }, { deep: true });

    return valor;
}
