using Cassandra;
using Cassandra.Mapping;
using ExtraPromo.DB.Cassandra.Interfaces;
using ExtraPromo.QueryEntities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ExtraPromo.DB.Cassandra
{
    public class CassandraQueryProvider : ICassandraQueryProvider
    {
        public Test GetTestData(ISession session)
        {
            IMapper mapper = new Mapper(session);
            Test test = mapper.Single<Test>("SELECT * FROM test LIMIT 1;");
            return test;
        }
    }
}
