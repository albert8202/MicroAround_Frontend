// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import axios from 'axios'
axios.defaults.withCredentials = true;
import VueAxios from 'vue-axios'
import iView from 'iview'
import router from './router'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import 'iview/dist/styles/iview.css'
//写cookies
Vue.prototype.setCookie = function (name, value) {
  var Days = 30;
  var exp = new Date();
  exp.setTime(exp.getTime() + Days * 24 * 60 * 60 * 1000);
  document.cookie = name + "=" + escape(value) + ";expires=" + exp.toGMTString();
}
//读取cookies
Vue.prototype.getCookie = function (name) {
  var arr, reg = new RegExp("(^| )" + name + "=([^;]*)(;|$)");
  if (arr = document.cookie.match(reg)) return unescape(arr[2]);
  else return null;
}
//删除cookies
Vue.prototype.delCookie = function (name) {
  console.log('fff')
  var exp = new Date();
  exp.setTime(exp.getTime() - 1);
  var cval = this.getCookie(name);
  if (cval != null) document.cookie = name + "=" + cval + ";expires=" + exp.toGMTString();
}

//developed by 杨紫超
function checkNumber() {
  for (var i = 0; i < arguments.length; i++) {
    if (!arguments[i] instanceof Number) {
      return false;
    }
  }
  return true;
}
function checkString() {
  for (var i = 0; i < arguments.length; i++) {
    if (!arguments[i] instanceof String) {
      return false;
    }
  }
  return true;
}
function post(url, data) {
  return axios({
    method: "POST",
    url: "http://localhost:8008/" + url,
    //url: url,
    data: data,
  })
}
function get(url) {
  return axios.get("http://localhost:8008/" + url);
}

function createResData(data) {
  var result = new Object();
  result.code = data.code;
  result.message = data.message;
  result.data = null;
  return result
}

function transformUserPublicInfo(res_data) {
  var data = new Object();
  data.user_id = res_data.userId;
  data.nickname = res_data.userNickname
  data.self_introction = res_data.userSelfIntroduction
  data.register_time = res_data.userRegisterTime
  data.followers_num = res_data.userFollowersNum
  data.follows_num = res_data.userFollowsNum
  data.messages_num = res_data.userMessagesNum
  data.avatar_url = res_data.avatarUrl
  data.collection_num = res_data.userCollectionsNum
  return data;
}

function transformUserPrivateInfo(res_data) {
  var data = new Object();
  data.user_id = res_data.userId;
  data.user_email = res_data.userEmail
  data.user_gender = (res_data.userGender) ? res_data.userGender : null
  data.user_password = res_data.userPassword
  data.user_realname = (res_data.userRealName) ? res_data.userRealName : null
  
  return data
}

function transformMessage(res_data){
  var data=new Object();
  data.message_id=res_data.messageId
  data.message_content=res_data.messageContent
  data.message_create_time=res_data.messageCreateTime
  data.message_like_num=res_data.
  data.message_transpond_num
  data.message_comment_num=res_data.messageCommentNum
  data.message_view_num=res_data.messageViewNum
  data.message_has_image=res_data.messageHasImage
  data.message_sender_user_id=null
  data.message_heat=res_data.messageHeat
  data.message_image_count=null;
  data.message_transpond_message_id=null;
  data.message_topics=res_data.messageTopics;
  data.message_ats=res_data.messageAts;
  data.message_image_urls=new Array();
  return data
}

function transformTopic(res_data){
  var data=new Object()
  data.topic_id=res_data.topicId
  data.topic_heat=res_data.topicHeat
  data.topic_content=res_data.topicContent
  return data;
}

