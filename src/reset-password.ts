import 'dotenv/config'
import { getPayload } from 'payload'

import config from './payload.config'

// One-off admin recovery. Runs only when RESET_ADMIN_PASSWORD is set (see scripts/start.sh).
// Set RESET_ADMIN_EMAIL too if there is more than one user.
async function main() {
  const password = process.env.RESET_ADMIN_PASSWORD
  if (!password) return

  const payload = await getPayload({ config })
  const email = process.env.RESET_ADMIN_EMAIL
  const found = await payload.find({
    collection: 'users',
    limit: 50,
    ...(email ? { where: { email: { equals: email } } } : {}),
  })

  if (found.totalDocs !== 1) {
    const emails = found.docs.map((u) => u.email).join(', ') || 'none'
    console.error(`Password reset skipped: expected exactly 1 matching user, found ${found.totalDocs} (${emails}).`)
    return
  }

  const user = found.docs[0]
  await payload.update({
    collection: 'users',
    id: user.id,
    data: { password, loginAttempts: 0, lockUntil: null },
  })
  console.log(`Password reset for ${user.email}. Remove RESET_ADMIN_PASSWORD now.`)
}

main()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error(err)
    process.exit(0)
  })
