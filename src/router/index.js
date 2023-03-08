import { createRouter, createWebHistory } from 'vue-router'
import MainView from '../views/Main.vue'
import HomeView from '../views/main_web/Home.vue'
import AddView from '../views/main_web/Add.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'main',
      component: MainView,
      redirect:'/home',
      children:[
        {
          path: '/home',
          name: 'home',
          component: HomeView,
        },
        {
          path: '/iwms',
          name: 'iwms',        
          children:[
            {
              path: '/iwms/boxBind',
              name: 'boxBind',
              component: ()=>import('../views/iwms_web/BoxBind.vue')
            },
            {
              path: '/iwms/containerBind',
              name: 'containerBind',
              component: ()=>import('../views/iwms_web/ContainerBind.vue')
            },
            {
              path: '/iwms/cloudView',
              name: 'cloudView',
              component: ()=>import('../views/iwms_web/CloudView.vue')
            },
          ]
        },
        {
          path: '/scheduling',
          name: 'scheduling',
          children:[
            {
              path: '/scheduling/robotsManager',
              name: 'robotsManager',
              component: ()=>import('../views/scheduling_web/RobotsManager.vue'),
            },
            {
              path: '/scheduling/mapsManager',
              name: 'mapsManager',
              component: ()=>import('../views/scheduling_web/MapsManager.vue')
            },
            {
              path: '/scheduling/tasksManager',
              name: 'tasksManager',
              component: ()=>import('../views/scheduling_web/TasksManager.vue')
            },
          ]
        },
        {
          path: '/teaching',
          name: 'teaching',
          children:[
            {
              path: '/teaching/action1',
              name: 'action1',
              component: ()=>import('../views/teaching_web/Action1.vue')
            },
            {
              path: '/teaching/action2',
              name: 'action2',
              component: ()=>import('../views/teaching_web/Action2.vue')
            },
          ]
        },
        {
          path: '/add',
          name: 'add',
          component: AddView,
        },
        {
          path: '/error',
          name: 'error',
          children:[
            {
              path: '/error/findError',
              name: 'findError',
              component: ()=>import('../views/main_web/FindError.vue')
            },
            {
              path: '/error/solveError',
              name: 'solveError',
              component: ()=>import('../views/main_web/SolveError.vue')
            },
          ]
        },
      ]
    },  
  ]
})

export default router
