﻿using ExtraPromo.Services.Authentication.Interfaces;
using ExtraPromo.DTOs;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.Extensions.Configuration;
using System.Security.Claims;
using System.Text;
using ExtraPromo.QueryEntities;
using System.IdentityModel.Tokens.Jwt;
using Microsoft.IdentityModel.Tokens;
using Microsoft.AspNetCore.Authorization;
using ExtraPromo.DB.Cassandra.Interfaces;
using ExtraPromo.Services.Promotion.Interfaces;

namespace ExtraPromo.Controllers
{
    [Authorize]
    [ApiController]
    [Route("api/[controller]")]
    public class PromotionController : ControllerBase
    {
        private readonly IPromotionDbService _promotionDbService;

        public PromotionController(IPromotionDbService promotionDbService)
        {
            _promotionDbService = promotionDbService;
        }

        [HttpPost("add")]
        public async Task<IActionResult> AddPromotion(AddPromotionDto addPromotionDto)
        {
            bool result;
            string message;
            try
            {
                result = await _promotionDbService.AddPromotion(addPromotionDto);
                if (result)
                    message = "Successfully added the promotion.";
                else
                    message = "Couldn't add the promotion.";
            }
            catch (Exception e)
            {
                return Problem(e.Message);
            }

            return Ok(new { Status = result, Message = message });
        }

        [HttpGet("all")]
        public async Task<IActionResult> GetPromotions()
        {
            IEnumerable<GetPromotionDto> result;
            try
            {
                result = await _promotionDbService.GetAllPromotions();
            }
            catch (Exception e)
            {
                return Problem(e.Message);
            }

            return Ok(result);
        }

        [HttpDelete("delete/{promoId}")]
        public async Task<IActionResult> DeletePromotion(string promoId)
        {
            bool result;
            string message;
            try
            {
                Guid id = Guid.Parse(promoId);
                result = await _promotionDbService.DeletePromotion(id);
                if (result)
                    message = "Successfully deleted the promotion.";
                else
                    message = "Couldn't delete the promotion.";
            }
            catch (Exception e)
            {
                return Problem(e.Message);
            }

            return Ok(new { Status = result, Message = message });
        }

        [HttpGet("modifier/{modId}")]
        public async Task<IActionResult> GetModifierWithId(string modId)
        {
            PromotionModifierDto result;
            try
            {
                Guid id = Guid.Parse(modId);
                result = await _promotionDbService.GetModifierWithId(id);
            }
            catch (Exception e)
            {
                return Problem(e.Message);
            }

            return Ok(result);
        }

        [HttpGet("action/{actionId}")]
        public async Task<IActionResult> GetActionWithId(string actionId)
        {
            PromotionActionDto result;
            try
            {
                Guid id = Guid.Parse(actionId);
                result = await _promotionDbService.GetActionWithId(id);
            }
            catch (Exception e)
            {
                return Problem(e.Message);
            }

            return Ok(result);
        }

        [HttpPut("edit/{promoId}")]
        public async Task<IActionResult> EditPromotionWithId(string promoId, [FromBody] EditPromotionDto promotion)
        {
            bool result;
            string message;
            try
            {
                Guid id = Guid.Parse(promoId);
                result = await _promotionDbService.EditPromotion(id, promotion);
                if (result)
                    message = "Successfully edited the promotion.";
                else
                    message = "Couldn't edit the promotion.";
            }
            catch (Exception e)
            {
                return Problem(e.Message);
            }

            return Ok(new { Status = result, Message = message });
        }

        [HttpGet("{promoId}")]
        public async Task<IActionResult> GetPromotionWithId(string promoId)
        {
            GetPromotionDto result;
            try
            {
                Guid id = Guid.Parse(promoId);
                result = await _promotionDbService.GetPromotionWithId(id);
            }
            catch (Exception e)
            {
                return Problem(e.Message);
            }

            return Ok(result);
        }
    }
}
