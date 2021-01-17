using ExtraPromo.Authentication.Interfaces;
using ExtraPromo.DB.Cassandra.Interfaces;
using ExtraPromo.DTOs;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ExtraPromo.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class TestController : ControllerBase
    {
        private readonly ICassandraDbConnectionProvider _cassandraDbConnectionProvider;
        private readonly ICassandraQueryProvider _cassandraQueryProvider;
        private readonly IAuthenticationService _authenticationService;

        public TestController(ICassandraDbConnectionProvider cassandraDbConnectionProvider,
            ICassandraQueryProvider cassandraQueryProvider,
            IAuthenticationService authenticationService)
        {
            _cassandraDbConnectionProvider = cassandraDbConnectionProvider;
            _cassandraQueryProvider = cassandraQueryProvider;
            _authenticationService = authenticationService;
        }

        [HttpGet]
        public async Task<IActionResult> Test(UserRegisterLoginDto user)
        {
            using (var session = _cassandraDbConnectionProvider.Connect())
            {
                try
                {
                    var result = await _authenticationService.Register(user.Username, user.Password);
                    return Ok(result);
                }
                catch(Exception)
                {
                    return BadRequest();
                }
            }

            return NoContent();
        }
    }
}
