using Microsoft.IdentityModel.Clients.ActiveDirectory;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.IO;
using System.Linq;
using System.Web;

namespace CSUWebApp
{
    public class Security
    {
        public static void AuthenticateUser()
        {
            string authorityUri = "https://login.windows.net/common/oauth2/authorize/";
            TokenCache TC = new TokenCache();

            AuthenticationContext authenticationContext = new AuthenticationContext(authorityUri, TC);
            ClientCredential clientCredential = new ClientCredential
                (ConfigurationSettings.AppSettings["ClientId"],
                ConfigurationSettings.AppSettings["ClientSecret"]);

            AuthenticationResult authenticationResult = authenticationContext.AcquireTokenByRefreshToken(ConfigurationSettings.AppSettings["Refresh_Token"], clientCredential);

            //Set Session "authResult" index string to the AuthenticationResult
            ConfigurationSettings.AppSettings["Access_Token"] = authenticationResult.AccessToken;
            ConfigurationSettings.AppSettings["Refresh_Token"] = authenticationResult.RefreshToken;

            //saveTokensToConstants(authenticationResult.AccessToken, authenticationResult.RefreshToken, filePath);
        }

        static void saveTokensToConstants(string accessToken, string refreshToken, string path)
        {
            using (StreamWriter streamWriter = new StreamWriter(path))
            {
                string tokenString = "config = {access_token: '" + accessToken + "' ,refresh_token: '" + refreshToken + "'};";
                streamWriter.WriteLine(tokenString);
            }
        }
    }
}