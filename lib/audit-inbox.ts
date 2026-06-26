export type AuditAnswer = {
  question: string;
  answer: string;
};

export type AuditSubmission = {
  id: string;
  email: string;
  message: string;
  answers: AuditAnswer[];
  createdAt: string;
  userAgent?: string;
};

const STORE_KEY = "digitalsystemlab:audit-submissions";
const MAX_SUBMISSIONS = 200;

type RedisResult<T> = {
  result?: T;
  error?: string;
};

function getRedisConfig() {
  const url = process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN;

  if (!url || !token) {
    throw new Error("AUDIT_STORE_NOT_CONFIGURED");
  }

  return { url, token };
}

async function redisCommand<T>(command: unknown[]) {
  const { url, token } = getRedisConfig();
  const response = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(command),
    cache: "no-store",
  });

  const data = (await response.json().catch(() => ({}))) as RedisResult<T>;

  if (!response.ok || data.error) {
    throw new Error(data.error || "AUDIT_STORE_ERROR");
  }

  return data.result as T;
}

export async function saveAuditSubmission(submission: AuditSubmission) {
  await redisCommand<number>(["LPUSH", STORE_KEY, JSON.stringify(submission)]);
  await redisCommand<string>(["LTRIM", STORE_KEY, 0, MAX_SUBMISSIONS - 1]);
}

export async function listAuditSubmissions(limit = 100) {
  const items = await redisCommand<string[]>([
    "LRANGE",
    STORE_KEY,
    0,
    Math.max(0, Math.min(limit, MAX_SUBMISSIONS) - 1),
  ]);

  return items
    .map((item) => {
      try {
        return JSON.parse(item) as AuditSubmission;
      } catch {
        return null;
      }
    })
    .filter((item): item is AuditSubmission => Boolean(item));
}
