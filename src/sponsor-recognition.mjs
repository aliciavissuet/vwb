// Dates are UTC calendar dates. The end date is exclusive: the same date 12 months later.
export function recognitionSchedule(startDate) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(startDate)) throw new Error('Use a YYYY-MM-DD start date')
  const start = new Date(`${startDate}T00:00:00Z`)
  if (Number.isNaN(start.valueOf()) || start.toISOString().slice(0, 10) !== startDate) throw new Error('Invalid start date')
  const endYear = start.getUTCFullYear() + 1
  const endMonth = start.getUTCMonth()
  const endDay = Math.min(start.getUTCDate(), new Date(Date.UTC(endYear, endMonth + 1, 0)).getUTCDate())
  const end = new Date(Date.UTC(endYear, endMonth, endDay))
  const reminder = new Date(end)
  reminder.setUTCDate(reminder.getUTCDate() - 30)
  return { recognition_end: end.toISOString().slice(0, 10), reminder_due: reminder.toISOString().slice(0, 10) }
}

export function publicRecognitionAllowed(record, today) {
  if (record.sponsorship_agreement_status !== 'signed' && record.sponsorship_agreement_status !== 'completed') return false
  if (!record.signed_at || !record.recognition_consent || record.anonymity_preference !== 'public') return false
  if (!record.recognition_start || !record.recognition_end || today < record.recognition_start || today >= record.recognition_end) return false
  const expected = recognitionSchedule(record.recognition_start)
  return record.recognition_end === expected.recognition_end
}

export function expirationReminderDue(record, today) {
  if (!publicRecognitionAllowed(record, today) || record.reminder_sent_at) return false
  const expected = recognitionSchedule(record.recognition_start)
  return record.recognition_end === expected.recognition_end && today >= expected.reminder_due && today < expected.recognition_end
}
