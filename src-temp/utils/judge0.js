// src/utils/judge0.js
// ─────────────────────────────────────────────────────────────
// Integração com a API Judge0 CE via RapidAPI.
// Documentação: https://ce.judge0.com/
// ─────────────────────────────────────────────────────────────

const JUDGE0_BASE_URL = process.env.JUDGE0_API_URL;
const RAPIDAPI_KEY    = process.env.JUDGE0_RAPIDAPI_KEY;
const RAPIDAPI_HOST   = process.env.JUDGE0_RAPIDAPI_HOST;

/** Headers padrão para todas as requisições ao Judge0 */
const headers = {
  "Content-Type": "application/json",
  "X-RapidAPI-Key": RAPIDAPI_KEY,
  "X-RapidAPI-Host": RAPIDAPI_HOST,
};

// ─── Mapeamento de linguagens ──────────────────────────────────
// ID conforme a API do Judge0 CE
export const LANGUAGE_IDS = {
  c:          50,
  cpp:        54,  // C++ (GCC 9.2.0)
  java:       62,  // Java (OpenJDK 13.0.1)
  python:     71,  // Python (3.8.1)
  javascript: 63,  // JavaScript (Node.js 12.14.0)
  typescript: 74,  // TypeScript (3.7.4)
  go:         60,  // Go (1.13.5)
  rust:       73,  // Rust (1.40.0)
  kotlin:     78,  // Kotlin (1.3.70)
  php:        68,  // PHP (7.4.1)
};

export const LANGUAGE_LABELS = {
  c:          "C",
  cpp:        "C++",
  java:       "Java",
  python:     "Python 3",
  javascript: "JavaScript",
  typescript: "TypeScript",
  go:         "Go",
  rust:       "Rust",
  kotlin:     "Kotlin",
  php:        "PHP",
};

// ─── Status do Judge0 → status interno do PAC ─────────────────
const JUDGE0_STATUS_MAP = {
  1:  "pending",           // In Queue
  2:  "processing",        // Processing
  3:  "accepted",          // Accepted
  4:  "wrong_answer",      // Wrong Answer
  5:  "time_limit_exceeded",
  6:  "compilation_error",
  7:  "runtime_error",     // SIGSEGV
  8:  "runtime_error",     // SIGXFSZ
  9:  "runtime_error",     // SIGFPE
  10: "runtime_error",     // SIGABRT
  11: "runtime_error",     // NZEC
  12: "runtime_error",     // Other
  13: "internal_error",    // Box Error
  14: "memory_limit_exceeded",
};

/**
 * Converte base64 → string legível (para stdout/stderr do Judge0)
 */
function decodeBase64(encoded) {
  if (!encoded) return null;
  try {
    return Buffer.from(encoded, "base64").toString("utf-8");
  } catch {
    return encoded;
  }
}

// ─── Funções principais ────────────────────────────────────────

/**
 * Envia um código para o Judge0 e retorna o token da submissão.
 * O julgamento é assíncrono: use `getSubmissionResult` para buscar o resultado.
 *
 * @param {Object} params
 * @param {string} params.sourceCode   - Código-fonte do aluno
 * @param {number} params.languageId   - ID da linguagem (use LANGUAGE_IDS)
 * @param {string} params.stdin        - Entrada do caso de teste
 * @param {string} params.expectedOutput - Saída esperada
 * @param {number} [params.timeLimitSec=2]     - Limite de tempo em segundos
 * @param {number} [params.memoryLimitKb=256000] - Limite de memória em KB
 *
 * @returns {Promise<string>} Token da submissão no Judge0
 */
export async function submitCode({
  sourceCode,
  languageId,
  stdin,
  expectedOutput,
  timeLimitSec = 2,
  memoryLimitKb = 256000,
}) {
  const body = {
    source_code:     sourceCode,
    language_id:     languageId,
    stdin:           stdin || "",
    expected_output: expectedOutput,
    cpu_time_limit:  timeLimitSec,
    memory_limit:    memoryLimitKb,
    // Retorna resultados em base64 para evitar problemas de encoding
    base64_encoded:  true,
  };

  const response = await fetch(`${JUDGE0_BASE_URL}/submissions?base64_encoded=true&wait=false`, {
    method: "POST",
    headers,
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Judge0 submission failed: ${response.status} — ${error}`);
  }

  const data = await response.json();
  return data.token;
}

/**
 * Busca o resultado de uma submissão pelo token.
 * Faz polling até o status sair de "pending" ou "processing".
 *
 * @param {string} token - Token retornado pelo `submitCode`
 * @param {number} [maxAttempts=10] - Máximo de tentativas de polling
 * @param {number} [intervalMs=1500] - Intervalo entre tentativas em ms
 *
 * @returns {Promise<Object>} Resultado formatado da submissão
 */
export async function getSubmissionResult(token, maxAttempts = 10, intervalMs = 1500) {
  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    const response = await fetch(
      `${JUDGE0_BASE_URL}/submissions/${token}?base64_encoded=true&fields=status_id,stdout,stderr,compile_output,time,memory,status`,
      { headers }
    );

    if (!response.ok) {
      throw new Error(`Judge0 polling failed: ${response.status}`);
    }

    const data = await response.json();
    const statusId = data.status?.id;

    // Ainda processando — aguarda e tenta de novo
    if (statusId === 1 || statusId === 2) {
      await new Promise((resolve) => setTimeout(resolve, intervalMs));
      continue;
    }

    // Resultado disponível
    return {
      status:         JUDGE0_STATUS_MAP[statusId] || "internal_error",
      statusId,
      stdout:         decodeBase64(data.stdout),
      stderr:         decodeBase64(data.stderr),
      compileOutput:  decodeBase64(data.compile_output),
      executionTimeMs: data.time ? Math.round(parseFloat(data.time) * 1000) : null,
      memoryUsedKb:   data.memory || null,
    };
  }

  // Timeout do polling
  return {
    status: "internal_error",
    statusId: 13,
    stdout: null,
    stderr: "Tempo limite de julgamento esgotado.",
    compileOutput: null,
    executionTimeMs: null,
    memoryUsedKb: null,
  };
}

/**
 * Submete código e aguarda o resultado (modo síncrono simplificado).
 * Ideal para exercícios com poucos casos de teste.
 *
 * @param {Object} params - Mesmos parâmetros do `submitCode`
 * @returns {Promise<Object>} Resultado da submissão
 */
export async function submitAndWait(params) {
  const token = await submitCode(params);
  return getSubmissionResult(token);
}
