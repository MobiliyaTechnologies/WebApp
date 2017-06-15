using System;
using System.Collections.Generic;
using System.Linq;
using System.IO;
using System.Web;
using System.Web.Services;
using System.Web.Script.Services;
using System.Web.Script.Serialization;
using System.Configuration;
using Newtonsoft.Json;
using CSUWebApp.Models;
using System.Threading.Tasks;
using System.Net.Http;
using PBIWebApp;

namespace CSUWebApp
{
    /// <summary>
    /// Summary description for PowerBIService
    /// </summary>
    [WebService(Namespace = "http://tempuri.org/")]
    [WebServiceBinding(ConformsTo = WsiProfiles.BasicProfile1_1)]
    [System.ComponentModel.ToolboxItem(false)]
    [ScriptService]
    // To allow this Web Service to be called from script, using ASP.NET AJAX, uncomment the following line. 
    // [System.Web.Script.Services.ScriptService]
    public class PowerBIService : System.Web.Services.WebService
    {

        [WebMethod]
        [ScriptMethod(ResponseFormat = ResponseFormat.Json)]
        public void GetAccessToken()
        {
            //HttpContext.Current.Response.AddHeader("Access-Control-Allow-Origin", "*");
            //var isSuccess = Security.AuthenticateUser();
            //if (!isSuccess)
            //{
            //    System.Web.Script.Serialization.JavaScriptSerializer serializer = new System.Web.Script.Serialization.JavaScriptSerializer();
            //    this.Context.Response.ContentType = "application/json; charset=utf-8";
            //    this.Context.Response.Write(serializer.Serialize(new { tokens = "" }));
            //}        
            //else
            //{
            //    PowerBIToken token = new PowerBIToken()
            //    {
            //        AccessToken = ConfigurationSettings.AppSettings["Access_Token"],
            //        RefreshToken = ConfigurationSettings.AppSettings["Refresh_Token"]
            //    };

            //    System.Web.Script.Serialization.JavaScriptSerializer serializer = new System.Web.Script.Serialization.JavaScriptSerializer();

            //    this.Context.Response.ContentType = "application/json; charset=utf-8";
            //    this.Context.Response.Write(serializer.Serialize(new { tokens = token }));
            //}
            //return new JavaScriptSerializer().Serialize(token);
            var token = GetToken();

            System.Web.Script.Serialization.JavaScriptSerializer serializer = new System.Web.Script.Serialization.JavaScriptSerializer();

            this.Context.Response.ContentType = "application/json; charset=utf-8";
            this.Context.Response.Write(serializer.Serialize(new { tokens = token.Result }));
            //return tokenRes.AccessToken;
        }

