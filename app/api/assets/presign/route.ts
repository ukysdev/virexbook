import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { createAssetKey, createPresignedUploadUrl, type AssetType } from "@/lib/s3"

const ALLOWED_IMAGE_CONTENT_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
  "image/avif",
  "image/svg+xml",
])

const ALLOWED_AUDIO_CONTENT_TYPES = new Set([
  "audio/mpeg",
  "audio/mp3",
  "audio/mp4",
  "audio/x-m4a",
  "audio/aac",
  "audio/wav",
  "audio/x-wav",
  "audio/ogg",
  "audio/webm",
])

function getAssetType(value: unknown): AssetType {
  if (
    value === "book-cover" ||
    value === "avatar" ||
    value === "asset" ||
    value === "chapter-audio"
  ) {
    return value
  }
  return "asset"
}

export async function POST(req: Request) {
  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await req.json()
    const assetType = getAssetType(body?.assetType)
    const filename = typeof body?.filename === "string" ? body.filename : ""
    const contentType = typeof body?.contentType === "string" ? body.contentType : ""

    if (!filename || !contentType) {
      return NextResponse.json(
        { error: "filename and contentType are required" },
        { status: 400 },
      )
    }

    const isAllowedContentType =
      assetType === "asset"
        ? true
        : assetType === "chapter-audio"
          ? ALLOWED_AUDIO_CONTENT_TYPES.has(contentType)
          : ALLOWED_IMAGE_CONTENT_TYPES.has(contentType)

    if (!isAllowedContentType) {
      return NextResponse.json({ error: "Unsupported file type" }, { status: 400 })
    }

    const key = createAssetKey(user.id, assetType, filename)
    const { uploadUrl, uploadHeaders, publicUrl } = await createPresignedUploadUrl({
      key,
      contentType,
    })

    return NextResponse.json({
      key,
      uploadUrl,
      uploadHeaders,
      publicUrl,
    })
  } catch (error) {
    const message = error instanceof Error ? error.message : "Upload URL generation failed"
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
