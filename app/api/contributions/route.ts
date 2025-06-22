const handler = async () => {
  const res = await fetch("https://ghchart.rshah.org/178942/geekskai", {
    headers: {
      "Content-Type": "image/svg+xml",
      "Cache-Control": "public, max-age=86400",
    },
  })

  const svgText = await res.text()

  return new Response(svgText, {
    status: 200,
  })
}

export { handler as GET }