///////////////////////////////////////////
//USER
Vue.prototype.checkLogin = function () {
  return get("api/user/checkIfSignUp").then(res => {
    var result = createResData(res.data);
    result.data = new Object();
    console.log(1111, res.data)
    if (res.data.code == 200) {
      result.message = "Aready login"
    } else {
      result.message = "Need Authentication"
    }
    res.data = result;
    return Promise.resolve(res);;
  })

}
//getUserPublicInfo
Vue.prototype.getUserPublicInfo = function (user_id) {
  if (!checkNumber(user_id)) {
    return null;
  }
  return get("api/user/getUserPublicInfo/" + user_id).then(res => {
    var result = createResData(res.data);
    var res_data = res.data.data;
    result.data = transformUserPublicInfo(res_data);
    res.data = result;
    return Promise.resolve(res);
  });
}
//getUserAllInfo
Vue.prototype.getUserAllInfo = function () {
  return get(
    "api/user/getAllUserInfo"
  ).then(res => {
    var result = createResData(res.data);
    result.data = new Object();
    var res_data = res.data.data;
    result.data.userPublicInfo = transformUserPublicInfo(res_data);
    result.data.user_Private_Info = transformUserPrivateInfo(res_data);
    res.data = result;
    return Promise.resolve(res);
  });
}
//register(data : {email, password, nickname})
Vue.prototype.register = function (data) {
  console.log("register run")
  if (!checkString(data.email, data.password, data.nickname)) {
    return null;
  }
  console.log("post ok")
  return post("api/user/signUp", data);
}
//signIn(data : {email, password})
Vue.prototype.signIn = function (data) {
  if (!checkString(data.email, data.password)) {
    return null;
  }
  return post("api/user/signIn", data).then(res => {
    var result = createResData(res.data);
    var data = new Object();
    data.user_id = res.data.data
    result.data = data;
    res.data = result;
    return Promise.resolve(res);
  });
}
//editInfo(data: {nickname, password. realname, gender, self_introduction})
Vue.prototype.editInfo = function (data) {
  if (!checkString(data.nickname, data.password, data.realname, data.gender, data.self_introduction)) {
    return null;
  }
  return post("api/user/editInfo", data);
}
//setAvatar(avatar_id)
Vue.prototype.setAvatar = function (avatar_id) {
  if (!checkNumber(avatar_id)) {
    return null;
  }
  return get("api/User/setAvatar/" + avatar_id);
}
//getAvatarImageSrc(user_id)
Vue.prototype.getAvatarImageSrc = function (user_id) {
  if (!checkNumber(user_id)) {
    return null;
  }
  return get("api/user/getAvatarImageSrc/" + user_id);
}
//logOut()
Vue.prototype.logOut = function () {
  return get("api/user/logout");
}
//uploadAvatar(formData)
// formData : {'file': file}
Vue.prototype.uploadAvatar = function (params, config) {
  return axios
    .post(
      "/api/User/uploadAvatar",
      params,
      config
    )
}
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//RECOMMEND
//getRecommendUsers()
Vue.prototype.getRecommendUsers = function () {
  return get("api/user/getRecommend").then(res => {
    var result = createResData(res.data);
    var data = new Array();
    var res_data = res.data.data;
    for (var i of res_data) {
      var temp = new Object()
      temp.user_id = i.userId
      temp.user_nickname = i.userNickname
      temp.followers_num = i.avatarUrl
      temp.avatar_url = i.userFollowersNum
      data.push(temp);
    }
    result.data = data;
    res.data = result
    return Promise.resolve(res);
  });
}
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//SEARCH
//search(searchKey)
Vue.prototype.search = function (searchKey, startFrom, limitation) {
  var data = {
    startFrom: startFrom,
    limitation: limitation
  }
  if (!checkString(searchKey)) {
    return null;
  }
  return post("api/search/" + searchKey, data).then(res=>{
    var data=new Object();
    var result=createResData(res.data)
    var message_infos=res.data.data[0]
    var messages=new Array()
    for(var i of message_infos){
      messages.push(transformMessage(i));
    }

    var user_infos=res.data.data[1]
    var users=new Array()
    for(var i of user_infos){
      users.push(transformUserPublicInfo(i))
    }

    var topic_infos=res.data.data[2]
    var topics=new Array()
    for(var i of topic_infos){
      topics.push(transformTopic(i));
    }
    data.twitters=messages;
    data.users=users;
    data.topics=topics;
    result.data=data;
    res.data=result;
    return Promise.resolve(res)
  });
}

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//TOPIC
//queryMessagesContains(topic_id)
Vue.prototype.queryMessagesContains = function (topic_id, startFrom, limitation) {
  if (!checkNumber(topic_id)) {
    return null;
  }

  var data = {
    startFrom: startFrom,
    limitation: limitation
  }
  return post("api/topic/queryMessagesByTopic/" + topic_id, data).then(res=>{
    var message_infos=res.data.data
    var result=createResData(res.data)
    var messages=new Array()
    for(var i of message_infos){
      messages.push(transformMessage(i))
    }
    result.data=messages
    res.data=result
    return Promise.resolve(res)
  });
}
//queryTopicsBaseOnHeat(startFrom, limitation)
Vue.prototype.queryTopicsBaseOnHeat = function (startFrom, limitation) {

  var data = {
    startFrom: startFrom,
    limitation: limitation
  }
  return post("api/topic/queryTopicsBaseOnHeat", data).then(res=>{
    var topic_infos=res.data.data
    var result=createResData(res.data)
    var topics=new Array()
    for(var i of topic_infos){
      topics.push(transformTopic(i))
    }
    result.data=topics
    res.data=result
    return Promise.resolve(res)
  });
}
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//RELATION
var RELATION = "api/relation/";
//followSb(user_id)
Vue.prototype.followSb = function (user_id) {
  if (!checkNumber(user_id)) {
    console.log("followSb")
    return null;
  }
  return get(RELATION + "follow/" + user_id);
}
//queryFollowingFor(user_id, startFrom, limitation)
Vue.prototype.queryFollowingFor = function (user_id, startFrom, limitation) {
  if (!checkNumber(user_id)) {
    return null;
  }

  var data = {
    startFrom: startFrom,
    limitation: limitation
  }
  return post(RELATION + "queryFollowingFor/" + user_id, data).then(res=>{
    var user_infos=res.data.data
    var result=createResData(res.data)
    var users=new Array()
    for(var i of user_infos){
      users.push(transformUserPublicInfo(i))
    }
    result.data=users
    res.data=result
    return Promise.resolve(res)
  });
}
//queryFollowersFor(user_id, startFrom, limitation)
Vue.prototype.queryFollowersFor = function (user_id, startFrom, limitation) {
  if (!checkNumber(user_id)) {
    return null;
  }

  var data = {
    startFrom: startFrom,
    limitation: limitation
  }
  return post(RELATION + "queryFollowersFor/" + user_id, data).then(res=>{
    var user_infos=res.data.data
    var result=createResData(res.data)
    var users=new Array()
    for(var i of user_infos){
      users.push(transformUserPublicInfo(i))
    }
    result.data=users
    res.data=result
    return Promise.resolve(res)
  });
}
//cancelFollowingTo(user_id)
Vue.prototype.cancelFollowingTo = function (user_id) {
  if (!checkNumber(user_id)) {
    return null;
  }
  return get(RELATION + "cancelFollowingTo/" + user_id);
}
//if_following(follower_id, be_followed_id)
Vue.prototype.if_following = function (follower_id, be_followed_id) {
  if (!checkNumber(follower_id, be_followed_id)) {
    return null;
  }
  return post(RELATION + "if_following?follower_id=" + follower_id + "&be_followed_id=" + be_followed_id).then(res=>{
    var data=new Object()
    if(res.data.data!=0){
      data.if_following=true;
    }else{
      data.if_following=false;
    }
    res.data.data=data
    return Promise.resolve(res)
  });
}
//if_following_by_me(be_followed_id)
Vue.prototype.if_following_by_me = function (be_followed_id) {
  if (!checkNumber(be_followed_id)) {
    return null;
  }
  console.log(RELATION + "if_following_by_me/" + be_followed_id)
  return get(RELATION + "ifFollowingByMe/" + be_followed_id).then(res=>{
    var data=new Object()
    if(res.data.data!=0){
      data.if_following=true;
    }else{
      data.if_following=false;
    }
    res.data.data=data
    return Promise.resolve(res)
  });
}
/////////////////////////////////////////////////////////////////////////////////////////////////////////
//LIKE点赞
//like(message_id)
var LIKE = "api/Like/";
Vue.prototype.like = function (message_id) {
  if (!checkNumber(message_id)) {
    return null;
  }
  return get(LIKE + message_id);
}
//cancelLike(message_id)
Vue.prototype.cancelLike = function (message_id) {
  if (!checkNumber(message_id)) {
    return null;
  }
  return get(LIKE + "cancel/" + message_id);
}
//queryLikes(user_id)
Vue.prototype.queryLikes = function (user_id) {
  if (!checkNumber(user_id)) {
    return null;
  }
  var data = {
    startFrom: startFrom,
    limitation: limitation
  }
  return post(
    LIKE + "query/" + user_id,data 
  ).then(res=>{
    var message_infos=res.data.data
    var result=createResData(res.data)
    var messages=new Array()
    for(var i of message_infos){
      messages.push(transformMessage(i))
    }
    result.data=messages
    res.data=result
    return Promise.resolve(res)
  })
}
//checkUserLikesMessage(user_id, message_id)
Vue.prototype.checkUserLikesMessage = function (user_id, message_id) {
  if (!checkNumber(user_id, message_id)) {
    return null;
  }
  return post(LIKE + "checkUserLikesMessage?user_id=" + user_id + "&message_id=" + message_id).then(res=>{
    var data=new Object()
    if(res.data.data!=0){
      data.like=true;
    }else{
      data.like=false;
    }
    res.data.data=data
    return Promise.resolve(res)
  });
}
///////////////////////////////////////////////////////////////////////////////////////////////////////////
//PRIVATE_LETTER私信
var PRIVATE_LETTER = "api/PrivateLetter/";
//queryForMe(startFrom, limitation)
Vue.prototype.queryForMe = function (startFrom, limitation) {

  var data = {
    startFrom: startFrom,
    limitation: limitation
  }
  return post(PRIVATE_LETTER + "queryForMe", data);
}
//sendPrivateLetter(user_id, letter)
//发送私信
Vue.prototype.sendPrivateLetter = function (user_id, content) {
  if (!checkNumber(user_id) || !checkString(content)) {
    return null;
  }
  var data = {
    private_letter_content: content
  }
  return post(PRIVATE_LETTER + "send/" + user_id, data);
}
//deletePrivateLetter(private_letter_id)
Vue.prototype.deletePrivateLetter = function (private_letter_id) {
  if (!checkNumber(private_letter_id)) {
    return null;
  }
  return get(PRIVATE_LETTER + "delete/" + private_letter_id);
}
///api/PrivateLetter/queryLatestContact(startForm, limitation)
Vue.prototype.queryLatestContact = function (startFrom, limitation) {
  var data = {
    startFrom: startFrom,
    limitation: limitation
  }
  return post(PRIVATE_LETTER + "queryLatestContact", data);
}
///api/PrivateLetter/querySpecified
Vue.prototype.querySpecified = function (contact_id, startFrom, limitation) {
  var data = {
    startFrom: startFrom,
    limitation: limitation
  }
  return post(PRIVATE_LETTER + "querySpecified/" + contact_id, data);
}


