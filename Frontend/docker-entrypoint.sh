#!/bin/sh
# Inlocuieste ${API_BASE_URL} din env-config.js cu valoarea din environment.
# Daca variabila nu e setata, foloseste valoarea implicita.
export API_BASE_URL="${API_BASE_URL:-http://localhost:5000}"

envsubst < /usr/share/nginx/html/env-config.js > /tmp/env-config.js
cp /tmp/env-config.js /usr/share/nginx/html/env-config.js

exec nginx -g "daemon off;"
