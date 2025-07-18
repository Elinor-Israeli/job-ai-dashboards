import { httpService } from './http.service'

export const aiService = {
  askQuestion,
}

function askQuestion(question) {
  return httpService.get(`ai`, { question })
}