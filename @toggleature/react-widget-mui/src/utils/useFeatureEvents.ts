// @ts-nocheck
export default function useFeatureEvents() {
  useEffect(() => {
    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
    function handleMessage({ data: message }) {
      const { command, payload } = parseMessage(message);

      switch (command) {
        case COMMANDS.GET_FEATURES:
          broadcast("status", featureTogglesRef.current);
          break;
        case COMMANDS.SET_FEATURES:
          const { features: nextFeatureToggles } = payload;
          setFeatureToggles((prevFeatureToggles) => ({
            ...prevFeatureToggles,
            ...nextFeatureToggles,
          }));
          break;
        default:
        // do nothing
      }
    }
  });
}
