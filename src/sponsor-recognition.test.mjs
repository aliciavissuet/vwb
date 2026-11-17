import { test } from 'node:test'
import { strict as assert } from 'node:assert'
import { recognitionSchedule, publicRecognitionAllowed, expirationReminderDue } from './sponsor-recognition.mjs'

test('recognition ends exactly 12 calendar months after start and reminds 30 days before', () => {
  assert.deepEqual(recognitionSchedule('2026-11-16'), { recognition_end: '2027-11-16', reminder_due: '2027-10-17' })
  assert.deepEqual(recognitionSchedule('2024-02-29'), { recognition_end: '2025-02-28', reminder_due: '2025-01-29' })
})

test('public recognition requires signed agreement, consent, public preference, and active dates', () => {
  const record = { sponsorship_agreement_status: 'signed', signed_at: '2026-11-16', recognition_consent: true, anonymity_preference: 'public', recognition_start: '2026-11-16', recognition_end: '2027-11-16' }
  assert.equal(publicRecognitionAllowed(record, '2027-01-01'), true)
  assert.equal(publicRecognitionAllowed({ ...record, recognition_consent: false }, '2027-01-01'), false)
  assert.equal(publicRecognitionAllowed({ ...record, sponsorship_agreement_status: 'negotiating' }, '2027-01-01'), false)
  assert.equal(publicRecognitionAllowed({ ...record, anonymity_preference: 'anonymous' }, '2027-01-01'), false)
  assert.equal(publicRecognitionAllowed(record, '2027-11-16'), false)
  assert.equal(expirationReminderDue(record, '2027-10-17'), true)
  assert.equal(expirationReminderDue({ ...record, reminder_sent_at: '2027-10-17T12:00:00Z' }, '2027-10-18'), false)
})
