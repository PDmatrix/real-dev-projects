using System.Runtime.Serialization;

namespace Solution.Models
{
	public class Trending
	{
		[DataMember(Name = "id")]
		public string Id { get; set; }
		[DataMember(Name = "averageIncrease")]
		public long AverageIncrease { get; set; }
	}

}