using Cassandra;
using ExtraPromo.QueryEntities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ExtraPromo.DB.Cassandra.Interfaces
{
    public interface ICassandraQueryProvider
    {
        Test GetTestData(ISession session);

        Task<T> QuerySingleOrDefault<T>(ISession session, string cql, params object[] args);

        Task<RowSet> ExecuteAsync(ISession session, string cql, params object[] args);

        Task<RowSet> ExecuteAsync(ISession session, BoundStatement boundStatement);
    }
}
