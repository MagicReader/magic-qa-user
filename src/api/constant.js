// 定义项目里需要的所有接口

const BASE = 'http://10.12.28.166:8080/'

// 定义需要的接口
const constant = {
  // post
  LOGIN: BASE + 'login',
  SEND_POST: BASE + 'sendPost',
  SEND_COMMENT: BASE + 'sendComment',
  SEND_REPLY: BASE + 'sendReply',
  // get
  ANNOUNCEMENT_INFO: BASE + 'announcementInfo',
  ANNOUNCEMENT_INFO_DETAIL: BASE + 'announcementInfoDetail',
  MESSAGE_INFO: BASE + 'messageInfo',
  USER_INFO_DETAIL: BASE + 'admin/userInfoDetail?uid=',
  POST_INFO: BASE + 'postInfo',
  POST_INFO_DETAIL: BASE + 'postInfoDetail?post_id=',
  COMMENT_INFO: BASE + 'commentInfo',
  REPLY_INFO: BASE + 'replyInfo'
}

export default constant
