﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ExtraPromo.DTOs
{
    public class GetPromotionModifierDto
    {
        public Guid Id { get; set; }

        public string Type { get; set; }
    }
}
