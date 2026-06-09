import express from 'express'
import logger from '../logger.mjs'
import { paramError } from '../errors.mjs'

/**
 * Smartly filters and compresses log lines to fit within AI model context limits.
 * - Truncates excessively long individual lines (like SDPs or large statistics).
 * - Filters out repetitive ping-pong and keepalive logs.
 * - Prioritizes error, warning, and ICE state change logs.
 * - Always includes the last 100 non-spam logs for final state context.
 * - Keeps everything in chronological order.
 */
function filterLogs (logs, maxLines = 200) {
  // 1. Truncate each line to a maximum of 250 characters to prevent huge token count
  const cleanLogs = logs.map(line => {
    if (typeof line !== 'string') return ''
    if (line.length > 250) {
      return line.substring(0, 250) + '... [truncated]'
    }
    return line
  })

  if (cleanLogs.length <= maxLines) {
    return cleanLogs
  }

  const importantKeywords = [
    'error', 'warn', 'fail', 'disconnect', 'fatal', 'ice', 'connectionstate',
    'signalingstate', 'rejected', 'timeout', 'exception', 'critical', 'unauthorized'
  ]

  const spamPatterns = [
    /strophe: (ping|pong|keepalive)/i,
    /send ping/i,
    /received pong/i,
    /xmpp.*ping/i,
    /getstats/i
  ]

  const importantLogs = []
  const normalLogs = []

  for (let i = 0; i < cleanLogs.length; i++) {
    const line = cleanLogs[i]
    if (!line) continue
    const isSpam = spamPatterns.some(pattern => pattern.test(line))
    if (isSpam) {
      continue
    }

    const lowerLine = line.toLowerCase()
    const isImportant = importantKeywords.some(keyword => lowerLine.includes(keyword))

    if (isImportant) {
      importantLogs.push({ index: i, text: line })
    } else {
      normalLogs.push({ index: i, text: line })
    }
  }

  const selectedLinesMap = new Map()

  // 2. Keep the last 100 non-spam lines for final state
  const lastLinesCount = Math.min(100, cleanLogs.length)
  for (let i = cleanLogs.length - lastLinesCount; i < cleanLogs.length; i++) {
    const line = cleanLogs[i]
    if (!line) continue
    const isSpam = spamPatterns.some(pattern => pattern.test(line))
    if (!isSpam) {
      selectedLinesMap.set(i, line)
    }
  }

  // 3. Fill remaining capacity with important logs (errors/warnings)
  const remainingCapacity = maxLines - selectedLinesMap.size
  if (remainingCapacity > 0) {
    for (const log of importantLogs) {
      if (selectedLinesMap.size >= maxLines) {
        break
      }
      selectedLinesMap.set(log.index, log.text)
    }
  }

  // 4. Fill any remaining capacity with recent normal logs
  const fillRemaining = maxLines - selectedLinesMap.size
  if (fillRemaining > 0) {
    for (let i = normalLogs.length - 1; i >= 0; i--) {
      if (selectedLinesMap.size >= maxLines) {
        break
      }
      const log = normalLogs[i]
      selectedLinesMap.set(log.index, log.text)
    }
  }

  // Sort by index to maintain chronological order
  const sortedIndices = Array.from(selectedLinesMap.keys()).sort((a, b) => a - b)
  return sortedIndices.map(index => selectedLinesMap.get(index))
}

/**
 * @returns {express.Router}
 */
export function createAnalyzeRoutes () {
  const router = express.Router()

  // Use express.json middleware for this router to parse JSON bodies
  router.use(express.json({ limit: '10mb' }))

  router.post('/', async (req, res) => {
    const { logs, statsSummary } = req.body

    if (!logs || !Array.isArray(logs)) {
      return res.status(400).json(paramError('logs array is required'))
    }

    const apiUrl = process.env.GEMMA_API_URL || 'http://10.1.6.52:8007/v1/chat/completions'
    const model = process.env.GEMMA_MODEL || 'google/gemma-4-26b-a4b-it'

    logger.info(`Starting WebRTC log analysis using AI model: ${model} at ${apiUrl}`)

    // Smart filter logs (limit to 200 lines of highly relevant logs)
    const logsSubset = filterLogs(logs, 200)
    const logsText = logsSubset.join('\n')

    // Build stats description if available
    let statsText = ''
    if (statsSummary && typeof statsSummary === 'object') {
      statsText = JSON.stringify(statsSummary, null, 2)
    }

    const prompt = `Bạn là một chuyên gia về WebRTC và truyền thông thời gian thực.
Dưới đây là thông tin logs và một phần dữ liệu thống kê từ một phiên cuộc họp WebRTC bị lỗi hoặc gặp vấn đề chất lượng.
Hãy phân tích dữ liệu bên dưới và đưa ra báo cáo chẩn đoán bằng tiếng Việt (định dạng Markdown).

Báo cáo cần tập trung vào các điểm sau:
1. **Sự cố phát hiện:** Nêu rõ các lỗi, cảnh báo nổi bật (ví dụ: mất kết nối, lỗi ICE, chất lượng kết nối kém, thiết bị camera/micro có vấn đề...).
2. **Nguyên nhân tiềm ẩn:** Giải thích tại sao sự cố này xảy ra dựa trên logs/stats.
3. **Giải pháp khắc phục:** Đưa ra các bước hành động cụ thể để khắc phục (cho người dùng hoặc cho quản trị viên hệ thống).

Yêu cầu phản hồi ngắn gọn, trực diện, trình bày rõ ràng bằng Markdown (dùng bullet points, bold, code block nếu cần). Không nói dông dài.

---
${statsText ? `[Dữ liệu thống kê tóm tắt]:\n${statsText}\n\n` : ''}[Logs hệ thống (đã lọc các sự kiện quan trọng)]:\n${logsText}
---`

    try {
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model: model,
          messages: [
            {
              role: 'user',
              content: prompt
            }
          ],
          max_tokens: 1000,
          temperature: 0.2
        })
      })

      if (!response.ok) {
        const errorText = await response.text()
        logger.error('Error response from Gemma API:', errorText)
        return res.status(response.status).json({
          error: `Gemma API returned status ${response.status}`,
          details: errorText
        })
      }

      const responseData = await response.json()
      const aiResponseContent = responseData?.choices?.[0]?.message?.content || 'Không nhận được phản hồi từ AI.'

      return res.json({
        analysis: aiResponseContent
      })
    } catch (err) {
      logger.error('Error invoking Gemma API:', err)
      return res.status(500).json({
        error: 'Internal server error while invoking AI analysis',
        details: err.message
      })
    }
  })

  return router
}
