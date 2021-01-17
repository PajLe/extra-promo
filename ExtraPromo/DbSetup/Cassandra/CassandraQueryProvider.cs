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
        public async Task<RowSet> ExecuteAsync(ISession session, string cql, params object[] args)
        {
            var statement = new SimpleStatement(cql, args);
            return await session.ExecuteAsync(statement);
        }

        public Test GetTestData(ISession session)
        {
            IMapper mapper = new Mapper(session);
            Test test = mapper.Single<Test>("SELECT * FROM test LIMIT 1;");
            return test;
        }

        public async Task<T> QuerySingleOrDefault<T>(ISession session, string cql, params object[] args)
        {
            IMapper mapper = new Mapper(session);
            T obj = await mapper.SingleOrDefaultAsync<T>(cql, args);
            return obj;
        }
    }
}
