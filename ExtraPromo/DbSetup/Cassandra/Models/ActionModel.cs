using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ExtraPromo.DbSetup.Cassandra.Models
{
    public class ActionModel
    {
        public Guid Id { get; set; }

        public double Flat { get; set; }

        public bool FreeShip { get; set; }

        public double Percentage { get; set; }

        public IEnumerable<string> Items { get; set; }
    }
}
