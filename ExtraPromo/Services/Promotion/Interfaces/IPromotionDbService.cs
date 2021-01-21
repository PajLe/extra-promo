﻿using ExtraPromo.DTOs;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ExtraPromo.Services.Promotion.Interfaces
{
    public interface IPromotionDbService
    {
        public Task<bool> AddPromotion(AddPromotionDto addPromotionDto);
    }
}