export async function copyText(text: string) {
  if (!text) return
  await navigator.clipboard.writeText(text)
}
