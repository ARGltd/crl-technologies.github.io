# Volume II — Technical Specifications
Engine C++20 (FSM), API REST /v1/* (HMAC), opzionale gRPC/FIX. Canon HMAC:
METHOD
/v1/calc
{unix_ts}
{base64(sha256(body))}
