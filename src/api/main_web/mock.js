import Mock from "mockjs";
import errorApi from "./mockData/errorData.js"
import solveApi from "./mockData/solveData.js"
import backApi from "./mockData/backData.js"
import robotApi from "../scheduling_web/robot.js"

//拦截ajax请求
// Mock.mock('/home/getData',homeApi.getHomeData)
Mock.mock('/main_web/error/getErrorData',errorApi.getErrorData)
Mock.mock('/main_web/error/addErrorData',errorApi.addErrorData)
Mock.mock('/main_web/error/changeErrorData',errorApi.changeErrorData)
Mock.mock('/main_web/error/deleteErrorData',errorApi.deleteErrorData)
Mock.mock('/main_web/error/solveErrorData',solveApi.solveErrorData)
Mock.mock('/main_web/error/getSolveData',solveApi.getSolveData)

Mock.mock('/main_web/home/getBackStatus',backApi.getBackStatus)
Mock.mock('/main_web/home/connectBack',backApi.connectBack)
// Mock.mock(/user\/getUser/,'get',useApi.getUserList)
Mock.mock('/scheduling_web/robot/getRobot',robotApi.getRobotList)

Mock.mock('/scheduling_web/robot/change', robotApi.getChangeConnectStatusData)
Mock.mock('/scheduling_web/robot/add', robotApi.addRobot)
Mock.mock('/scheduling_web/robot/edit', robotApi.editRobot)
Mock.mock('/scheduling_web/robot/delete', robotApi.deleteRobot)