///////////////////////////////////////////////////////////////////////////////
//MESSAGE推特
var MESSAGE = "api/Message/";
//queryMessage(message_id)
Vue.prototype.queryMessage = function (message_id) {
  if (!checkNumber(message_id)) {
    return null;
  }
  return post(MESSAGE + "query?message_id=" + message_id);
}
///api/Message/queryNewestMessage
Vue.prototype.queryNewestMessage = function (startFrom, limitation) {
  if (!checkNumber(startFrom, limitation)) {
    return null;
  }
  let data = {
    startFrom: startFrom,
    limitation: limitation
  }
  return post(MESSAGE + "queryNewestMessage", data);
}
//queryMessagesOf(user_id, startFrom, limitation)
Vue.prototype.queryMessagesOf = function (user_id, startFrom, limitation) {
  if (!checkNumber(user_id, startFrom, limitation)) {
    return null;
  }
  var data = {
    startFrom: startFrom,
    limitation: limitation
  }
  return post(MESSAGE + "queryMessage/" + user_id, data)
}
//queryFollowMessage(startFrom, limitation)
Vue.prototype.queryFollowMessage = function (startFrom, limitation) {
  var data = {
    startFrom: startFrom,
    limitation: limitation
  }
  return post(MESSAGE + "queryFollowMessage", data);
}
//sendMessage(formData: {message_content, message_has_image, message_image_count, files})
Vue.prototype.sendMessage = function (formData) {
  return post(MESSAGE + "send", formData);
}
//transpond(formData: {message_content, message_source_is_transpond, message_transpond_message_id})
// 文字内容， 将要转发的推特是否也是转发的推特， 将要转发的推特的id
Vue.prototype.transpond = function transpond(formData) {
  return post(MESSAGE + "transpond", formData);
}
//deleteMessage(message_id)
Vue.prototype.deleteMessage = function (message_id) {
  return post(MESSAGE + "delete?message_id=" + message_id);
}
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//COLLECTION 收藏
var COLLECTION = "api/Collection/"
//addCollection(message_id)
Vue.prototype.addCollection = function (message_id) {
  return post(COLLECTION + "add?message_id=" + message_id);
}
//deleteCollection(message_id)
Vue.prototype.deleteCollection = function (message_id) {
  return post(COLLECTION + "delete?message_id=" + message_id);
}
//queryCollections(startFrom, limitation)
//查询自己的收藏列表
Vue.prototype.queryCollections = function (user_id, startFrom, limitation) {
  var data = {
    startFrom: startFrom,
    limitation: limitation
  }
  console.log("查看收藏：：：：" + COLLECTION + "query/" + user_id)
  return post(COLLECTION + "query/" + user_id, data);
}
//checkUserCollectMessage(user_id, message_id)
//检查是否收藏
Vue.prototype.checkUserCollectMessage = function (user_id, message_id) {
  if (!checkNumber(user_id, message_id)) {
    return null;
  }
  return post(COLLECTION + "checkUserCollectMessage?user_id="
    + user_id
    + "&message_id="
    + message_id);
}
//getCollectionNum(user_id)
//获取收藏数量
Vue.prototype.getCollectionNum = function (user_id) {
  return post(COLLECTION + "getCollectionNum?user_id=" + user_id);
}
//////////////////////////////////////////////////////////////////////////////////////////////
//AT 艾特
var AT = "api/At/";
//queryAtMe(startFrom, limitation)
Vue.prototype.queryAtMe = function (startFrom, limitation) {
  var data = {
    startFrom: startFrom,
    limitation: limitation
  }
  return post(AT + "query", data);
}
Vue.prototype.queryUnreadAt = function () {
  console.log("Atljklk")
  return get(AT + "queryUnreadAt");
}

