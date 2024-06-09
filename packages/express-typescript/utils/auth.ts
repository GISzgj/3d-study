const authMap = new Map()
// 每个接口所需要的权限
authMap.set('/user/test', { role: ['admin', 'superAdmin'] })

authMap.set('/user/current', { role: ['admin', 'superAdmin'] })
authMap.set('/user/forgetpwd', { role: ['admin', 'superAdmin'] })

authMap.set('/article/page_admin', { role: ['admin', 'superAdmin'] })
authMap.set('/article/update_private', { role: ['admin', 'superAdmin'] })
authMap.set('/article/update_deleted', { role: ['admin', 'superAdmin'] })
authMap.set('/article/add', { role: ['admin', 'superAdmin'] })
authMap.set('/article/delete', { role: ['admin', 'superAdmin'] })
authMap.set('/article/publish', { role: ['admin', 'superAdmin'] })
authMap.set('/article/update', { role: ['admin', 'superAdmin'] })

authMap.set('/comment/get_not_approved', { role: ['admin', 'superAdmin'] })
authMap.set('/comment/page_not_approved', { role: ['admin', 'superAdmin'] })
authMap.set('/comment/review', { role: ['admin', 'superAdmin'] })
authMap.set('/comment/page_admin', { role: ['admin', 'superAdmin'] })
authMap.set('/comment/update', { role: ['admin', 'superAdmin'] })
authMap.set('/comment/delete', { role: ['admin', 'superAdmin'] })

authMap.set('/reply/getReplyOfCommentWaitReview', { role: ['admin', 'superAdmin'] })
authMap.set('/reply/getReplyOfMsgWaitReview', { role: ['admin', 'superAdmin'] })
authMap.set('/reply/unreviewd_reply_page', { role: ['admin', 'superAdmin'] })
authMap.set('/reply/review', { role: ['admin', 'superAdmin'] })

export default authMap
