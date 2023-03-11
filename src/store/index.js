import {createStore} from 'vuex'
import exception from "@/store/exception";

export default createStore({
    state:{
        tagList:[
            {
                path: '/home',
                name: 'home',
                label: '首页',
                icon: 'home'
            },
        ],
        projectList:[
            {
                path:'/iwms',
                name:'iwms',
                label:'IWMS',
                icon:'view',
                url:'iwms_web/Iwms.vue',
                connectStatu:false,
                children:[
                    {
                        path: '/iwms/containerBind',
                        name: 'containerBind',
                        label: '料盒绑定',
                        icon: 'view',
                        url: 'iwms_web/ContainerBind.vue',
                    },
                    {
                        path: '/iwms/boxBind',
                        name: 'boxBind',
                        label: '料箱绑定',
                        icon: 'view',
                        url: 'iwms_web/BoxBind.vue',
                    },
                    {
                        path: '/iwms/cloudView',
                        name: 'cloudView',
                        label: '云视管理',
                        icon: 'view',
                        url: 'iwms_web/CloudView.vue',
                    },
                ]
            },
            {
                path:'/scheduling',
                name:'scheduling',
                label:'调度软件',
                icon:'iphone',
                url:'scheduling_web/scheduling.vue',
                connectStatu:false,
                children:[
                    {
                        path: '/scheduling/robotsManager',
                        name: 'robotsManager',
                        label: '机器人管理',
                        icon: 'iphone',
                        url: 'scheduling_web/RobotsManager.vue',
                    },
                    {
                        path: '/scheduling/tasksManager',
                        name: 'tasksManager',
                        label: '任务管理',
                        icon: 'iphone',
                        url: 'scheduling_web/TasksManager.vue',
                    },
                    {
                        path: '/scheduling/mapsManager',
                        name: 'mapsManager',
                        label: '地图管理',
                        icon: 'iphone',
                        url: 'scheduling_web/MapsManager.vue',
                    },
                ]
            },
            {
                path:'/teaching',
                name:'teaching',
                label:'示教软件',
                icon:'pointer',
                url:'teaching_web/Teaching.vue',
                connectStatu:false,
                children:[
                    {
                        path: '/teaching/action1',
                        name: 'action1',
                        label: 'action1',
                        icon: 'pointer',
                        url: 'teaching_web/action1.vue',
                    },
                    {
                        path: '/teaching/action2',
                        name: 'action2',
                        label: 'action2',
                        icon: 'pointer',
                        url: 'teaching_web/action2.vue',
                    },

                ]
            },
            {
                path:'/error',
                name:'error',
                label:'异常处理',
                icon:'warnTriangleFilled',
                url:'main_web/error.vue',
                connectStatu:false,
                children:[
                    {
                        path: '/error/findError',
                        name: 'findError',
                        label: '异常查询',
                        icon: 'search',
                        url: 'main_web/errorFind.vue',
                    },
                    {
                        path: '/error/solveError',
                        name: 'solveError',
                        label: '异常处理',
                        icon: 'check',
                        url: 'main_web/solveError.vue',
                    }
                ]
            },
            //   {
            //       path:'/add',
            //       name:'add',
            //       label:'项目添加',
            //       icon:'plus',
            //       url:'main_web/add.vue',
            //       connectStatu:false,
            //   },

        ],
        addCardList:[
            {
                label: 'IWMS',
                source:{
                    path:'/iwms',
                    name:'iwms',
                    label:'IWMS',
                    icon:'view',
                    url:'iwms_web/Iwms.vue',
                    connectStatu:false,
                    children:[
                        {
                            path: '/iwms/containerBind',
                            name: 'containerBind',
                            label: '料盒绑定',
                            icon: 'view',
                            url: 'iwms_web/ContainerBind.vue',
                        },
                        {
                            path: '/iwms/boxBind',
                            name: 'boxBind',
                            label: '料箱绑定',
                            icon: 'view',
                            url: 'iwms_web/BoxBind.vue',
                        },
                        {
                            path: '/iwms/cloudView',
                            name: 'cloudView',
                            label: '云视管理',
                            icon: 'view',
                            url: 'iwms_web/CloudView.vue',
                        },
                    ]
                }
            },
            {
                label: '调度软件',
                source:{
                    path:'/scheduling',
                    name:'scheduling',
                    label:'调度软件',
                    icon:'iphone',
                    url:'scheduling_web/scheduling.vue',
                    connectStatu:false,
                    children:[
                        {
                            path: '/scheduling/robotsManager',
                            name: 'robotsManager',
                            label: '机器人管理',
                            icon: 'iphone',
                            url: 'scheduling_web/RobotsManager.vue',
                        },
                        {
                            path: '/scheduling/tasksManager',
                            name: 'tasksManager',
                            label: '任务管理',
                            icon: 'iphone',
                            url: 'scheduling_web/TasksManager.vue',
                        },
                        {
                            path: '/scheduling/mapsManager',
                            name: 'mapsManager',
                            label: '地图管理',
                            icon: 'iphone',
                            url: 'scheduling_web/MapsManager.vue',
                        },
                    ]
                },
            },
            {
                label: '示教软件',
                source:{
                    path:'/teaching',
                    name:'teaching',
                    label:'示教软件',
                    icon:'pointer',
                    url:'teaching_web/Teaching.vue',
                    connectStatu:false,
                    children:[
                        {
                            path: '/teaching/action1',
                            name: 'action1',
                            label: 'action1',
                            icon: 'pointer',
                            url: 'teaching_web/action1.vue',
                        },
                        {
                            path: '/teaching/action2',
                            name: 'action2',
                            label: 'action2',
                            icon: 'pointer',
                            url: 'teaching_web/action2.vue',
                        },

                    ]
                },
            },
            {
                label: '异常处理',
                source:{
                    path:'/error',
                    name:'error',
                    label:'异常处理',
                    icon:'warnTriangleFilled',
                    url:'main_web/error.vue',
                    connectStatu:false,
                    children:[
                        {
                            path: '/error/findError',
                            name: 'findError',
                            label: '异常查询',
                            icon: 'search',
                            url: 'main_web/errorFind.vue',
                        },
                        {
                            path: '/error/solveError',
                            name: 'solveError',
                            label: '异常处理',
                            icon: 'check',
                            url: 'main_web/solveError.vue',
                        }
                    ]
                },
            },
        ]
    },
    mutations:{
        addTag(state,tag){
            const {path,name,label,icon}=tag;
            let reTags=state.tagList.filter(item=>item.path===path)
            if(reTags.length<=0)
            {
                state.tagList.push({
                    path:path,
                    name:name,
                    label:label,
                    icon:icon
                })
            }
        },
        deleteTag(state,tag){
            const {path,name,label,icon}=tag;
            let index=state.tagList.findIndex(item=>item.path===path);
            state.tagList.splice(index,1);
        },
        deleteProject(state,project){
            state.projectList = state.projectList.filter(item=>item.name!==project.name);
            console.log(state.projectList);
        },
        addProject(state,project){
            state.projectList.unshift(state.addCardList.find(item=>item.label===project.label).source);
            console.log(state.projectList);
        },

    },
    modules:{
        exception
    }
})