//////////////////////////////////////////////////////
//评论
var COMMENT = "api/Comment/";
Vue.prototype.queryComment = function (id, data) {
  return post(COMMENT + 'queryComments/' + id, data);
}
Vue.prototype.addComment = function (id, data) {
  return post(COMMENT + 'add/' + id, data);
}




function toEmotion(text, isNoGif) {
  var list = ['微笑', '撇嘴', '色', '发呆', '得意', '流泪', '害羞', '闭嘴', '睡', '大哭', '尴尬', '发怒', '调皮', '呲牙', '惊讶', '难过', '酷', '冷汗', '抓狂', '吐', '偷笑', '愉快', '白眼', '傲慢', '饥饿', '困', '惊恐', '流汗', '憨笑', '大兵', '奋斗', '咒骂', '疑问', '嘘', '晕', '折磨', '衰', '骷髅', '敲打', '再见', '擦汗', '抠鼻', '鼓掌', '糗大了', '坏笑', '左哼哼', '右哼哼', '哈欠', '鄙视', '委屈', '快哭了', '阴险', '亲亲', '吓', '可怜', '菜刀', '西瓜', '啤酒', '篮球', '乒乓', '咖啡', '饭', '猪头', '玫瑰', '凋谢', '示爱', '爱心', '心碎', '蛋糕', '闪电', '炸弹', '刀', '足球', '瓢虫', '便便', '月亮', '太阳', '礼物', '拥抱', '强', '弱', '握手', '胜利', '抱拳', '勾引', '拳头', '差劲', '爱你', 'NO', 'OK', '爱情', '飞吻', '跳跳', '发抖', '怄火', '转圈', '磕头', '回头', '跳绳', '挥手', '激动', '街舞', '献吻', '左太极', '右太极', '嘿哈', '捂脸', '奸笑', '机智', '皱眉', '耶', '红包', '鸡'];

  if (!text) {
    return text;
  }

  text = text.replace(/\[[\u4E00-\u9FA5]{1,3}\]/gi, function (word) {
    var newWord = word.replace(/\[|\]/gi, '');
    var index = list.indexOf(newWord);
    var backgroundPositionX = -index * 24
    var imgHTML = '';
    if (index < 0) {
      return word;
    }

    if (isNoGif) {
      if (index > 104) {
        return word;
      }
      imgHTML = `<i class="static-emotion" style="background:url(https://res.wx.qq.com/mpres/htmledition/images/icon/emotion/default218877.gif) ${backgroundPositionX}px 0;"></i>`
    } else {
      var path = index > 104 ? '/img' : 'https://res.wx.qq.com/mpres/htmledition/images/icon';
      imgHTML = `<img class="static-emotion-gif" style="vertical-align: middle" src="${path}/emotion/${index}.gif">`
    }
    return imgHTML;
  });
  return text;
}


Vue.directive('emotion', {
  bind: function (el, binding) {
    el.innerHTML = toEmotion(binding.value)
  }
});






Vue.config.productionTip = false
Vue.use(VueAxios, axios)
Vue.use(iView, {
  transfer: true,
  select: {
    arrowSize: 0
  }
});
Vue.use(ElementUI)
/* eslint-disable no-new */

router.beforeEach((to, from, next) => {
  iView.LoadingBar.start();
  next();
});

router.afterEach(route => {
  iView.LoadingBar.finish();
});

new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})




