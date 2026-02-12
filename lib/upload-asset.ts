export type UploadAssetType = "book-cover" | "avatar" | "asset"

interface PresignResponse {
  key: string
  uploadUrl: string
  publicUrl: string
}

export async function uploadAssetFile(file: File, assetType: UploadAssetType) {
  const presignResponse = await fetch("/api/assets/presign", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      assetType,
      filename: file.name,
      contentType: file.type,
    }),
  })

  const presign = (await presignResponse.json()) as Partial<PresignResponse> & {
    error?: string
  }

  if (!presignResponse.ok || !presign.uploadUrl || !presign.publicUrl) {
    throw new Error(presign.error || "Could not generate upload URL")
  }

  const uploadResponse = await fetch(presign.uploadUrl, {
    method: "PUT",
    headers: {
      "Content-Type": file.type,
    },
    body: file,
  })

  if (!uploadResponse.ok) {
    throw new Error("Upload to storage failed")
  }

  return presign.publicUrl
}
