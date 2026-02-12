import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3"
import { getSignedUrl } from "@aws-sdk/s3-request-presigner"
import { getS3Env } from "@/lib/env"

export type AssetType = "book-cover" | "avatar" | "asset"

const ASSET_PREFIX: Record<AssetType, string> = {
  "book-cover": "book-covers",
  avatar: "avatars",
  asset: "assets",
}

function sanitizeFilename(filename: string) {
  return filename.replace(/[^a-zA-Z0-9._-]/g, "_")
}

export function createAssetKey(userId: string, assetType: AssetType, filename: string) {
  const safeName = sanitizeFilename(filename)
  const date = new Date().toISOString().slice(0, 10)
  return `${ASSET_PREFIX[assetType]}/${userId}/${date}/${crypto.randomUUID()}-${safeName}`
}

function trimSlashes(value: string) {
  return value.replace(/\/+$/, "")
}

export function getPublicAssetUrl(key: string) {
  const { bucket, endpoint, region, publicBaseUrl } = getS3Env()

  if (publicBaseUrl) {
    return `${trimSlashes(publicBaseUrl)}/${key}`
  }

  if (endpoint) {
    return `${trimSlashes(endpoint)}/${bucket}/${key}`
  }

  return `https://${bucket}.s3.${region}.amazonaws.com/${key}`
}

function getS3Client() {
  const { accessKeyId, secretAccessKey, region, endpoint, forcePathStyle } = getS3Env()

  return new S3Client({
    region,
    endpoint,
    forcePathStyle,
    credentials: {
      accessKeyId,
      secretAccessKey,
    },
  })
}

export async function createPresignedUploadUrl(params: {
  key: string
  contentType: string
  expiresIn?: number
}) {
  const { bucket } = getS3Env()
  const client = getS3Client()

  const command = new PutObjectCommand({
    Bucket: bucket,
    Key: params.key,
    ContentType: params.contentType,
  })

  const uploadUrl = await getSignedUrl(client, command, {
    expiresIn: params.expiresIn ?? 300,
  })

  return {
    uploadUrl,
    publicUrl: getPublicAssetUrl(params.key),
  }
}
