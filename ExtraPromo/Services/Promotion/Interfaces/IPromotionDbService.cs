using ExtraPromo.DTOs;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ExtraPromo.Services.Promotion.Interfaces
{
    public interface IPromotionDbService
    {
        public Task<bool> AddPromotion(AddPromotionDto addPromotionDto);

        public Task<IEnumerable<GetPromotionDto>> GetAllPromotions();

        public Task<bool> DeletePromotion(Guid id);

        public Task<PromotionModifierDto> GetModifierWithId(Guid id);
    }
}
