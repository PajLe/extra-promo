using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ExtraPromo.DTOs
{
    public class AddPromotionDto
    {
        public string Id { get; set; }

        public string Type { get; set; }

        public string Description { get; set; }

        public IEnumerable<PromotionModifierDto> Modifiers { get; set; }

        public IEnumerable<PromotionActionDto> Actions { get; set; }
    }
}
