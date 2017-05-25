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
    }

    

    public class ResponseUrlModel
    {
        public Values university { get; set; }

        public Values campus { get; set; }

        public Values building { get; set; }

        public Values feedback { get; set; }


        public ResponseUrlModel(Values universityValues, Values campusValues, Values buildingValues, Values feedbackValues)
        {
            university = universityValues == null ? new Values() : universityValues;
            campus = campusValues == null ? new Values() : campusValues;
            building = buildingValues == null ? new Values() : buildingValues;
            feedback = feedbackValues == null ? new Values() : feedbackValues;
        }
    }
}