class User {
  constructor(meta) {
    this.avatarUrl = meta.avatar_url // 头像地址
    this.city = meta.city           // 城市
    this.country = meta.country     // 国家
    this.gender = meta.gender       // 性别
    this.language = meta.language   // 语言
    this.nickName = meta.nick_name   // 昵称
    this.province = meta.province   // 省份
    this.openId = meta._openid
  }

  static mapping(source) {
    const { avatarUrl, city, country, gender, language, nickName, province, openId} = source
    return {
      avatar_url: avatarUrl,
      nick_name: nickName,
      _openid: openId,
      city,
      country,
      gender,
      language,
      province
    }
  }
}

export default User
