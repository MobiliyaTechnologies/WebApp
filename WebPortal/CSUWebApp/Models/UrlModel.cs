using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace CSUWebApp.Models
{
    public class RequestUrlModel
    {
        public string Type { get; set; }

        public Values Values { get; set; }

    }

    public class FirebaseConfig
    {
        public string ApiKey { get; set; }
        public string AuthDomain { get; set; }
        public string DatabaseURL { get; set; }
        public string StorageBucket { get; set; }
        public string NotificationAuthorizationKey { get; set; }
        public string NotificationSender { get; set; }
        public string NotificationReceiver { get; set; }
    }

        

    public class Values
    {
        public string summary { get; set; }

        public string summarydetails { get; set; }

        public Values()
        {
            summary = "";
            summarydetails = "";
        }
    }

    

    public class ResponseUrlModel
    {
        public Values organization { get; set; }

        public Values premise { get; set; }

        public Values building { get; set; }

        public Values feedback { get; set; }


        public ResponseUrlModel(Values organizationValues, Values premiseValues, Values buildingValues, Values feedbackValues)
        {
            organization = organizationValues == null ? new Values() : organizationValues;
            premise = premiseValues == null ? new Values() : premiseValues;
            building = buildingValues == null ? new Values() : buildingValues;
            feedback = feedbackValues == null ? new Values() : feedbackValues;
        }

        public ResponseUrlModel()
        {
            organization = new Values();
            premise = new Values();
            building = new Values();
            feedback = new Values();
        }
    }
}