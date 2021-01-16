using Cassandra;
using ExtraPromo.DB.Cassandra.Interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ExtraPromo.DB.Cassandra
{
    public class CassandraDbConnectionProvider : ICassandraDbConnectionProvider
    {
        private readonly ICluster _cluster;

        public CassandraDbConnectionProvider(ICluster cluster)
        {
            _cluster = cluster;
        }

        public ISession Connect(string keyspace = Settings.DefaultKeyspace)
        {
            return _cluster.Connect(keyspace);
        }
    }
}
