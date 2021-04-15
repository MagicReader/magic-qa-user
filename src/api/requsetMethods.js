import service from './service'
import constant from './constant'

/**
 * login接口调用-post
 * @param data 关键字
 */
export function login (data) {
  const obj = data
  return service({
    url: constant.LOGIN,
    method: 'post',
    data: obj
  })
}
/**
 * registerStep1-post
 * @param data 关键字
 */
export function register (data, step) {
  const obj = data
  return service({
    url: constant.REGISTER + step,
    method: 'post',
    data: obj
  })
}
/**
 * sendPost接口调用-post
 * @param data 关键字
 */
export function sendPost (data) {
  const obj = data
  return service({
    url: constant.SEND_POST,
    method: 'post',
    data: obj
  })
}
/**
 * sendComment接口调用-post
 * @param data 关键字
 */
export function sendComment (data) {
  const obj = data
  return service({
    url: constant.SEND_COMMENT,
    method: 'post',
    data: obj
  })
}
/**
 * sendReply接口调用-post
 * @param data 关键字
 */
export function sendReply (data) {
  const obj = data
  return service({
    url: constant.SEND_REPLY,
    method: 'post',
    data: obj
  })
}
/**
 * getMessageInfo-get
 * @data data 关键字
 */
export function getMessageInfo (data) { // {uid，currentPage，pageSize}
  const obj = data
  return service({
    url: constant.MESSAGE_INFO,
    method: 'get',
    params: obj
  })
}

/**
 * getAnnouncement-get
 * @data data 关键字
 */
export function getAnnouncement (data) {
  const obj = data
  return service({
    url: constant.ANNOUNCEMENT_INFO,
    method: 'get',
    params: obj
  })
}

/**
 * getAnnouncementDetail-get
 * @data data 关键字
 */
export function getAnnouncementDetail (data) {
  const obj = data
  return service({
    url: constant.ANNOUNCEMENT_INFO_DETAIL,
    method: 'get',
    params: obj
  })
}

/**
 * getUserInfo-get
 * @data data 关键字
 */
export function getUserInfo (data) {
  const obj = data
  return service({
    url: constant.USER_INFO,
    method: 'get',
    params: obj
  })
}
/**
 * getPostInfo-get
 * @data data 关键字
 */
export function getPostInfo (data) {
  const obj = data
  return service({
    url: constant.POST_INFO,
    method: 'get',
    params: obj
  })
}
/**
 * getPostInfo-get
 * @data data 关键字
 */
export function getPostInfoDetail (postId) {
  return service({
    url: constant.POST_INFO_DETAIL + postId,
    method: 'get'
  })
}
/**
 * getCommentInfo-get
 * @data data 关键字
 */
export function getCommentInfo (data) {
  const obj = data
  return service({
    url: constant.COMMENT_INFO,
    method: 'get',
    params: obj
  })
}
/**
 * getReplyInfo-get
 * @data data 关键字
 */
export function getReplyInfo (data) {
  const obj = data
  return service({
    url: constant.REPLY_INFO,
    method: 'get',
    params: obj
  })
}

/**
 * getUserInfoDetail-get
 * @data data 关键字
 */
export function getUserInfoDetail (uid) {
  return service({
    url: constant.USER_INFO_DETAIL + uid,
    method: 'get'
  })
}
