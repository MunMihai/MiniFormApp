// Fisier generat la startup de docker-entrypoint.sh via envsubst.
// In dev local (Vite), este servit ca atare — App.tsx cade inapoi pe import.meta.env.
window.__ENV__ = {
  API_BASE_URL: "${API_BASE_URL}"
};
