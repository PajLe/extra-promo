using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ExtraPromo.DbSetup.Cassandra.Models
{
    public class PromotionModel
    {
        public Guid Id { get; set; }

        public string Type { get; set; }

        public string Description { get; set; }

        public Dictionary<Guid, string> Modifiers { get; set; }

        public Dictionary<Guid, string> Actions { get; set; }
    }
}
