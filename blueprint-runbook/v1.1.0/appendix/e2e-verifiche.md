# Verifiche E2E
HMAC: TS=0→401/400; missing header→401 unknown_key/400; firma corretta→2xx.
Replay: duplicati entro TTL→409 e metrica↑. Pinning: doppio pin 7gg. Latenza: p95 < 10 ms.
