export class DatabaseAdapter {
  async connect () {
    throw new Error('connect() must be implemented by a subclass.')
  }

  /**
   * @param {{ sessionId?: string, meetingUniqueId?: string, conferenceId?: string, minDate?: number, maxDate?: number, page?: number, limit?: number }} params
   * @returns {Promise<{ results: Array<object>, total: number } | Array<object>>}
   */
  async doQuery (params) {
    throw new Error('doQuery() must be implemented by a subclass.')
  }
}