        public async Task<PowerBIToken> GetToken()
        {
            string pBiUser = ConfigurationManager.AppSettings["Username"];
            string pBiPwd = ConfigurationManager.AppSettings["Password"];
            string pBiClientId = ConfigurationManager.AppSettings["ClientId"];
            string pBiSecret = ConfigurationManager.AppSettings["ClientSecret"];

            if (string.IsNullOrEmpty(pBiUser) || string.IsNullOrEmpty(pBiPwd) || string.IsNullOrEmpty(pBiClientId) || string.IsNullOrEmpty(pBiSecret))
            {
                return null;
            }
            string tokenEndpointUri = "https://login.microsoftonline.com/common/oauth2/token";

            var content = new FormUrlEncodedContent(new[]
                {
                        new KeyValuePair<string, string>("grant_type", "password"),
                        new KeyValuePair<string, string>("username", pBiUser),
                        new KeyValuePair<string, string>("password", pBiPwd),
                        new KeyValuePair<string, string>("client_id", pBiClientId),
                        new KeyValuePair<string, string>("client_secret", pBiSecret),
                        new KeyValuePair<string, string>("resource", "https://analysis.windows.net/powerbi/api")
            });
            AzureResponse tokenRes = new AzureResponse();
            using (var client = new HttpClient())
            {
                HttpResponseMessage res = client.PostAsync(tokenEndpointUri, content).Result;

                string json = await res.Content.ReadAsStringAsync();

                tokenRes = JsonConvert.DeserializeObject<AzureResponse>(json);

                PowerBIToken token = new PowerBIToken()
                {
                    AccessToken = tokenRes.access_token,
                    RefreshToken = tokenRes.refresh_token
                };

                return token;
            }
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



        [WebMethod]
        public string updateConfig()
        {
            var configs = LoadAllConfig();
            var json = JsonConvert.SerializeObject(configs);
            File.WriteAllText(HttpContext.Current.Server.MapPath("~\\config.json"), json);
            return "Updated";
        }

        [WebMethod]
        public string updateFirebaseConfig(FirebaseConfig config)
        {
            var json = JsonConvert.SerializeObject(config);
            File.WriteAllText(HttpContext.Current.Server.MapPath("~\\firebaseConfig.json"), json);
            return "Updated";
        }

        [WebMethod]
        public string updatePowerBiCredentials(String ClientId, String ClientSecret, String Username, String Password)
        {
            Configuration objConfig = System.Web.Configuration.WebConfigurationManager.OpenWebConfiguration("~");
            AppSettingsSection objAppsettings = (AppSettingsSection)objConfig.GetSection("appSettings");
            if (objAppsettings != null)
            {
                objAppsettings.Settings["ClientId"].Value = ClientId;
                objAppsettings.Settings["ClientSecret"].Value = ClientSecret;
                objAppsettings.Settings["Username"].Value = Username;
                objAppsettings.Settings["Password"].Value = Password;
                objConfig.Save();
            }

            //System.Configuration.ConfigurationManager.AppSettings["ClientId"] = ClientId;
            //System.Configuration.ConfigurationManager.AppSettings["ClientSecret"] = ClientSecret;

            return "updated";
        }

        Dictionary<string, string> LoadAllConfig()
        {
            Dictionary<string, string> configs = new Dictionary<string, string>();
            configs.Add("restServer", System.Configuration.ConfigurationManager.AppSettings["restServer"]);
            configs.Add("b2cApplicationId", System.Configuration.ConfigurationManager.AppSettings["b2cApplicationId"]);
            configs.Add("tenantName", System.Configuration.ConfigurationManager.AppSettings["tenantName"]);
            configs.Add("signInPolicyName", System.Configuration.ConfigurationManager.AppSettings["signInPolicyName"]);
            configs.Add("signInSignUpPolicyName", System.Configuration.ConfigurationManager.AppSettings["signInSignUpPolicyName"]);
            configs.Add("editProfilePolicyName", System.Configuration.ConfigurationManager.AppSettings["editProfilePolicyName"]);
            configs.Add("redirect_uri", System.Configuration.ConfigurationManager.AppSettings["redirect_uri"]);
            configs.Add("adB2CSignIn", System.Configuration.ConfigurationManager.AppSettings["adB2CSignIn"]);
            configs.Add("adB2CSignInSignUp", System.Configuration.ConfigurationManager.AppSettings["adB2CSignInSignUp"]);

            return configs;
        }

        [WebMethod]
        public string SaveUrl(RequestUrlModel requestParams)
        {
            var fileData = GetData();
            ResponseUrlModel response = new ResponseUrlModel(null, null, null, null);
            switch (requestParams.Type)
            {
                case "organization":
                    response = new ResponseUrlModel(requestParams.Values, fileData.premise, fileData.building, fileData.feedback);
                    break;
                case "premise":
                    response = new ResponseUrlModel(fileData.organization, requestParams.Values, fileData.building, fileData.feedback);
                    break;
                case "building":
                    response = new ResponseUrlModel(fileData.organization, fileData.premise, requestParams.Values, fileData.feedback);
                    break;
                case "feedback":
                    response = new ResponseUrlModel(fileData.organization, fileData.premise, fileData.building, requestParams.Values);
                    break;

            }
            string json = JsonConvert.SerializeObject(response);
            File.WriteAllText(HttpContext.Current.Server.MapPath("~\\powerBI.json"), json);
            return "success";
        }

        public ResponseUrlModel GetData()
        {
            var data = File.ReadAllText(HttpContext.Current.Server.MapPath("~\\powerBI.json"));
            return JsonConvert.DeserializeObject<ResponseUrlModel>(data);
        }
    }
}
