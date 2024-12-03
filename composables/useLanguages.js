import { ref, onMounted } from "vue";

export const useLanguages = () => {
  const languages = ref([]);

  const fetchLanguages = () => {
    const voices = speechSynthesis.getVoices();
    languages.value = voices.map((voice) => ({
      code: voice.lang,
      name: `${voice.name} (${voice.lang})`,
    }));
  };

  onMounted(() => {
    fetchLanguages();
    // Handle delayed voice loading
    if (!languages.value.length) {
      speechSynthesis.onvoiceschanged = fetchLanguages;
    }
  });

  return {
    languages,
  };
};
