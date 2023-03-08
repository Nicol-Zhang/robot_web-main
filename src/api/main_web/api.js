/**
 * 整个项目的api管理
 */
import request from "./request";

function getErrorData(params){
    return request.request({
        url:'/main_web/error/getErrorData',
        method:'post',
        data:params,
        mock:false,
    })
}

function addErrorData(params){
    return request.request({
        url:'/main_web/error/addErrorData',
        method:'post',
        data:params,
        mock:false,
    })
}
function changeErrorData(params){
    return request.request({
        url:'/main_web/error/changeErrorData',
        method:'post',
        data:params,
        mock:false,
    })
}
function deleteErrorData(params){
    return request.request({
        url:'/main_web/error/deleteErrorData',
        method:'post',
        data:params,
        mock:false,
    })
}
function solveErrorData(params){
    return request.request({
        url:'/main_web/error/solveErrorData',
        method:'post',
        data:params,
        mock:false,
    })
}
/**
* @module: src\api\main_web\api.js
* @desc: 获取一场解决数据
* @param:
* @return:
*/
function getSolveData(params){
    return request.request({
        url:'/main_web/error/getSolveData',
        method:'post',
        data:params,
        mock:false,
    })
}
function getBackStatus(params){
    return request.request({
        url:'/main_web/home/getBackStatus',
        method:'post',
        data:params,
        mock:false,
    })
}
function connectBack(params){
    return request.request({
        url:'/main_web/home/connectBack',
        method:'post',
        data:params,
        mock:false,
    })
}

function getRobotData(params) {
    return request.request({
        url: '/scheduling_web/robot/getRobot',
        method: 'post',
        // 这个mock如果是true的话 用的就是线上fastmock的数据
        mock: false,
        data: params
    })   
}
function addRobot(params) {
    return request.request({
        url: '/scheduling_web/robot/add',
        method: 'post',
        // 这个mock如果是true的话 用的就是线上fastmock的数据
        mock: false,
        data: params
        // data:{total: 0,page: 1,}
    })
}
function editRobot(params) {
    return request.request({
        url: '/scheduling_web/robot/edit',
        method: 'post',
        // 这个mock如果是true的话 用的就是线上fastmock的数据
        mock: false,
        data: params
    })
}
function deleteRobot(params) {
    return request.request({
        url: '/scheduling_web/robot/delete',
        method: 'post',
        // 这个mock如果是true的话 用的就是线上fastmock的数据
        mock: false,
        data: params
    })
}
function getChangeConnectStatusData(params){
    return request.request({
        url: '/scheduling_web/robot/change',
        method: 'post',
        // 这个mock如果是true的话 用的就是线上fastmock的数据
        mock: false,
        data: params
    })
}


export default {
    getErrorData,
    addErrorData,
    changeErrorData,
    deleteErrorData,
    solveErrorData,
    getSolveData,
    getBackStatus,
    connectBack,
    getRobotData,
    addRobot,
    editRobot,
    deleteRobot,
    getChangeConnectStatusData
}