import { arrowMiddleware } from 'element-plus'
import ConfigProvider from 'element-plus/es/components/config-provider/src/config-provider'
import Mock from 'mockjs'

// 先通过本地的数据模拟,拿到了本地的数据
// 首先通过本地mock拦截了给定的地址(mock.js)
// 通过自己定义user.js有个getUserList
// 在api.js中getUserData时 要将mock置为false,如果是true的话 用的就是线上fastmock的数据
//想要做数据双向绑定 要通过ref和reactive

// get请求从config.url获取参数，post从config.body中获取参数
function param2Obj(url) {
    const search = url.split('?')[1]
    if (!search) {
        return {}
    }
    return JSON.parse(
        '{"' +
        decodeURIComponent(search)
            .replace(/"/g, '\\"')
            .replace(/&/g, '","')
            .replace(/=/g, '":"') +
        '"}'
    )
}
let List = []
const count = 200
//数据库 拿过来
for (let i = 0; i < count; i++) {
    List.push(
        Mock.mock({
            ip: Mock.Random.ip(),
            'port|1000-100000': 1,
            name: Mock.Random.cname(),
            isConnect: Mock.Random.boolean()
        })
    )
}

export default {
    /**
     * 获取列表
     * 要带参数 name, page, limt; name可以不填, page,limit有默认值。
     * @param ip, port,name, isconnect
     * @return {{code: number, count: number, data: *[]}}
     */
    getRobotList: config => {
        const { name, page = 1, limit = 10 } = JSON.parse(config.body)
        const mockList = List.filter(robot => {
            if (name && robot.name.indexOf(name) === -1 && robot.ip.indexOf(name) === -1 && robot.port.toString().indexOf(name) === -1) {
                return false;
            }
            else {
                return true;
            }
        })
        const pageList = mockList.filter((item, index) => index < limit * page && index >= limit * (page - 1))
        return {
            code: 200,
            data: {
                list: pageList,
                count: mockList.length,
            }
        }

    },
    /**
     * 获取机器人当前状态
     * @param {*} 
     */
    getChangeConnectStatusData: config => {
        console.log(config);
        const { ip, isConnect, name, port } = JSON.parse(config.body)
        if(List.some(item=>
            {
                if(ip==item.ip)
                {
                    item.isConnect=!item.isConnect
                    return true
                }
            }))
            {
                return {
                    code:200,
                    msg:"OK"
                }
            }

    },
    /**
     * 增加用户
     * @param ip, port,name, isconnect
     * @return {{code: number, data: {message: string}}}
     */
    addRobot: config => {
        const { ip, port, name, isconnect } = JSON.parse(config.body)
        console.log(JSON.parse(config.body))
        List.unshift({
            ip: ip,
            port: port,
            name: name,
            isConnect: isconnect,
        })
        return {
            code: 200,
            data: {
                message: '添加成功'
            }
        }
    },
    /**
     * 删除用户
     * @param id
     * @return {*}
     */
    deleteRobot: config => {
        const { ip, port, name } = JSON.parse(config.body)
        if (!ip) {
            return {
                code: -999,
                message: '参数不正确'
            }
        } else {
            List = List.filter(u => u.ip !== ip)
            return {
                code: 200,
                message: '删除成功'
            }
        }
    },
   
    /**
     * 修改用户
     * @param ip, port, name, isconnect
     * @return {{code: number, data: {message: string}}}
     */
    editRobot: config => {
        const { ip, port, name, isconnect } = JSON.parse(config.body)
        List.some(u => {
            if (u.ip === ip) {
                u.ip = ip
                u.port = port
                u.name = name
                u.isConnect = isconnect
                return true
            }
        })
        return {
            code: 200,
            data: {
                message: '编辑成功'
            }
        }
    }
}