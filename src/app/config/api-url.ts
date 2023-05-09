export enum ApiUrl {
  API_URL_PREFIX = '/api',
  LOGIN = '/auth/login',
  LOGOUT = '/auth/logout',
  GET_USER = '/user/info',
  SAVE_USER = '/user/save',
  REGISTER = '/auth/reg',
  GET_TEST_ACCOUNT = '/auth/testAccount',
  GET_BOT_INFO = '/bot/info',
  GET_BOT_LIST = '/bot/botList',
  SAVE_BOT = '/bot/save',
  GET_MESSAGE_LIST = '/chat/msgLogs',
  SEND_MESSAGE = '/chat/sendMsg',
  SEND_MESSAGE_WITH_HISTORY = '/chat/sendMsgWithHistory',
  SEND_STREAM_MESSAGE = '/chat/stream',
  VOTE_MESSAGE = '/chat/likeUnlike'
}
