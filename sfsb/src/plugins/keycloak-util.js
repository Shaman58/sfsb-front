export async function updateToken() {
  try {
    await Vue.$keycloak.updateToken(TOKEN_MIN_VALIDITY_SECONDS)
    return Vue.$keycloak.token
  } catch (error) {
    console.error('Error updating token:', error)
    return null
  }
}
