import { defineStore } from 'pinia';
import { ref } from 'vue';
const colorMode = useColorMode();

interface ThemeState {
    theme: Ref<string | null>;
}
interface ThemeActions {
    initTheme(): void;
    switchTheme(): void;
}

export const useWalletStore = defineStore<'walletStore', ThemeState, {}, ThemeActions>('walletStore', {

    state: (): ThemeState => ({
        theme: ref('')
    }),
    actions: {
        initTheme(): void {
            this.theme = localStorage.getItem('theme');
            localStorage.setItem('theme', colorMode.value);
        },
        switchTheme(): void {
            colorMode.value === 'dark' ? colorMode.value = 'light' : colorMode.value = 'dark';
            this.theme = colorMode.value;
            localStorage.setItem('theme', this.theme);
        }
    },
});