/**
 * 环境配置文件
 * 一般在企业级项目里有三个环境
 * 开发环境
 * 测试环境
 * 线上环境
 */

 const env=import.meta.env.MODE || 'prod'

 const EnvConfig={
     development:
     {
         baseApi: '/',
         // mockApi: 'https://www.fastmock.site/mock/cdb039c61634865791c720b044e5f32c/api',
     },
     test:{
         baseApi:'//test.future.com/api',
         // mockApi:'https://www.fastmock.site/mock/cdb039c61634865791c720b044e5f32c/api'
     },
     prod:{
         baseApi:'//future.com/api',
         // mockApi:'https://www.fastmock.site/mock/cdb039c61634865791c720b044e5f32c/api'
     }
 }
 export default{
     env,
     //mock 总开关
     // mock:true,
     ...EnvConfig[env]
 }