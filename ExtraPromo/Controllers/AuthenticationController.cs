using ExtraPromo.Authentication.Interfaces;
using ExtraPromo.DTOs;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ExtraPromo.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthenticationController : ControllerBase
    {
        private readonly IAuthenticationService _authenticationService;

        public AuthenticationController(IAuthenticationService authenticationService)
        {
            _authenticationService = authenticationService;
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login(UserRegisterLoginDto userLoginInfo)
        {
            bool result;
            string message;
            try
            {
                result = await _authenticationService.Login(userLoginInfo.Username, userLoginInfo.Password);
                if (result)
                    message = "Successfully logged in.";
                else
                    message = "Invalid username/password combination.";
            }
            catch (Exception e)
            {
                return BadRequest(e.Message);
            }

            return Ok(new { Status = result, Message = message });
        }
    }
}
