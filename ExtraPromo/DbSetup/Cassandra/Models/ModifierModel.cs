using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ExtraPromo.DbSetup.Cassandra.Models
{
    public class ModifierModel
    {
        public Guid Id { get; set; }

        public string Type { get; set; }

        public IEnumerable<string> Values { get; set; }
    }
}
