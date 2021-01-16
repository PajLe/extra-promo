using Cassandra;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ExtraPromo.DB.Cassandra.Interfaces
{
    public interface ICassandraDbConnectionProvider
    {
        ISession Connect(string keyspace = Settings.DefaultKeyspace);
    }
}
