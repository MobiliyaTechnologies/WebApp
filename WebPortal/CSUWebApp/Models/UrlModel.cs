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

    public class Values
    {
        public string generic { get; set; }

        public string monthly_consumption { get; set; }

        public string weekly_consumption { get; set; }

        public string day_wise_current_month { get; set; }

        public string current_month_prediction { get; set; }
    }

    public class ResponseUrlModel
    {
        public Values university { get; set; }

        public Values campus { get; set; }

        public Values building { get; set; }

        public ResponseUrlModel(Values universityValues, Values campusValues, Values buildingValues)
        {
            university = universityValues == null ? new Values() : universityValues;
            campus = campusValues == null ? new Values() : campusValues;
            building = buildingValues == null ? new Values() : buildingValues;
        }
    }
}