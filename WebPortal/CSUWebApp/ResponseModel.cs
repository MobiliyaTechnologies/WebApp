using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace CSUWebApp
{

    public class PowerBIToken
    {
        public string AccessToken { get; set; }
        public string RefreshToken { get; set; }
        public string StatusCode { get; set; }
        public string Message { get; set; }
    }

    public class PowerBIURL
    {
        public string ReportURL { get { return "https://app.powerbi.com/reportEmbed?reportId=a30a9243-68de-4d0e-a208-9dff2b3f0d61"; } set { } }

        public string WeatherTileURL { get { return "https://app.powerbi.com/embed?dashboardId=cea6812f-9d03-4394-ae7b-cbdb779d9b6f&tileId=2c0f4146-6b11-4a7f-8af0-96b6ccb1d391"; } set { } }
    }
}