using System;
using System.Collections.Generic;
using System.Diagnostics.CodeAnalysis;
using System.Text;


namespace DataMysql.Dto
{
    public class TaskSend
    {
        /// <summary>
        /// 任务名称
        /// </summary>
       
        public string task_id { get; set; }

        /// <summary>
        /// 起点
        /// </summary>
        public string source_id { get; set; }
        /// <summary>
        /// 终点
        /// </summary>

        public string id { get; set; }


        /// <summary>
        /// 站点工作内容列表
        /// </summary>
        public List<Works> works { get; set; }

        //docking_mode 停靠方式，0普通型，1接驳型
        public int docking_mode { get; set; }
        /// <summary>
        /// 站点x坐标
        /// </summary>
     
        public double x { get; set; }
        /// <summary>
        /// 站点y坐标
        /// </summary>
       
        public double y { get; set; }
        /// <summary>
        /// 站点角度
        /// </summary>
        
        public double angle { get; set; }

        public string title { get; set; }

    }

    //public class TaskSends
    //{

    //    /// <summary>
    //    /// 任务名称
    //    /// </summary>

    //    public string task_id { get; set; }

    //    /// <summary>
    //    /// 起点
    //    /// </summary>
    //    public string source_id { get; set; }
    //    /// <summary>
    //    /// 终点
    //    /// </summary>

    //    public string id { get; set; }

    //    /// <summary>
    //    /// 站点工作内容列表
    //    /// </summary>
    //    public string[] works { get; set; }

    //}
    //}
    /// <summary>
    /// 修改机器人名任务
    /// </summary>
    public class EditNameTaskSend

    {

        /// <summary>
        /// 任务名称
        /// </summary>
           public string task_id { get; set; }
        /// <summary>
        /// 机器人id
        /// </summary>
      //  public string robotid { get; set; }
        /// <summary>
        /// 新的名字
        /// </summary>
              public string robot_name{ get; set; }  
    }
  
    /// <summary>
    /// 物料信息
    /// </summary>
    public class Materials
    {
        /// <summary>
        /// 物料名称
        /// </summary>
        public string materialName { get; set; }
        /// <summary>
        /// 库位
        /// </summary>
        public string location { get; set; }
    }

    /// <summary>
    /// 站点工作内容
    /// </summary>
    public class Works
    {
       
        /// <summary>
        /// 站点动作
        /// </summary>
        public string work_id { get; set; }
        /// <summary>
        /// 物料信息列表
        /// </summary>
        public List<Materials> materials { get; set; }

        /// <summary>
        /// 站点信息
        /// </summary>
        public string sitestation { get; set; }
    }
}
