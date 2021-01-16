using ExtraPromo.DB.Cassandra.Interfaces;
using ExtraPromo.QueryEntities;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ExtraPromo.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class WeatherForecastController : ControllerBase
    {
        private static readonly string[] Summaries = new[]
        {
            "Freezing", "Bracing", "Chilly", "Cool", "Mild", "Warm", "Balmy", "Hot", "Sweltering", "Scorching"
        };

        private readonly ILogger<WeatherForecastController> _logger;
        private readonly ICassandraDbConnectionProvider _cassandraDbConnectionProvider;
        private readonly ICassandraQueryProvider _cassandraQueryProvider;

        public WeatherForecastController(ILogger<WeatherForecastController> logger, 
            ICassandraDbConnectionProvider cassandraDbConnectionProvider,
            ICassandraQueryProvider cassandraQueryProvider)
        {
            _logger = logger;
            _cassandraDbConnectionProvider = cassandraDbConnectionProvider;
            _cassandraQueryProvider = cassandraQueryProvider;
        }

        [HttpGet]
        public IEnumerable<WeatherForecast> Get()
        {
            Test testData;
            using (var session = _cassandraDbConnectionProvider.Connect())
            {
                testData = _cassandraQueryProvider.GetTestData(session);
            }
            var rng = new Random();
            return Enumerable.Range(1, 5).Select(index => new WeatherForecast
            {
                Date = DateTime.Now.AddDays(index),
                TemperatureC = rng.Next(-20, 55),
                Summary = Summaries[rng.Next(Summaries.Length)] + testData.Text + " " + testData.Id
            })
            .ToArray();
        }
    }
}
