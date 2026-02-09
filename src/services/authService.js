import { Client, Account, ID } from "appwrite"
import conf from "../conf/conf"

class AuthService {
  client = new Client()
  account

  constructor() {
    this.client
      .setEndpoint(conf.appwriteUrl)
      .setProject(conf.appwriteProjectId)

    this.account = new Account(this.client)
  }

  async signup({ email, password, name }) {
    return await this.account.create(ID.unique(), email, password, name)
  }

  async login({ email, password }) {
    return await this.account.createEmailPasswordSession(email, password)
  }

  async getCurrentUser() {
    try {
      return await this.account.get()
    } catch {
      return null
    }
  }

  async logout() {
    return await this.account.deleteSessions()
  }
}

const authService = new AuthService()
export default authService