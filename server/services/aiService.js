const { GoogleGenerativeAI } = require('@google/generative-ai')

const getGenAI = () => {
  const apiKey = process.env.GEMINI_API_KEY
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY is not set on the server')
  }
  return new GoogleGenerativeAI(apiKey)
}

const stripCodeFences = (text) => {
  if (!text) return ''
  return text
    .replace(/```[a-z]*\n?/gi, '')
    .replace(/```/g, '')
    .trim()
}

const tryParseRecommendations = (rawText) => {
  const cleanText = stripCodeFences(rawText)

  try {
    const parsed = JSON.parse(cleanText)
    if (!Array.isArray(parsed)) {
      throw new Error('Gemini response JSON is not an array')
    }
    return parsed
  } catch (err) {
    const firstBracket = cleanText.indexOf('[')
    const lastBracket = cleanText.lastIndexOf(']')
    if (firstBracket === -1 || lastBracket === -1 || lastBracket <= firstBracket) {
      throw new Error('Gemini response is not valid JSON')
    }

    const extracted = cleanText.slice(firstBracket, lastBracket + 1)
    const parsed = JSON.parse(extracted)
    if (!Array.isArray(parsed)) {
      throw new Error('Gemini response JSON is not an array')
    }
    return parsed
  }
}

const getRecommendations = async (studentProfile, projects) => {
  const genAI = getGenAI()
  const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' })

  const limitedProjects = Array.isArray(projects) ? projects.slice(0, 25) : []

  const prompt = `
You are an FYP project recommendation assistant.

Student Profile:
- Name: ${studentProfile.name}
- Skills: ${studentProfile.skills || 'not specified'}
- Interests: ${studentProfile.interests || 'not specified'}
- Preferred Domain: ${studentProfile.preferredDomain || 'any'}

Available Projects:
${limitedProjects.map((p, i) => `
${i + 1}. ID: ${p._id}
   Title: ${p.title}
   Description: ${p.description}
   Domain: ${p.domain}
`).join('')}

Return ONLY a JSON array of the top 3 recommended projects in this exact format, no extra text:
[
  {
    "projectId": "the project _id",
    "title": "project title",
    "reason": "one sentence explaining why this matches the student"
  }
]
`

  const result = await model.generateContent(prompt)
  const text = result?.response?.text?.() || ''
  const recommendations = tryParseRecommendations(text)

  // Best-effort normalization
  return recommendations
    .filter((r) => r && (r.projectId || r.title || r.reason))
    .slice(0, 3)
    .map((r) => ({
      projectId: String(r.projectId || ''),
      title: String(r.title || ''),
      reason: String(r.reason || ''),
    }))
}

module.exports = { getRecommendations }