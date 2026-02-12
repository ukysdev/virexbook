export function getSupabaseEnv() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!url) {
    throw new Error(
      'Missing required environment variable: NEXT_PUBLIC_SUPABASE_URL. Add it to your .env.local file.',
    )
  }

  if (!anonKey) {
    throw new Error(
      'Missing required environment variable: NEXT_PUBLIC_SUPABASE_ANON_KEY. Add it to your .env.local file.',
    )
  }

  return {
    url,
    anonKey,
  }
}

export function getSupabaseServiceRoleKey() {
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!serviceRoleKey) {
    throw new Error(
      'Missing required environment variable: SUPABASE_SERVICE_ROLE_KEY. Add it to your .env.local file.',
    )
  }

  return serviceRoleKey
}

export function getS3Env() {
  const accessKeyId = process.env.S3_ACCESS_KEY_ID
  const secretAccessKey = process.env.S3_SECRET_ACCESS_KEY
  const bucket = process.env.S3_BUCKET
  const region = process.env.S3_REGION || "us-east-1"
  const endpoint = process.env.S3_ENDPOINT
  const publicBaseUrl = process.env.S3_PUBLIC_BASE_URL
  const forcePathStyle = process.env.S3_FORCE_PATH_STYLE === "true"

  if (!accessKeyId) {
    throw new Error(
      "Missing required environment variable: S3_ACCESS_KEY_ID. Add it to your .env.local file.",
    )
  }

  if (!secretAccessKey) {
    throw new Error(
      "Missing required environment variable: S3_SECRET_ACCESS_KEY. Add it to your .env.local file.",
    )
  }

  if (!bucket) {
    throw new Error(
      "Missing required environment variable: S3_BUCKET. Add it to your .env.local file.",
    )
  }

  return {
    accessKeyId,
    secretAccessKey,
    bucket,
    region,
    endpoint,
    publicBaseUrl,
    forcePathStyle,
  }
}
