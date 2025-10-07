# Incident — Replay / Idempotency
Sintomi: 409 replay; metriche crl_hmac_replay_total↑; x_origin_auth=replay.
Triage: skew ≤ ±300s; key N/N-1; header presenti.
Mitigazione: TTL/idempotency per /v1/order; retry+jitter; hmac_debug sampling.
