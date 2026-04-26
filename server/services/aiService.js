const { GoogleGenerativeAI } = require('@google/generative-ai')

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY)

const getRecommendations = async (studentProfile, projects) => {
  const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' })

  const prompt = `
You are an FYP project recommendation assistant.

Student Profile:
- Name: ${studentProfile.name}
- Skills: ${studentProfile.skills || 'not specified'}
- Interests: ${studentProfile.interests || 'not specified'}
- Preferred Domain: ${studentProfile.preferredDomain || 'any'}

Available Projects:
${projects.map((p, i) => `
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
  const text = result.response.text()
  const clean = text.replace(/```json|```/g, '').trim()
  return JSON.parse(clean)
}

module.exports = { getRecommendations }