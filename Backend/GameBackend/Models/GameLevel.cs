namespace GameBackend.Models
{
    public class GameLevel
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public int MinSkill { get; set; }
        public int MaxSkill { get; set; }
    }
}
