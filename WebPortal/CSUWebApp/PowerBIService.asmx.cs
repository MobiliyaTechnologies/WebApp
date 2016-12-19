using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Services;
using System.Web.Script.Services;
using System.Web.Script.Serialization;
using System.Configuration;

namespace CSUWebApp
{
    /// <summary>
    /// Summary description for PowerBIService
    /// </summary>
    [WebService(Namespace = "http://tempuri.org/")]
    [WebServiceBinding(ConformsTo = WsiProfiles.BasicProfile1_1)]
    [System.ComponentModel.ToolboxItem(false)]
    // To allow this Web Service to be called from script, using ASP.NET AJAX, uncomment the following line. 
    // [System.Web.Script.Services.ScriptService]
    public class PowerBIService : System.Web.Services.WebService
    {

        [WebMethod]
        [ScriptMethod(ResponseFormat = ResponseFormat.Json)]
        public void GetAccessToken()
        {
            HttpContext.Current.Response.AddHeader("Access-Control-Allow-Origin", "*");
            Security.AuthenticateUser();
            PowerBIToken token = new PowerBIToken()
            {
                AccessToken = ConfigurationSettings.AppSettings["Access_Token"],
                RefreshToken = ConfigurationSettings.AppSettings["Refresh_Token"]
            };

            System.Web.Script.Serialization.JavaScriptSerializer serializer = new System.Web.Script.Serialization.JavaScriptSerializer();

            this.Context.Response.ContentType = "application/json; charset=utf-8";
            this.Context.Response.Write(serializer.Serialize(new { tokens = token }));

            //return new JavaScriptSerializer().Serialize(token);
        }

        [WebMethod]
        [ScriptMethod(ResponseFormat = ResponseFormat.Json)]
        public void GetTileURL()
        {
            HttpContext.Current.Response.AddHeader("Access-Control-Allow-Origin", "*");
            PowerBIURL embedURL = new PowerBIURL();

            JavaScriptSerializer serializer = new JavaScriptSerializer();
            this.Context.Response.ContentType = "application/json; charset=utf-8";
            this.Context.Response.Write(serializer.Serialize(new { urls = embedURL }));
        }

    }
}
