using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ExtraPromo.DTOs
{
    public class GetPromotionDto
    {
        public string Id { get; set; }

        public string Type { get; set; }

        public string Description { get; set; }

        public IEnumerable<GetPromotionModifierDto> Modifiers { get; set; }

        public IEnumerable<GetPromotionActionDto> Actions { get; set; }
    }
}
