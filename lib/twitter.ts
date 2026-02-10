export type Tweet = {
  id: string
  text: string
  created_at?: string
  url?: string
}

const SAMPLE_TWEETS: Tweet[] = [
  {
    id: "sample-1",
    text: "Welcome to VirexBooks — a place for writers and readers. Follow for updates!",
    created_at: new Date().toISOString(),
    url: "#",
  },
  {
    id: "sample-2",
    text: "We're rolling out new editor features and better reading UX. Stay tuned.",
    created_at: new Date().toISOString(),
    url: "#",
  },
]

export async function fetchLatestTweets(
  username = "virexbooks",
  maxResults = 8
): Promise<Tweet[]> {
  const token = process.env.TWITTER_BEARER_TOKEN
  if (!token) return SAMPLE_TWEETS

  try {
    // Get user id
    const userRes = await fetch(
      `https://api.twitter.com/2/users/by/username/${encodeURIComponent(username)}`,
      {
        headers: { Authorization: `Bearer ${token}` },
        cache: "no-store",
      }
    )

    if (!userRes.ok) return SAMPLE_TWEETS
    const userJson = await userRes.json()
    const userId = userJson?.data?.id
    if (!userId) return SAMPLE_TWEETS

    // Fetch tweets
    const tweetsRes = await fetch(
      `https://api.twitter.com/2/users/${userId}/tweets?max_results=${maxResults}&tweet.fields=created_at,text`,
      {
        headers: { Authorization: `Bearer ${token}` },
        cache: "no-store",
      }
    )

    if (!tweetsRes.ok) return SAMPLE_TWEETS
    const tweetsJson = await tweetsRes.json()
    const tweets = (tweetsJson.data || []).map((t: any) => ({
      id: t.id,
      text: t.text,
      created_at: t.created_at,
      url: `https://twitter.com/${username}/status/${t.id}`,
    })) as Tweet[]

    return tweets
  } catch (e) {
    return SAMPLE_TWEETS
  }
}
