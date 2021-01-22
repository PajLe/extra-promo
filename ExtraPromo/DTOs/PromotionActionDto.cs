namespace ExtraPromo.DTOs
{
    public class PromotionActionDto
    {
        public string Id { get; set; }

        public string Type { get; set; }

        public string[] Items { get; set; }

        public double? Flat { get; set; }

        public double? Percentage { get; set; }

        public bool? FreeShip { get; set; }
    }
}