const { GoogleGenerativeAI } = require('@google/generative-ai')

let cachedWorkingModel = null

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

const getCandidateModels = () => {
  const configured = process.env.GEMINI_MODEL

  const candidates = [
    cachedWorkingModel,
    configured,
    'gemini-2.5-flash',
    'gemini-2.5-pro',
    'gemini-2.0-flash',
    'gemini-2.0-flash-lite',
    'gemini-flash-latest',
    'gemini-flash-lite-latest',
    'gemini-pro-latest',
    'gemini-1.5-flash-latest',
    'gemini-1.5-flash',
    'gemini-1.5-pro-latest',
    'gemini-1.5-pro',
    'gemini-1.0-pro',
    'gemini-pro',
  ]

  const unique = []
  for (const name of candidates) {
    if (!name) continue
    if (!unique.includes(name)) unique.push(name)
  }
  return unique
}

const isModelNotFoundError = (err) => {
  const status = err?.status || err?.response?.status
  if (status === 404) return true

  const msg = String(err?.message || '')
  const lower = msg.toLowerCase()

  if (lower.includes('not supported') && lower.includes('generatecontent')) {
    return true
  }

  // Example seen in the wild:
  // "[GoogleGenerativeAI Error]: ... [404 Not Found] models/gemini-1.5-flash is not found ... or is not supported for generateContent"
  return msg.includes('404') && (lower.includes('not found') || lower.includes('not supported'))
}

const generateTextWithFallbackModels = async (prompt) => {
  const genAI = getGenAI()
  const candidates = getCandidateModels()

  let lastErr
  for (const modelName of candidates) {
    try {
      const model = genAI.getGenerativeModel({ model: modelName })
      const result = await model.generateContent(prompt)
      cachedWorkingModel = modelName
      return {
        text: result?.response?.text?.() || '',
        modelName,
      }
    } catch (err) {
      lastErr = err
      if (isModelNotFoundError(err)) {
        continue
      }
      throw err
    }
  }

  const attempted = candidates.join(', ')
  const originalMessage = String(lastErr?.message || lastErr || 'Unknown error')
  throw new Error(
    `No available Gemini model worked. Attempted: ${attempted}. Last error: ${originalMessage}. ` +
    `Set GEMINI_MODEL to a supported model for your API key/project.`
  )
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
  const limitedProjects = Array.isArray(projects) ? projects.slice(0, 25) : []

  const prompt = `
You are an FYP project recommendation assistant for a university platform.

Student Profile:
- Name: ${studentProfile.name}
- Skills: ${studentProfile.skills || 'not specified'}
- Interests: ${studentProfile.interests || 'not specified'}
- Preferred Domain: ${studentProfile.preferredDomain || 'any'}

Available Projects on Platform:
${limitedProjects.map((p, i) => `
${i + 1}. ID: ${p._id}
   Title: ${p.title}
   Description: ${p.description}
   Domain: ${p.domain}
   Supervisor Name: ${p.supervisor?.name || ''}
   Supervisor Email: ${p.supervisor?.email || ''}
`).join('')}

Task 1 - Match existing projects:
From the available projects listed above, pick the top 3 that best match this student. Consider semantic similarity between student skills/interests and project description, not just keyword matching.

Task 2 - Generate new ideas:
Based on the student profile, suggest 3 completely new FYP project ideas that are NOT from the list above. These are AI-generated ideas only.

Return ONLY a JSON object in this exact format, no extra text, no markdown:
{
  "existingMatches": [
    {
      "projectId": "mongodb _id string",
      "title": "project title",
      "domain": "domain",
      "supervisorName": "supervisor name",
      "supervisorEmail": "supervisor email",
      "reason": "one sentence why this matches the student"
    }
  ],
  "aiIdeas": [
    {
      "title": "idea title",
      "description": "2 sentence description of the idea",
      "domain": "suggested domain"
    }
  ]
}
`

  const { text } = await generateTextWithFallbackModels(prompt)
  const cleanText = stripCodeFences(text)

  let parsed
  try {
    parsed = JSON.parse(cleanText)
  } catch (err) {
    const firstBrace = cleanText.indexOf('{')
    const lastBrace = cleanText.lastIndexOf('}')
    if (firstBrace === -1 || lastBrace === -1 || lastBrace <= firstBrace) {
      throw new Error('Gemini response is not valid JSON')
    }
    parsed = JSON.parse(cleanText.slice(firstBrace, lastBrace + 1))
  }

  const existingMatches = Array.isArray(parsed.existingMatches) ? parsed.existingMatches : []
  const aiIdeas = Array.isArray(parsed.aiIdeas) ? parsed.aiIdeas : []

  return {
    existingMatches: existingMatches.slice(0, 3).map((m) => ({
      projectId: String(m.projectId || ''),
      title: String(m.title || ''),
      domain: String(m.domain || ''),
      supervisorName: String(m.supervisorName || ''),
      supervisorEmail: String(m.supervisorEmail || ''),
      reason: String(m.reason || ''),
    })),
    aiIdeas: aiIdeas.slice(0, 3).map((idea) => ({
      title: String(idea.title || ''),
      description: String(idea.description || ''),
      domain: String(idea.domain || ''),
    })),
  }
}

const generateBio = async ({ name, skills, interests, preferredDomain, github }) => {
  const prompt = `Write a short 3-sentence professional biography for a computer science student with the following profile:
Name: ${name || ''}
Skills: ${skills || ''}
Interests: ${interests || ''}
Preferred Domain: ${preferredDomain || ''}
GitHub: ${github || ''}
Write in third person. Keep it professional and suitable for an academic platform. Return only the bio text, no labels or extra text.`

  const { text } = await generateTextWithFallbackModels(prompt)
  return stripCodeFences(text)
}

module.exports = { getRecommendations, generateBio }