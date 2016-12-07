using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;

namespace CSUWebApp
{
    public partial class Default : System.Web.UI.Page
    {
        protected void Page_Load(object sender, EventArgs e)
        {
            AuthenticateUser();
        }

        void AuthenticateUser()
        {
            //string authorityUri = "https://login.windows.net/common/oauth2/authorize/";

            //// Get the auth code
            //string code = Request.Params.GetValues(0)[0];

            //// Get auth token from auth code       
            //TokenCache TC = new TokenCache();

            //AuthenticationContext AC = new AuthenticationContext(authorityUri, TC);
            //ClientCredential cc = new ClientCredential
            //    (Properties.Settings.Default.ClientID,
            //    Properties.Settings.Default.ClientSecret);

            ////AuthenticationResult AR = AC.AcquireTokenByAuthorizationCode(code, new Uri(redirectUri), cc);
            //AuthenticationResult AR = AC.AcquireTokenByRefreshToken(ConfigurationSettings.AppSettings["RefreshToken"], cc);
            //ConfigurationSettings.AppSettings["AccessToken"] = AR.AccessToken;
            //ConfigurationSettings.AppSettings["RefreshToken"] = AR.RefreshToken;


            ////Set Session "authResult" index string to the AuthenticationResult
        }
    }
}